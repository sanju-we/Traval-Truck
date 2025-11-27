import { createServerAxios } from "@/services/serverApi";
import Link from "next/link";
import BuyNowButton from "@/components/subscription/BuyNowButton";

export const dynamic = "force-dynamic";

async function getSubscriptionById(id: string) {
  const serverApi = await createServerAxios();
  const res = await serverApi.get(`/shared/subscriptions/agency/${id}`);
  return res.data.success ? res.data.data : null;
}

export default async function SubscriptionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
          ₹{subscription.amount}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Duration: {subscription.valid} days
        </p>

        <h3 className="text-lg font-semibold mt-6">Features</h3>
        <ul className="mt-2 space-y-1 text-gray-600">
          {subscription.features.map((feature: string, i: number) => (
            <li key={i}>• {feature}</li>
          ))}
        </ul>

        <div className="mt-8 flex gap-3">
          <Link
            href="/agency/subscriptions"
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Back
          </Link>

          {/* ⭐ BUY NOW (Stripe Checkout Session) */}
          <BuyNowButton
            subscriptionId={id}
            amount={subscription.amount}
            role="agency"
          />
        </div>
      </div>
    </div>
  );
}
