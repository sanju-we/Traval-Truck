'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import toast from 'react-hot-toast';
import SideNavbar from '@/components/restaurant/SideNavbar';

interface SubscriptionPlan {
  _id: string;
  name: string;
  amount: number;
  category: string;
  valid: number;
  description: string;
  features: string[];
}

export default function VendorSubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/restaurant/subscription/getAll');

      if (res.data.success) {
        setPlans(res.data.data);
      } else {
        toast.error(res.data.message || 'Failed to load subscription plans.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while fetching plans.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setSubscribing(planId);
      // Assuming this should be /restaurant/subscription/subscribe instead of getAll
      const res = await api.post('/restaurant/subscription/subscribe', { planId });

      if (res.data.success) {
        toast.success('You have successfully subscribed!');
        fetchPlans();
      } else {
        toast.error(res.data.message || 'Failed to subscribe.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Subscription failed.');
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavbar />

      <main className="flex-1 min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
            Subscription Plans
          </h1>

          {plans.length === 0 ? (
            <p className="text-center text-gray-500">No plans available right now.</p>
          ) : (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan._id}
                  className="relative border border-gray-200 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] duration-200"
                >
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-semibold text-gray-800">
                      {plan.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1 px-4">{plan.description}</p>
                  </CardHeader>

                  <CardContent className="flex flex-col items-center pt-2 pb-6">
                    <div className="text-4xl font-bold text-indigo-600 mb-3">
                      ₹{plan.amount}
                      <span className="text-base text-gray-500"> / {plan.valid} days</span>
                    </div>

                    <ul className="text-sm text-gray-700 mb-6 space-y-1 w-full px-6">
                      {plan.features.length > 0 ? (
                        plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <Dot className="text-indigo-500 w-5 h-5" />
                            <span>{feature}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400 italic">No features listed</li>
                      )}
                    </ul>

                    <Button
                      onClick={() => handleSubscribe(plan._id)}
                      disabled={subscribing === plan._id}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                      {subscribing === plan._id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Subscribing...
                        </>
                      ) : (
                        'Subscribe'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
