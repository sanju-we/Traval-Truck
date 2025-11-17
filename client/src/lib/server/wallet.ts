import api from "@/services/api";
import toast from "react-hot-toast";
import { createServerAxios } from "@/services/serverApi";

export async function getWalletData( role: string) {
  try {
    console.log('sanju');
    const serverApi = await createServerAxios()
    const res = await serverApi.get(`/shared/wallet/${role}`);
    console.log(res);
    if (!res.data.success) toast.error('failed to fetch user data')
    return await res.data.data;
  } catch (err) {
    console.error('Wallet fetch error:', err);
    return null;
  }
}
