import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Code,
  Lightbulb,
  Check,
  Copy,
  Zap,
  HelpCircle,
  BookOpen,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface AiTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentCourseTitle?: string;
  currentLessonTitle?: string;
}

interface Message {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
  codeSnippet?: string;
}

const PRESET_PROMPTS = [
  {
    icon: Lightbulb,
    label: 'Explain in Simple Terms',
    prompt: 'Can you explain the core concepts of this lesson in simple terms with an analogy?',
  },
  {
    icon: Code,
    label: 'Debug Code & Architecture',
    prompt: 'How do I handle transactional rollback and error boundaries in this architecture?',
  },
  {
    icon: Zap,
    label: 'Generate Practice Questions',
    prompt: 'Generate 3 challenging multiple-choice practice quiz questions with explanations based on this topic.',
  },
  {
    icon: BookOpen,
    label: 'Summarize Key Takeaways',
    prompt: 'Provide a structured 5-bullet summary of key takeaways and production best practices for this lesson.',
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_welcome',
    sender: 'AI',
    text: `Hello! I am your **Ken AI Study Companion**, inspired by next-generation intelligent tutoring systems. I am here to assist you with real-time concept explanations, code debugging, and assessment prep.\n\nHow can I help you accelerate your mastery today?`,
    timestamp: 'Just now',
  },
];

export const AiTutorDrawer: React.FC<AiTutorDrawerProps> = ({
  isOpen,
  onClose,
  currentCourseTitle = 'Engineering Curriculum',
  currentLessonTitle = 'Active Lesson',
}) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isTyping) return;

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      sender: 'USER',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Context-aware intelligent response synthesis
    setTimeout(() => {
      let aiResponse = '';
      const p = prompt.toLowerCase();

      if (p.includes('explain') || p.includes('simple terms')) {
        aiResponse = `### Core Concept Breakdown\n\nThink of this pattern like an **air-traffic control tower**:\n\n1. **Isolation**: Individual services operate independently without blocking adjacent runways.\n2. **Idempotency**: Retried signals produce identical states without double-charging or duplicate flights.\n3. **Eventual Consistency**: State updates propagate reliably across distributed nodes via transactional outboxes.\n\n> **Key Principle**: Never couple write operations to external synchronous APIs. Always buffer through an asynchronous log with verified signatures.`;
      } else if (p.includes('code') || p.includes('debug') || p.includes('rollback')) {
        aiResponse = `### Production Implementation Pattern\n\nHere is how to structure robust transactional consistency with double-entry ledgers:\n\n\`\`\`typescript\n// Safe Transactional Execution\nawait prisma.$transaction(async (tx) => {\n  const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });\n  const ledgerEntry = await tx.ledger.create({\n    data: {\n      orderId,\n      amount,\n      status: 'CAPTURED',\n      idempotencyKey: \`tx_\${orderId}\`,\n    },\n  });\n  await tx.enrolment.upsert({\n    where: { userId_courseId: { userId, courseId } },\n    create: { userId, courseId, status: 'ACTIVE' },\n    update: { status: 'ACTIVE' },\n  });\n});\n\`\`\`\n\nEnsure database indexes are set on \`(orderId, idempotencyKey)\` to guarantee sub-millisecond lookups under load.`;
      } else if (p.includes('quiz') || p.includes('question') || p.includes('practice')) {
        aiResponse = `### Module Practice Assessment\n\n**Question 1: Which technique guarantees that retried webhook deliveries do not double-credit course access?**\n- A) Timestamp comparison\n- **B) Unique Idempotency Key stored in Redis/DB with atomic check (Correct)**\n- C) Random client nonces\n- D) IP address throttling\n\n**Question 2: What is the primary benefit of the Outbox Pattern in microservices?**\n- **A) Atomic persistence of domain events alongside database transactions (Correct)**\n- B) Faster TLS handshakes\n- C) Compression of HTTP payloads\n\n**Question 3: How does least-privilege RBAC protect student exam integrity?**\n- Restricts quiz answer modification permissions strictly to automated grading workers and authenticated faculty.`;
      } else if (p.includes('summarize') || p.includes('takeaway')) {
        aiResponse = `### 5 Essential Takeaways for "${currentLessonTitle}":\n\n1. **Zero-Trust Input**: Always validate external inputs using strict schema validators (Zod / Prisma).\n2. **Stateless Scalability**: Store user authentication in signed stateless tokens, avoiding sticky sessions.\n3. **Idempotent Webhooks**: Guard all payment transitions with 24-hour persistent idempotency keys.\n4. **Audit Immutability**: Write every sensitive governance event to an append-only security ledger.\n5. **Cryptographic Proof**: Completion awards are signed using SHA-256 hashes registered in public verification registries.`;
      } else {
        aiResponse = `Great inquiry regarding **${currentCourseTitle}**!\n\nTo master this concept effectively:\n\n- **Step 1**: Review the lecture video around the timestamp where data structures are declared.\n- **Step 2**: Open the virtual code lab and implement the minimal working prototype.\n- **Step 3**: Attempt the knowledge assessment quiz at the end of the module to verify your retention score.\n\nWould you like me to generate a tailored code sample or explain specific syntax?`;
      }

      const aiMsg: Message = {
        id: 'ai_' + Date.now(),
        sender: 'AI',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Dim backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-16">
        <div className="w-screen max-w-md sm:max-w-xl bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/60">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-400 p-0.5 shadow-md flex items-center justify-center text-black">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-black text-zinc-900 dark:text-white">
                    Ken AI Tutor
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Real-Time AI</span>
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[260px]">
                  Assisting: {currentLessonTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                aria-label="Close AI Tutor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Preset Prompts */}
          <div className="p-3 bg-zinc-100/60 dark:bg-zinc-900/30 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto">
            <div className="flex items-center space-x-2 min-w-max">
              {PRESET_PROMPTS.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handleSend(p.prompt)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition shadow-2xs cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-500" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((m) => {
              const isUser = m.sender === 'USER';
              return (
                <div
                  key={m.id}
                  className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                        : 'bg-gradient-to-tr from-amber-400 to-amber-600 text-black shadow-xs'
                    }`}
                  >
                    {isUser ? 'YOU' : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-black text-white dark:bg-white dark:text-black font-medium'
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200/40 dark:border-zinc-800/60 text-[10px] text-zinc-400">
                      <span>{m.timestamp}</span>
                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => handleCopy(m.id, m.text)}
                          className="flex items-center space-x-1 hover:text-black dark:hover:text-white transition cursor-pointer"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-black flex items-center justify-center text-xs font-bold shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3.5 rounded-2xl flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-150" />
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-300" />
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2 font-medium">
                    Synthesizing response...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-200 dark:border-zinc-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Ken AI about code, concepts, or quizzes..."
                className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-black dark:focus:border-white transition"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="px-4 py-2.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            </form>
            <div className="text-[10px] text-zinc-400 text-center mt-2 flex items-center justify-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Ken AI Companion • Powered by High-Performance LLM Context Engine</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
