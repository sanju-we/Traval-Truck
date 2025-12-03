export const dynamic = "force-dynamic";
import SideNavbar from "@/components/agency/SideNavbar";

import WalletMain from "@/components/wallet/WalletMain";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavbar />
      <div className="flex-1 p-8">
        <WalletMain role="agency" />
      </div>
    </div>
  );
}
