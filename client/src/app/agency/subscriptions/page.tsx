import api from "@/services/api";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getSubscriptions() {
  const res = await api.get(`/shared/subscriptions/agency/getAll`);

  if (!res.data.success) return [];
  return res.data.data;
}

export default async function SubscriptionsPage() {
  const subscriptions = await getSubscriptions();

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">Available Subscriptions</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.length === 0 ? (
            <p className="text-gray-500">No subscriptions available.</p>
          ) : (
            subscriptions.map((sub: any) => (
              <div
                key={sub._id}
                className="bg-white border rounded-xl shadow p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{sub.name}</h2>
                  <p className="text-emerald-600 font-bold text-xl mt-2">₹{sub.price}</p>
                  <p className="text-gray-500 text-sm">{sub.duration} days</p>

                  <ul className="mt-4 text-gray-600 text-sm space-y-1">
                    {sub.features.map((f: string, i: number) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/vendor/subscriptions/${sub._id}`}
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
  );
}
