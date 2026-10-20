import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  Printer,
  X,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export const StudentOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.get('/student/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Orders, Invoices & Receipts</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Review your verified course transactions, payment receipts, and billing history.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Course Item</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-400">
                    No purchase history found. Free courses do not require billing receipts.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-50/80 transition">
                    <td className="p-4 font-mono font-bold text-zinc-900">{o.orderNumber}</td>
                    <td className="p-4 font-semibold text-zinc-800">{o.course?.title}</td>
                    <td className="p-4 text-zinc-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-zinc-900">${o.amount} {o.currency}</td>
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
                      <button
                        onClick={() => setSelectedInvoice(o)}
                        className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold rounded-lg text-xs transition cursor-pointer"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Tax Invoice / Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-zinc-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Invoice Header */}
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-zinc-100 pb-4">
                <div>
                  <div className="text-xl font-black text-zinc-900">AuraLMS</div>
                  <div className="text-xs text-zinc-400">Accredited Online Learning Platform</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">RECEIPT</div>
                  <div className="text-xs text-zinc-600 font-mono mt-0.5">{selectedInvoice.orderNumber}</div>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-400 font-semibold uppercase tracking-wider block text-[10px]">Billed To:</span>
                  <div className="font-bold text-zinc-800">{user?.name}</div>
                  <div className="text-zinc-500">{user?.email}</div>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 font-semibold uppercase tracking-wider block text-[10px]">Transaction Details:</span>
                  <div className="text-zinc-600">Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}</div>
                  <div className="text-zinc-600">Gateway: {selectedInvoice.paymentGateway}</div>
                </div>
              </div>

              {/* Item Table */}
              <div className="border border-zinc-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold">
                    <tr>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 font-semibold text-zinc-800">
                        {selectedInvoice.course?.title}
                        <div className="text-[10px] text-zinc-400 font-normal">Full curriculum entitlement & certificate</div>
                      </td>
                      <td className="p-3 text-right font-bold text-zinc-900">
                        ${selectedInvoice.amount}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="border-t border-zinc-200 bg-zinc-50/50 font-bold">
                    <tr>
                      <td className="p-3 text-zinc-700">Total Paid</td>
                      <td className="p-3 text-right text-zinc-900 dark:text-zinc-100 font-extrabold text-sm">
                        ${selectedInvoice.amount} {selectedInvoice.currency}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {selectedInvoice.refund && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  <strong>Refund Processed:</strong> ${selectedInvoice.refund.amount} refunded on{' '}
                  {new Date(selectedInvoice.refund.createdAt).toLocaleDateString()} (Reason: {selectedInvoice.refund.reason})
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Digitally Verified & Stamped</span>
                </div>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
