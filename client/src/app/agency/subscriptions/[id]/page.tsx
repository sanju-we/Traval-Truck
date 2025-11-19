import Link from "next/link";

export const dynamic = "force-dynamic";

async function getSubscriptionById(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/vendor/subscriptions/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function SubscriptionDetailsPage({ params }: any) {
  const { id } = params;
  const subscription = await getSubscriptionById(id);

  if (!subscription) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Subscription not found.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8 border">
        <h1 className="text-2xl font-bold text-gray-800">{subscription.name}</h1>

        <p className="text-emerald-600 font-semibold text-2xl mt-3">
          ₹{subscription.price}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Duration: {subscription.duration} days
        </p>

        <h3 className="text-lg font-semibold mt-6">Features</h3>
        <ul className="mt-2 space-y-1 text-gray-600">
          {subscription.features.map((feature: string, i: number) => (
            <li key={i}>• {feature}</li>
          ))}
        </ul>

        <div className="mt-8 flex gap-3">
          <Link
            href="/vendor/subscriptions"
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Back
          </Link>

          <Link
            href={`/vendor/subscriptions/${id}/checkout?amount=${subscription.price}`}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
