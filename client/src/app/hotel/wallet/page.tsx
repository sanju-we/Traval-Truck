export const dynamic = "force-dynamic";

import SideNavbar from "@/components/hotel/SideNavbar";
import VendorFooter from "@/components/shared/Footer";
import WalletMain from "@/components/wallet/WalletMain";

export default function Page() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <SideNavbar />
      <div className="flex-1 flex flex-col p-8">
        <WalletMain role="agency" />
        <VendorFooter/>
      </div>
    </div>
  );
}
