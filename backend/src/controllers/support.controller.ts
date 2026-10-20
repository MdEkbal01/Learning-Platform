import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { logAuditEvent } from '../services/audit.service';

export async function getFaqs(req: Request, res: Response): Promise<void> {
  try {
    const { category, search } = req.query;

    const whereClause: any = {};
    if (category && typeof category === 'string' && category !== 'ALL') {
      whereClause.category = category;
    }

    if (search && typeof search === 'string') {
      whereClause.OR = [
        { questionEn: { contains: search } },
        { answerEn: { contains: search } },
        { questionHi: { contains: search } },
        { answerHi: { contains: search } },
      ];
    }

    const faqs = await prisma.faqArticle.findMany({
      where: whereClause,
      orderBy: { orderIndex: 'asc' },
    });

    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve FAQs.' });
  }
}

export async function createSupportTicket(req: Request, res: Response): Promise<void> {
  try {
    const { category, subject, description, requesterEmail, requesterName } = req.body;
    const userId = req.user?.id;

    if (!subject || !description) {
      res.status(400).json({ error: 'Subject and description are required.' });
      return;
    }

    const email = req.user?.email || requesterEmail;
    const name = req.user?.name || requesterName;

    if (!email || !name) {
      res.status(400).json({ error: 'Name and email are required to open a support ticket.' });
      return;
    }

    let attachmentUrl: string | undefined;
    if (req.file) {
      attachmentUrl = `/api/uploads/${req.file.filename}`;
    }

    const ticketNumber = `SUP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId: userId || null,
        requesterEmail: email.trim().toLowerCase(),
        requesterName: name.trim(),
        category: category || 'GENERAL_INQUIRY',
        subject: subject.trim(),
        description: description.trim(),
        status: 'OPEN',
        priority: category === 'ACCOUNT_ACCESS' || category === 'PAYMENT_BILLING' ? 'HIGH' : 'MEDIUM',
        messages: {
          create: {
            senderId: userId || null,
            senderRole: 'USER',
            message: description.trim(),
            attachmentUrl,
          },
        },
      },
    });

    if (userId) {
      await logAuditEvent({
        actorId: userId,
        actorEmail: email,
        action: 'SUPPORT_TICKET_CREATED',
        entityType: 'SUPPORT_TICKET',
        entityId: ticket.id,
        details: { ticketNumber, category, subject },
        req,
      });
    }

    res.status(201).json({
      message: 'Support ticket submitted. A support specialist will respond shortly.',
      id: ticket.id,
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
    });
  } catch (error) {
    console.error('createSupportTicket error:', error);
    res.status(500).json({ error: 'Failed to create support ticket.' });
  }
}

export async function getSupportTickets(req: Request, res: Response): Promise<void> {
  try {
    const isStaff = ['SUPER_ADMIN', 'FINANCE_SUPPORT', 'MODERATOR'].includes(req.user?.role || '');
    const userId = req.user?.id;
    const { status, priority, category } = req.query;

    const whereClause: any = {};

    if (!isStaff) {
      // Regular user sees only their tickets
      whereClause.OR = [
        ...(userId ? [{ userId }] : []),
        { requesterEmail: req.user?.email || '' },
      ];
    }

    if (status && typeof status === 'string' && status !== 'ALL') {
      whereClause.status = status;
    }

    if (priority && typeof priority === 'string' && priority !== 'ALL') {
      whereClause.priority = priority;
    }

    if (category && typeof category === 'string' && category !== 'ALL') {
      whereClause.category = category;
    }

    const tickets = await prisma.supportTicket.findMany({
      where: whereClause,
      include: {
        assignedTo: { select: { name: true, email: true } },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Strip internalNotes for non-staff
    const sanitized = tickets.map((t) => ({
      ...t,
      internalNotes: isStaff ? t.internalNotes : undefined,
    }));

    res.json(sanitized);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve support tickets.' });
  }
}

export async function getSupportTicketDetails(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const isStaff = ['SUPER_ADMIN', 'FINANCE_SUPPORT', 'MODERATOR'].includes(req.user?.role || '');
    const userId = req.user?.id;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        messages: {
          where: isStaff ? {} : { isInternal: false }, // Hide internal staff notes from student!
          orderBy: { createdAt: 'asc' },
          include: {
            sender: { select: { id: true, name: true, role: true } },
          },
        },
      },
    });

    if (!ticket) {
      res.status(404).json({ error: 'Support ticket not found.' });
      return;
    }

    // Access check: owner or staff
    if (!isStaff && ticket.userId !== userId && ticket.requesterEmail !== req.user?.email) {
      res.status(403).json({ error: 'Unauthorized to view this ticket.' });
      return;
    }

    res.json({
      ...ticket,
      internalNotes: isStaff ? ticket.internalNotes : undefined,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve ticket details.' });
  }
}

export async function addTicketMessage(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { message, isInternal } = req.body;
    const isStaff = ['SUPER_ADMIN', 'FINANCE_SUPPORT', 'MODERATOR'].includes(req.user?.role || '');
    const userId = req.user?.id;

    if (!message || message.trim().length === 0) {
      res.status(400).json({ error: 'Message cannot be empty.' });
      return;
    }

    const ticket = await prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found.' });
      return;
    }

    let attachmentUrl: string | undefined;
    if (req.file) {
      attachmentUrl = `/api/uploads/${req.file.filename}`;
    }

    const newMessage = await prisma.supportTicketMessage.create({
      data: {
        ticketId: id,
        senderId: userId || null,
        senderRole: isStaff ? 'STAFF' : 'USER',
        message: message.trim(),
        attachmentUrl,
        isInternal: isStaff && Boolean(isInternal),
      },
      include: {
        sender: { select: { name: true, role: true } },
      },
    });

    // Update ticket status
    let newStatus = ticket.status;
    if (!isInternal) {
      if (isStaff && ticket.status === 'OPEN') {
        newStatus = 'IN_PROGRESS';
      } else if (!isStaff && ticket.status === 'WAITING_FOR_USER') {
        newStatus = 'IN_PROGRESS';
      }
    }

    await prisma.supportTicket.update({
      where: { id },
      data: { status: newStatus, updatedAt: new Date() },
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post ticket message.' });
  }
}

export async function updateTicketStatus(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status, priority, internalNotes, assignedToUserId } = req.body;
    const staffId = req.user!.id;

    const validStatuses = ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_USER', 'ESCALATED', 'RESOLVED'];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid ticket status.' });
      return;
    }

    const updated = await prisma.supportTicket.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
        ...(internalNotes !== undefined ? { internalNotes } : {}),
        ...(assignedToUserId !== undefined ? { assignedToUserId: assignedToUserId || null } : {}),
      },
    });

    await logAuditEvent({
      actorId: staffId,
      actorEmail: req.user!.email,
      action: 'SUPPORT_TICKET_STATUS_UPDATED',
      entityType: 'SUPPORT_TICKET',
      entityId: id,
      details: { status, priority, ticketNumber: updated.ticketNumber },
      req,
    });

    res.json({ message: 'Ticket status updated.', ticket: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ticket.' });
  }
}

export async function submitTicketFeedback(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { rating, comment } = req.body;

    if (!rating) {
      res.status(400).json({ error: 'Rating (1 to 5) is required.' });
      return;
    }

    const updated = await prisma.supportTicket.update({
      where: { id },
      data: {
        feedbackRating: parseInt(rating, 10),
        feedbackComment: comment ? comment.trim() : null,
      },
    });

    res.json({ message: 'Support feedback recorded. Thank you!', ticket: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit support feedback.' });
  }
}
