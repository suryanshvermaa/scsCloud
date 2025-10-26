import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {load} from '@cashfreepayments/cashfree-js';
import { notifier } from "../utils/notifier";
import { 
  CreditCard, 
  TrendingUp, 
  Wallet, 
  Clock, 
  Download, 
  Plus,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  Calendar,
  DollarSign,
  Activity
} from "lucide-react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

interface IPaymentHistory {
  _id: string;
  orderId: string;
  amount: number;
  paymentId: string;
  updatedAt: string;
  status?: string;
}

interface IUsageStats {
  hosting: number;
  transcoding: number;
  storage: number;
}

const BillingDashboard: React.FC = () => {
  const [scsCoins, setScsCoins] = useState<number>(0);
  const [paymentHistory, setPaymentHistory] = useState<IPaymentHistory[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [showAddFunds, setShowAddFunds] = useState<boolean>(false);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const navigate = useNavigate();
  // Mock usage stats - replace with actual API calls
  const [usageStats] = useState<IUsageStats>({
    hosting: 20,
    transcoding: 0,
    storage: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoadingData(true);
      const accessToken = Cookies.get("AccessCookie");
      
      if (!accessToken) {
        navigate('/login');
        return;
      }

      // Load balance
      const balanceRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/scs-coins?token=${accessToken}`
      );
      setScsCoins(balanceRes.data.data.data.scsCoins);

      // Load payment history
      try {
        const historyRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/payment/history?token=${accessToken}`
        );
        const history = historyRes.data?.data.data || [];
        console.log(history);
        setPaymentHistory(Array.isArray(history) ? history : []);
      } catch (e) {
        console.error('Failed to load payment history:', e);
      }

      setLoadingData(false);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setLoadingData(false);
    }
  };

  const handlePayment = async () => {
    if (!phoneNumber || !inputAmount || parseFloat(inputAmount) <= 0) {
      notifier.warning('Please enter valid amount and phone number');
      return;
    }

    try {
      setProcessing(true);
      const accessToken = Cookies.get("AccessCookie");
      
      const orderRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        {
          AccessCookie: accessToken,
          paymentAmount: parseFloat(inputAmount),
          phoneNumber
        }
      );

      console.log(orderRes.data.data.a);
      const { payment_session_id, order_id } = orderRes.data.data.a;

      // Load Cashfree SDK first
      const cashfree = await load({
        mode: "sandbox",
      });

      const checkoutOptions = {
        paymentSessionId: payment_session_id,
        redirectTarget: "_modal",
      };
      // Start checkout process
      cashfree.checkout(checkoutOptions).then(async (result: any) => {      
        if (result.error) {
          notifier.error(`Payment cancelled or failed: ${result.error.message || 'Unknown error'}`);
          setProcessing(false);
          return;
        }

        if (result.paymentDetails) {
          // Payment successful, verify on backend
          try {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
              {
                AccessCookie: accessToken,
                orderId: order_id
              }
            );

            console.log('Payment Verified Successfully');
            
            // Update UI after successful payment
            setShowAddFunds(false);
            setInputAmount("");
            setPhoneNumber("");
            await loadDashboardData();
            notifier.success('Payment successful!');
          } catch (verifyError: any) {
            console.error('Verification Failed:', verifyError);
            notifier.error('Payment completed but verification failed. Please contact support.');
          }
        }
        
        setProcessing(false);
      }).catch((error: any) => {
        console.error('Checkout Failed:', error);
        notifier.error(`Checkout failed: ${error.message || 'Unknown error occurred'}`);
        setProcessing(false);
      });

    } catch (error: any) {
      console.error('Payment Failed:', error);
      notifier.error(`Payment failed: ${error.message || 'Unknown error occurred'}`);
      setProcessing(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  const totalSpent = paymentHistory.reduce((sum, p) => sum + p.amount, 0);
  const thisMonthSpent = paymentHistory
    .filter(p => {
      const date = new Date(p.updatedAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, p) => sum + p.amount, 0);

  if (loadingData) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-e-transparent" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Billing & Payments</h1>
        <p className="text-muted-foreground">Manage your account balance and track spending</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Current Balance */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-6">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary/10" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Current Balance</span>
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">₹{(scsCoins || 0).toFixed(2)}</div>
            <button
              onClick={() => setShowAddFunds(true)}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Funds
            </button>
          </div>
        </div>

        {/* This Month */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">This Month</span>
            <Calendar className="h-5 w-5 text-accent" />
          </div>
          <div className="text-3xl font-bold text-foreground">₹{(thisMonthSpent || 0).toFixed(2)}</div>
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Current billing cycle</span>
          </div>
        </div>

        {/* Total Spent */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Spent</span>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">₹{(totalSpent || 0).toFixed(2)}</div>
          <div className="mt-2 flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="h-4 w-4" />
            <span>{paymentHistory.length} transactions</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Payment Methods</span>
            <CreditCard className="h-5 w-5 text-violet-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">1</div>
          <div className="mt-2 text-sm text-muted-foreground">Cashfree Gateway</div>
        </div>
      </div>

      {/* Usage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Current Usage */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Current Usage</h2>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            {/* Hosting */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Static Web Hosting</span>
                <span className="text-sm font-semibold text-primary">₹{usageStats.hosting}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${scsCoins > 0 ? Math.min((usageStats.hosting / scsCoins) * 100, 100) : 0}%` }}
                />
              </div>
            </div>

            {/* Transcoding */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">HLS Transcoding</span>
                <span className="text-sm font-semibold text-accent">₹{usageStats.transcoding}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${scsCoins > 0 ? Math.min((usageStats.transcoding / scsCoins) * 100, 100) : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Estimated total</span>
              <span className="text-lg font-bold text-foreground">
                ₹{(usageStats.hosting + usageStats.transcoding + usageStats.storage).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => setShowAddFunds(true)}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-accent transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Add Funds</span>
            </button>
            
            <button
              onClick={() => navigate('/profile')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              <Download className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-foreground">View Profile</span>
            </button>

            <button
              onClick={() => navigate('/hosting-service')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-foreground">Hosting Service</span>
            </button>

            <button
              onClick={() => navigate('/hls-transcoding-service')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-foreground">HLS Transcoding</span>
            </button>
          </div>

          {scsCoins < 50 && (
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-200">Low Balance</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    Your balance is running low. Add funds to continue using services.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment History */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Transaction History</h2>
          <button className="text-sm text-primary hover:text-accent transition-colors">
            View All
          </button>
        </div>

        {paymentHistory.length > 0 ? (
          <div className="space-y-3">
            {paymentHistory.slice(0, 5).map((payment) => (
              <div
                key={payment._id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-500/10">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Payment Received</p>
                    <p className="text-sm text-muted-foreground">Order ID: {payment.orderId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">+₹{payment.amount}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No transactions yet</p>
            <button
              onClick={() => setShowAddFunds(true)}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent"
            >
              Make your first payment
            </button>
          </div>
        )}
      </div>

      {/* Add Funds Modal */}
      <Dialog open={showAddFunds} onClose={setShowAddFunds} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-xl bg-card border border-border text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="p-6">
                <DialogTitle className="text-xl font-semibold text-foreground mb-6">
                  Add Funds to Your Account
                </DialogTitle>

                <div className="space-y-4">
                  {/* Quick Amount Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Quick Select
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {quickAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setInputAmount(amount.toString())}
                          className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                            inputAmount === amount.toString()
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary hover:bg-secondary'
                          }`}
                        >
                          ₹{amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Custom Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Info Box */}
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm text-foreground">
                      <strong>Amount to be added:</strong> ₹{inputAmount || '0'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Secure payment via Cashfree gateway
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowAddFunds(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors font-medium"
                    disabled={processing}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={processing || !inputAmount || !phoneNumber}
                    className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-accent transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : 'Proceed to Pay'}
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default BillingDashboard;
