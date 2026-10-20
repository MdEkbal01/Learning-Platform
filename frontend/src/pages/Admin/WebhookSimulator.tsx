import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Terminal,
} from 'lucide-react';

export const WebhookSimulator: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [event, setEvent] = useState<string>('payment.captured');
  const [responseLog, setResponseLog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/finance/orders');
      setOrders(res.data);
      if (res.data.length > 0 && !selectedOrderId) {
        setSelectedOrderId(res.data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSimulate = async () => {
    if (!selectedOrderId) return;
    setIsLoading(true);
    setResponseLog(null);

    try {
      const res = await api.post('/payment/simulate-webhook', {
        event,
        orderId: selectedOrderId,
        paymentId: `webhook_pay_${Date.now()}`,
      });
      setResponseLog(res.data);
      fetchOrders();
    } catch (e: any) {
      setResponseLog(e.response?.data || { error: 'Webhook simulation failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <div className="text-xs uppercase font-bold text-zinc-900 dark:text-zinc-100 tracking-wider">Gateway Sandbox</div>
        <h1 className="text-2xl font-black text-zinc-900 mt-0.5">Payment Webhook & Idempotency Harness</h1>
        <p className="text-xs text-zinc-500 mt-1">
          PRD PAY-02, PAY-04 & PAY-07: Test asynchronous server-to-server webhook callbacks and verify duplicate callback idempotency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-zinc-900">Configure Webhook Payload</h2>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Target Order</label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.orderNumber} • ${o.amount} • {o.status} ({o.user?.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Webhook Event Type</label>
            <select
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs"
            >
              <option value="payment.captured">payment.captured (Simulate Successful Payment)</option>
              <option value="payment.failed">payment.failed (Simulate Failed Charge)</option>
              <option value="order.paid">order.paid (Duplicate Callback / Idempotency Test)</option>
            </select>
          </div>

          {selectedOrder && (
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs space-y-1">
              <div><strong>Order Number:</strong> {selectedOrder.orderNumber}</div>
              <div><strong>Current Status:</strong> <span className="font-bold text-zinc-900 dark:text-zinc-100">{selectedOrder.status}</span></div>
              <div><strong>Course:</strong> {selectedOrder.course?.title}</div>
              <div><strong>Student:</strong> {selectedOrder.user?.name}</div>
            </div>
          )}

          <button
            onClick={handleSimulate}
            disabled={isLoading}
            className="w-full py-2.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Dispatch Simulated Webhook</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Terminal Response Output */}
        <div className="lg:col-span-6 bg-zinc-900 rounded-2xl p-6 shadow-md text-emerald-400 font-mono text-xs flex flex-col h-[400px]">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-zinc-400">
            <div className="flex items-center space-x-1.5">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Server Webhook Response Console</span>
            </div>
            <span className="text-[10px]">HTTP 200 OK</span>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            {responseLog ? (
              <pre className="whitespace-pre-wrap">{JSON.stringify(responseLog, null, 2)}</pre>
            ) : (
              <div className="text-zinc-500 italic">
                Awaiting webhook dispatch. Click "Dispatch Simulated Webhook" to execute payload against server endpoint.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-zinc-800 text-[10px] text-zinc-500 flex items-center justify-between">
            <span>Server Endpoint: POST /api/payment/simulate-webhook</span>
            <span className="text-emerald-500">HMAC-SHA256 Enforced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
