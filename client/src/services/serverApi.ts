import api from "@/services/api";
import { cookies } from "next/headers";

export async function createServerAxios() {
  const cookieStore = await cookies();  // 🔥 MUST AWAIT
  const cookieHeader = cookieStore.toString(); // works now

  const serverApi = api.create({
    withCredentials: true,
    headers: {
      Cookie: cookieHeader,   // forward cookies
    },
  });

  return serverApi;
}
