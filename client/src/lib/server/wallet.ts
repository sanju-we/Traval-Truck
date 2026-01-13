import api from "@/services/api";
import toast from "react-hot-toast";
import { createServerAxios } from "@/services/serverApi";

export async function getWalletData( role: string) {
  try {
    const serverApi = await createServerAxios()
    const data = await serverApi.get(`/shared/wallet/${role}`);
    console.log(data);
    return await data.data;
  } catch (err) {
    console.log('Wallet fetch error:', err);
    return null;
  }
}
