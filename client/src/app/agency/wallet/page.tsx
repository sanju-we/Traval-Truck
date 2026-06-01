export const dynamic = "force-dynamic";
import VendorFooter from "@/components/shared/Footer";

import WalletMain from "@/components/wallet/WalletMain";

export default function Page() {
  return (
    <div className="flex-1 flex flex-col p-8">
      <WalletMain role="agency" />
      <VendorFooter/>
    </div>
  );
}
