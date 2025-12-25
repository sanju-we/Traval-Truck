"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SideNavbar from "@/components/restaurant/SideNavbar";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/api";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  valid: number;
  endDate?: string;
  features: string[];
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeSubscription, setActiveSubscription] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);

      const [allRes, currentRes] = await Promise.all([
        api.get("/shared/subscriptions/restaurant/getAll"),
        api.get("/shared/subscriptions/restaurant/current"),
      ]);

      if (allRes.data.success) {
        setSubscriptions(allRes.data.data || []);
      }

      // 👇 THIS IS THE MISSING PART
      if (currentRes.data.success && currentRes.data.data) {
        const current = currentRes.data.data;

        const subscriptionRes = await api.get(
          `/shared/subscriptions/restaurant/${current.subscriptionId}`
        );

        if (subscriptionRes.data.success) {
          setActiveSubscription({
            ...subscriptionRes.data.data,   // name, amount, valid, features
            endDate: current.endDate,        // from ownership record
          });
        } else {
          setActiveSubscription(null);
        }
      } else {
        setActiveSubscription(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SideNavbar />

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Subscriptions
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your current plan or upgrade anytime
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
          ) : (
            <>
              {/* ================= ACTIVE SUBSCRIPTION ================= */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Current Subscription
                </h2>

                {activeSubscription ? (
                  <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-lg text-white">
                    <div className="absolute top-4 right-4 flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                      <CheckCircle size={16} />
                      Active
                    </div>

                    <h3 className="text-2xl font-bold mb-2">
                      {activeSubscription.name}
                    </h3>

                    <p className="opacity-90">
                      Valid for {activeSubscription.valid} days
                    </p>

                    {activeSubscription.endDate && (
                      <p className="opacity-90 mt-1">
                        Expires on{" "}
                        <span className="font-semibold">
                          {new Date(
                            activeSubscription.endDate
                          ).toLocaleDateString()}
                        </span>
                      </p>
                    )}

                    <p className="text-3xl font-bold mt-4">
                      ₹{activeSubscription.amount}
                    </p>

                    <ul className="mt-5 space-y-1 text-sm opacity-95">
                      {activeSubscription.features?.map((f, i) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6 flex items-start gap-3">
                    <AlertTriangle className="text-yellow-600 mt-1" />
                    <div>
                      <p className="font-semibold text-yellow-800">
                        No active subscription
                      </p>
                      <p className="text-yellow-700 text-sm mt-1">
                        Choose a plan below to unlock premium features.
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* ================= AVAILABLE PLANS ================= */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Available Subscription Plans
                </h2>

                {subscriptions.length === 0 ? (
                  <div className="bg-white border rounded-xl p-10 text-center shadow-sm">
                    <p className="text-gray-500">
                      No subscription plans are available right now.
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subscriptions.map((sub) => (
                      <div
                        key={sub.id}
                        className="bg-white border rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between"
                      >
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {sub.name}
                          </h3>

                          <p className="text-emerald-600 font-bold text-2xl mt-2">
                            ₹{sub.amount}
                          </p>

                          <p className="text-gray-500 text-sm">
                            {sub.valid} days validity
                          </p>

                          <ul className="mt-4 text-sm text-gray-600 space-y-1">
                            {sub.features.map((f, i) => (
                              <li key={i}>• {f}</li>
                            ))}
                          </ul>
                        </div>

                        <Link
                          href={`/restaurant/subscriptions/${sub.id}`}
                          className="m-6 mt-0 text-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
