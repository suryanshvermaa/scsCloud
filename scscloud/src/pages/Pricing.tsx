import React, { useEffect, useState } from 'react';
import { FaVideo, FaServer, FaDatabase, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { HiLightningBolt } from 'react-icons/hi';
import { getAllCostDetails, formatCost, CostDetails } from '../utils/costApi';
import { notifier } from '../utils/notifier';

const Pricing: React.FC = () => {
  const [costDetails, setCostDetails] = useState<CostDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCostDetails();
  }, []);

  const fetchCostDetails = async () => {
    try {
      setLoading(true);
      const data = await getAllCostDetails();
      setCostDetails(data);
    } catch (error) {
      console.error('Error fetching cost details:', error);
      notifier.error('Failed to load pricing information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="animate-spin text-4xl text-cyan-500" />
          <p className="text-slate-600 dark:text-slate-300">Loading pricing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full ring-1 ring-slate-900/10 bg-slate-900/5 px-4 py-2 text-sm text-slate-600 dark:ring-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 mb-6">
            <HiLightningBolt className="text-cyan-500" />
            <span>Transparent & Affordable Pricing</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Simple, Pay-as-You-Go Pricing
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            No hidden fees. No surprises. Only pay for what you use with our transparent pricing model.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* HLS Transcoding Card */}
          <div className="relative rounded-2xl border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
            
            <div className="p-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg mb-6">
                <FaVideo className="text-2xl" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                HLS Video Transcoding
              </h3>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                  {costDetails ? formatCost(costDetails.transcodingCostPerMBinRupees) : '₹0.00'}
                </span>
                <span className="text-slate-600 dark:text-slate-300">per MB</span>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Convert your videos to adaptive streaming formats with multiple quality levels.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-cyan-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Automatic quality optimization
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-cyan-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Multiple resolution outputs (360p, 480p, 720p, 1080p)
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-cyan-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Fast processing & delivery
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-cyan-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    S3 compatible storage output
                  </span>
                </div>
              </div>
              
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-600">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Example calculation:</p>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  100 MB video = <span className="font-semibold">
                    {costDetails ? formatCost((parseFloat(costDetails.transcodingCostPerMBinRupees) * 100).toString()) : '₹0.00'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Static Web Hosting Card */}
          <div className="relative rounded-2xl border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600"></div>
            
            <div className="p-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg mb-6">
                <FaServer className="text-2xl" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                Static Web Hosting
              </h3>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                  {costDetails ? formatCost(costDetails.hostingCostPer30DaysInRupees) : '₹0.00'}
                </span>
                <span className="text-slate-600 dark:text-slate-300">per 30 days</span>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Deploy your static websites with lightning-fast performance and custom domains.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Custom subdomain routing
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Deploy from Git repository
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Unlimited bandwidth
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    SSL/TLS encryption included
                  </span>
                </div>
              </div>
              
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-600">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Billing cycle:</p>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  Fixed 30-day period (manual renewal required)
                </p>
              </div>
            </div>
          </div>

          {/* Object Storage Card */}
          <div className="relative rounded-2xl border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600"></div>
            
            <div className="p-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg mb-6">
                <FaDatabase className="text-2xl" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                Object Storage
              </h3>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                  {costDetails ? formatCost(costDetails.objectStorageCostPerGBInRupeesFor30Days) : '₹0.00'}
                </span>
                <span className="text-slate-600 dark:text-slate-300">per GB / 30 days</span>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                S3-compatible object storage for all your files, images, and backups.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-purple-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    S3-compatible API
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-purple-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Unlimited buckets & objects
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-purple-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    99.9% uptime guarantee
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-purple-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Direct browser uploads
                  </span>
                </div>
              </div>
              
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-600">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Example calculation:</p>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  5 GB storage = <span className="font-semibold">
                    {costDetails ? formatCost((parseFloat(costDetails.objectStorageCostPerGBInRupeesFor30Days) * 5).toString()) : '₹0.00'}
                  </span> / 30 days
                </p>
              </div>
            </div>
          </div>

          {/* Container Service Card */}
          <div className="relative rounded-2xl border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600"></div>
            
            <div className="p-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg mb-6">
                <FaServer className="text-2xl" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                Container Service
              </h3>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                  Pay As You Go
                </span>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Deploy Docker containers with managed orchestration and automatic scaling.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-sky-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Flexible CPU & memory allocation
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-sky-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Auto-scaling & load balancing
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-sky-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Custom domain support
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-sky-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Environment variables & secrets
                  </span>
                </div>
              </div>
              
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-600">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Pricing model:</p>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  Based on resource usage (CPU, memory, runtime)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <div className="inline-block rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 dark:border-slate-600 p-8 max-w-3xl">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Why Choose SCS Cloud?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  💰 No Hidden Costs
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  What you see is what you pay. No surprise charges or hidden fees.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  🚀 Instant Activation
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Start using services immediately after purchase. No waiting period.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  🔒 Secure & Reliable
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Enterprise-grade security with 99.9% uptime SLA guarantee.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-50 text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="group rounded-lg border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700 p-6">
              <summary className="font-semibold text-slate-900 dark:text-slate-50 cursor-pointer list-none flex justify-between items-center">
                How do I purchase services?
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-300">
                Purchase SCS Coins from your dashboard and use them to activate any service. The cost will be automatically deducted from your coin balance.
              </p>
            </details>
            
            <details className="group rounded-lg border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700 p-6">
              <summary className="font-semibold text-slate-900 dark:text-slate-50 cursor-pointer list-none flex justify-between items-center">
                Can I extend my service after expiration?
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-300">
                Yes! For hosting and object storage, you can renew your service for another 30 days. Transcoding is charged per video processed.
              </p>
            </details>
            
            <details className="group rounded-lg border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700 p-6">
              <summary className="font-semibold text-slate-900 dark:text-slate-50 cursor-pointer list-none flex justify-between items-center">
                What payment methods do you accept?
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-300">
                We accept all major payment methods through our secure payment gateway including UPI, cards, net banking, and wallets.
              </p>
            </details>
            
            <details className="group rounded-lg border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700 p-6">
              <summary className="font-semibold text-slate-900 dark:text-slate-50 cursor-pointer list-none flex justify-between items-center">
                Is there a refund policy?
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-300">
                SCS Coins are non-refundable. However, unused coins remain in your account and never expire, so you can use them whenever needed.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
