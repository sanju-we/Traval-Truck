import Link from "next/link";
import SideNavbar from "@/components/agency/SideNavbar";
import { createServerAxios } from "@/services/serverApi";

export const dynamic = "force-dynamic";

async function getSubscriptions() {
  const serverApi = await createServerAxios();
  const res = await serverApi.get(`/shared/subscriptions/agency/getAll`);
  return res.data.success ? res.data.data : [];
}

async function getActiveSubscription() {
  const serverApi = await createServerAxios();
  const res = await serverApi.get(`/shared/subscriptions/agency/current`);
  console.log(res.data.data)
  return res.data.success ? res.data.data : null;
}

export default async function SubscriptionsPage() {
  const [subscriptions, activeSubscription] = await Promise.all([
    getSubscriptions(),
    getActiveSubscription()
  ]);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="w-64 hidden md:block bg-white">
        <SideNavbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800">Subscriptions</h1>

          {/* ⭐ Already Purchased Subscription */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Your Active Subscription
            </h2>

            {activeSubscription ? (
              <div className="bg-green-50 border border-green-300 rounded-xl p-6 shadow">
                <h3 className="text-xl font-bold text-green-700">
                  {activeSubscription.name}
                </h3>

                <p className="text-gray-700">
                  Valid for: {activeSubscription.valid} days
                </p>

                <p className="text-gray-700">
                  Expiry Date: {new Date(activeSubscription.duration.endingDate).toLocaleDateString()}
                </p>

                <p className="text-green-800 font-semibold mt-2">
                  ₹{activeSubscription.amount}
                </p>

                <ul className="mt-4 text-gray-700 space-y-1">
                  {activeSubscription.features.map((f: string, i: number) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6 shadow">
                <p className="text-yellow-800">
                  You do not have an active subscription.
                </p>
              </div>
            )}
          </div>

          {/* ⭐ Available Subscriptions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Available Subscription Plans
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.length === 0 ? (
                <p className="text-gray-500">No subscriptions available.</p>
              ) : (
                subscriptions.map((sub: any) => (
                  <div
                    key={sub.id}
                    className="bg-white border rounded-xl shadow p-6 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {sub.name}
                      </h3>

                      <p className="text-emerald-600 font-bold text-xl mt-2">
                        ₹{sub.amount}
                      </p>

                      <p className="text-gray-500 text-sm">
                        {sub.valid} days
                      </p>

                      <ul className="mt-4 text-gray-700 text-sm space-y-1">
                        {sub.features.map((f: string, i: number) => (
                          <li key={i}>• {f}</li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={`/agency/subscriptions/${sub.id}`}
                      className="mt-6 block text-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      View Details
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
