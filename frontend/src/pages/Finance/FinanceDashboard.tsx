import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  DollarSign,
  TrendingUp,
  RotateCcw,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
} from 'lucide-react';

export const FinanceDashboard: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Refund Modal state
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundOrderId, setRefundOrderId] = useState<string>('');
  const [refundOrderDetails, setRefundOrderDetails] = useState<any>(null);
  const [refundReason, setRefundReason] = useState('');
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  const fetchFinanceData = async () => {
    try {
      const [ovRes, ordRes] = await Promise.all([
        api.get('/finance/overview'),
        api.get(`/finance/orders?status=${statusFilter}&search=${searchTerm}`),
      ]);
      setOverview(ovRes.data);
      setOrders(ordRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, [statusFilter, searchTerm]);

  const openRefundModal = (order: any) => {
    setRefundOrderId(order.id);
    setRefundOrderDetails(order);
    setRefundReason('Learner requested refund within 7-day guarantee window.');
    setShowRefundModal(true);
  };

  const handleExecuteRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundOrderId || !refundReason) return;
    setIsProcessingRefund(true);

    try {
      await api.post('/finance/refund', {
        orderId: refundOrderId,
        reason: refundReason,
      });
      setShowRefundModal(false);
      fetchFinanceData();
      alert('Refund processed successfully. Student enrolment has been revoked.');
    } catch (e: any) {
      alert(e.response?.data?.error || 'Refund execution failed.');
    } finally {
      setIsProcessingRefund(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="text-xs uppercase font-bold text-emerald-600 tracking-wider">Revenue & Settlements</div>
        <h1 className="text-2xl font-black text-slate-900 mt-0.5">Finance Operations & Refund Console</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review reconciled gateway orders, investigate payment discrepancies, and process authorized refund rollbacks.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">${overview?.totalRevenue || 0}</div>
            <div className="text-xs text-slate-500 font-medium">Gross Revenue (USD)</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{overview?.paidCount || 0}</div>
            <div className="text-xs text-slate-500 font-medium">Captured Orders</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">${overview?.totalRefunded || 0}</div>
            <div className="text-xs text-slate-500 font-medium">Total Refunded ({overview?.refundedCount || 0})</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{overview?.pendingCount || 0}</div>
            <div className="text-xs text-slate-500 font-medium">Pending Reconciliation</div>
          </div>
        </div>
      </div>

      {/* Orders Filter & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order #, student email, name..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['ALL', 'PAID', 'PENDING', 'REFUNDED', 'FAILED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  statusFilter === st ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Order Number</th>
                <th className="p-4">Student</th>
                <th className="p-4">Course</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No orders matching search filter.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono font-bold text-slate-900">{o.orderNumber}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{o.user?.name}</div>
                      <div className="text-[11px] text-slate-400">{o.user?.email}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-800">{o.course?.title}</td>
                    <td className="p-4 font-bold text-slate-900">${o.amount} {o.currency}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'REFUNDED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {o.status === 'PAID' && (
                        <button
                          onClick={() => openRefundModal(o)}
                          className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg text-xs transition cursor-pointer"
                        >
                          Process Refund
                        </button>
                      )}
                      {o.status === 'REFUNDED' && (
                        <span className="text-[11px] text-slate-400 italic">
                          Refunded by {o.refund?.processedBy?.name?.split(' ')[0] || 'Staff'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Refund Modal */}
      {showRefundModal && refundOrderDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Authorize Refund & Revoke Access</h3>
            <p className="text-xs text-slate-500">
              PRD PAY-06 Compliance: Refunding this order will revoke the learner's active course enrolment and record an audit log event.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div><strong>Order:</strong> {refundOrderDetails.orderNumber}</div>
              <div><strong>Learner:</strong> {refundOrderDetails.user?.name} ({refundOrderDetails.user?.email})</div>
              <div><strong>Course:</strong> {refundOrderDetails.course?.title}</div>
              <div><strong>Refund Amount:</strong> ${refundOrderDetails.amount} USD</div>
            </div>

            <form onSubmit={handleExecuteRefund} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Documented Reason Code (Mandatory) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="State the justification for auditing..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRefundModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingRefund}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition"
                >
                  {isProcessingRefund ? 'Processing...' : 'Confirm Refund & Revoke'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
