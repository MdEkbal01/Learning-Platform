import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Smartphone,
  Building,
} from 'lucide-react';

export const Checkout: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'NETBANKING'>('CARD');
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [upiId, setUpiId] = useState('student@upi');

  useEffect(() => {
    setIsLoading(true);
    // 1. Fetch course details
    api.get(`/courses/${courseId}`)
      .then((res) => {
        setCourse(res.data);
        // 2. Create server-side order with trusted server price (PAY-01)
        return api.post('/payment/create-order', { courseId });
      })
      .then((orderRes) => {
        if (orderRes.data.isFree) {
          navigate(`/student/classroom/${courseId}`);
        } else {
          setOrder(orderRes.data);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to initiate checkout.');
      })
      .finally(() => setIsLoading(false));
  }, [courseId]);

  const handlePay = async (simulateFailure = false) => {
    if (!order) return;
    setError(null);
    setIsProcessing(true);

    try {
      // Simulate gateway payment processing delay
      await new Promise((r) => setTimeout(r, 1200));

      const payload = {
        orderId: order.orderId,
        paymentId: `pay_${Date.now()}_simulated`,
        signature: `sig_verified_${Date.now()}`,
        status: simulateFailure ? 'FAILED' : 'SUCCESS',
      };

      const verifyRes = await api.post('/payment/verify', payload);

      if (verifyRes.data.order?.status === 'PAID') {
        navigate(`/student/classroom/${courseId}?enrolled=true`);
      } else {
        setError('Payment verification failed. No access was granted.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payment failed at gateway.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white border border-rose-200 rounded-xl text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <h3 className="font-bold text-zinc-800 text-lg">Unable to Complete Order</h3>
        <p className="text-xs text-zinc-600 mt-2">{error}</p>
        <Link to="/courses" className="mt-4 px-4 py-2 bg-zinc-800 text-white text-xs font-semibold rounded-lg inline-block">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Secure Server-Side Checkout</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Complies with LMS PRD PAY-01 & PAY-02: Authoritative price verification & anti-tamper order flow.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Payment Method & Details */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1.5 transition cursor-pointer ${
                  paymentMethod === 'CARD'
                    ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 ring-2 ring-zinc-500/20'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Credit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1.5 transition cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 ring-2 ring-zinc-500/20'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('NETBANKING')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1.5 transition cursor-pointer ${
                  paymentMethod === 'NETBANKING'
                    ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 ring-2 ring-zinc-500/20'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Building className="w-5 h-5" />
                <span>Net Banking</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {paymentMethod === 'CARD' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-700 mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-700 mb-1">CVC / CVV</label>
                  <input
                    type="password"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'UPI' && (
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Virtual Payment Address (VPA / UPI ID)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs font-mono"
              />
            </div>
          )}

          {paymentMethod === 'NETBANKING' && (
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Select Bank</label>
              <select className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs">
                <option>Chase / J.P. Morgan</option>
                <option>Bank of America</option>
                <option>Wells Fargo</option>
                <option>Citigroup</option>
                <option>Barclays</option>
              </select>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => handlePay(false)}
              disabled={isProcessing}
              className="w-full py-3 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Confirm & Pay ${order?.amount}</span>
                </>
              )}
            </button>

            {/* Test buttons to demonstrate edge cases (PAY-03 & PAY-07) */}
            <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
                Test Edge Scenarios:
              </span>
              <button
                type="button"
                onClick={() => handlePay(true)}
                disabled={isProcessing}
                className="text-xs text-rose-600 hover:underline font-medium cursor-pointer"
              >
                Simulate Payment Declined
              </button>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-5 h-fit">
          <h3 className="font-bold text-zinc-900 text-sm">Order Summary</h3>

          <div className="flex space-x-3 pb-4 border-b border-zinc-100">
            <img
              src={course?.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'}
              alt={course?.title}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div>
              <div className="font-bold text-zinc-800 text-xs line-clamp-2">{course?.title}</div>
              <div className="text-[11px] text-zinc-500 mt-1">Instructor: {course?.instructorName}</div>
              <div className="text-[11px] text-zinc-500">Order ID: {order?.orderNumber}</div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Course Subtotal</span>
              <span>${order?.amount}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Platform & Access Fee</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Applicable Taxes (0%)</span>
              <span>$0.00</span>
            </div>
            <div className="pt-3 border-t border-zinc-100 flex justify-between font-extrabold text-sm text-zinc-900">
              <span>Total Payable</span>
              <span className="text-zinc-900 dark:text-zinc-100">${order?.amount}</span>
            </div>
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-[11px] text-zinc-500 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-zinc-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Idempotent Enrolment Security</span>
            </div>
            <p>
              Access is provisioned synchronously upon server-side signature verification. Receipts are automatically generated for your student account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
