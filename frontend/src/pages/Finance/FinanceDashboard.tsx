import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { PointerLight } from '../../components/PointerLight';
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
  CreditCard,
  Layers,
  ArrowUpRight,
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

  const grossRev = overview?.totalRevenue || 0;
  const refundedAmt = overview?.totalRefunded || 0;
  const netRev = Math.max(0, grossRev - refundedAmt);
  const refundRate = grossRev > 0 ? ((refundedAmt / grossRev) * 100).toFixed(1) : '0.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative overflow-hidden">
      {/* CodeByGaurav signature ambient pointer light */}
      <PointerLight intensity="subtle" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] uppercase font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Revenue & Settlements
            </span>
            <span className="flex items-center text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5" />
              Gateway Reconciled
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Finance Operations & Refund Console
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review reconciled gateway orders, investigate payment discrepancies, and process authorized refund rollbacks.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-1 transition duration-300 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">${grossRev}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Gross Revenue (USD)</div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-1 transition duration-300 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{overview?.paidCount || 0}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Captured Orders</div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-1 transition duration-300 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">${refundedAmt}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Refunded ({overview?.refundedCount || 0})
            </div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-1 transition duration-300 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">${netRev}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Net Retained (USD)</div>
          </div>
        </div>
      </div>

      {/* Visual Settlement Health & Refund Rate Gauge */}
      <div className="relative z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Settlement Health & Refund Ratio</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current refund rate is {refundRate}%, well below the industry standard threshold of 5.0%.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-48 bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.max(10, 100 - parseFloat(refundRate))}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {(100 - parseFloat(refundRate)).toFixed(1)}% Retained
          </span>
        </div>
      </div>

      {/* Orders Filter & Search */}
      <div className="relative z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order #, student email, name..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            {['ALL', 'PAID', 'PENDING', 'REFUNDED', 'FAILED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800 text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-900 dark:text-white">{ord.id.substring(0, 12)}...</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{ord.user?.name}</div>
                      <div className="text-[10px] text-slate-400">{ord.user?.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {ord.course?.title}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      ${ord.amount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'PAID'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : ord.status === 'REFUNDED'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            : ord.status === 'PENDING'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {ord.status === 'PAID' && (
                        <button
                          onClick={() => openRefundModal(ord)}
                          className="px-3 py-1 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-bold text-xs rounded-lg transition"
                        >
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Confirmation Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <RotateCcw className="w-5 h-5 text-rose-600" />
              <span>Process Authorized Refund</span>
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Refunding order{' '}
              <strong className="text-slate-900 dark:text-white font-mono">
                {refundOrderDetails?.id.substring(0, 14)}...
              </strong>{' '}
              for <strong className="text-slate-900 dark:text-white">${refundOrderDetails?.amount}</strong> will
              immediately revoke student course access.
            </p>

            <form onSubmit={handleExecuteRefund} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mandatory Refund Reason
                </label>
                <textarea
                  rows={3}
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Learner requested cancellation within guarantee window."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRefundModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingRefund}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50"
                >
                  {isProcessingRefund ? 'Revoking Access...' : 'Execute Refund'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
