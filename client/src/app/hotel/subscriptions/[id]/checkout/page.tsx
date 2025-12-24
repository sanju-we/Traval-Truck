"use client";

import SubscriptionPurchaseForm from "@/components/payment/SubscriptionPurchaseForm";
import StripeProvider from "@/components/payment/StripeProvider";
import { useSearchParams, usePathname, useParams } from "next/navigation";

export default function SubscriptionCheckoutPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useParams();

  // ⭐ GET AMOUNT FROM QUERY PARAM
  const amount = Number(searchParams.get("amount"));

  // ⭐ GET SUBSCRIPTION ID FROM URL PATH
  const subscriptionId = params.id; // This is now correct!

  // ⭐ DETECT VENDOR ROLE BASED ON URL PREFIX
  let role: string = "vendor";

  if (pathname.startsWith("/hotel")) role = "hotel";
  if (pathname.startsWith("/restaurant")) role = "restaurant";
  if (pathname.startsWith("/agency")) role = "agency";

  return (
    <div className="min-h-screen p-6 flex justify-center items-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow max-w-md w-full border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Subscription Payment
        </h2>

        <StripeProvider>
          <SubscriptionPurchaseForm 
            amount={amount} 
            role={role} 
            id={params.id?.toString() ? params.id?.toString() : ''}      // ⭐ Now correctly passed
          />
        </StripeProvider>
      </div>
    </div>
  );
}
