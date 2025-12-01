import api from "./api"
import toast from "react-hot-toast"

type ApiOption = {
  showToast?: boolean
}

const defaultOptions: ApiOption = {
  showToast: true
}

const handleAPIerror = (error: any, options: ApiOption) => {
  console.error('Api error', error)

  if (!options.showToast) return

  const message = error.response.data.message || error.message || 'Request failed';
  console.log('Api request error', message)

  if (error.response.status == 401) {
    toast.error("Please login")
  } else {
    toast.error(message)
  }
}

export const postRequest = async < T = any> (url: string, body: object | FormData, options: ApiOption = defaultOptions) : Promise<T | null> => {
  try {
    const headers : Record<string,string> = {}
    if(!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }
    const res = await api.post(url,body,{headers})
    console.log('response from api',res)

    if(!res.data.success){
      throw new Error(res.data.message || "Request failed")
    }
    return res.data
  } catch (error) {
    handleAPIerror(error,options)
    return null
  }
}

export const getRequest = async <T = any>(
  url: string,
  params?: object,
  options: ApiOption = defaultOptions
): Promise<T | null> => {
  try {
    const res = await api.get(url, params ? { params } : {});
    if (!res.data.ok) {
      throw new Error(res.data.message || 'Request failed');
    }
    return res.data;
  } catch (error: any) {
    handleAPIerror(error, options);
    return null;
  }
};

export const patchRequest = async <T = any>(
  url: string,
  body: object,
  options: ApiOption = defaultOptions
): Promise<T | null> => {
  try {
    const headers: Record<string, string> = {};
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    const res = await api.patch(url, body, { headers });
    if (!res.data.ok) {
      throw new Error(res.data.message || 'Request failed');
    }
    return res.data;
  } catch (error: any) {
    handleAPIerror(error, options);
    return null;
  }
}

export const putRequest = async <T = any>(
  url: string,
  body: object,
  options: ApiOption = defaultOptions
): Promise<T | null> => {
  try {
    const headers: Record<string, string> = {};
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    const res = await api.put(url, body, { headers });
    if (!res.data.ok) {
      throw new Error(res.data.message || 'Request failed');
    }
    return res.data;
  } catch (error: any) {
    handleAPIerror(error, options);
    return null;
  }
}

export const deleteRequest = async <T = any>(
  url: string,
  params?: object,
  options: ApiOption = defaultOptions
): Promise<T | null> => {
  try {
    const res = await api.delete(url, params ? { params } : {});
    if (!res.data.ok) {
      throw new Error(res.data.message || 'Request failed');
    }
    return res.data;
  } catch (error: any) {
    handleAPIerror(error, options);
    return null;
  }
};