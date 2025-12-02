export const dynamic = "force-dynamic";
import { Header } from "@/components/user/header/page";

import WalletMain from "@/components/wallet/WalletMain";

export default function Page() {
  return (
    <>
    <Header/>
    <WalletMain role="user" />
    </>
  );
}
