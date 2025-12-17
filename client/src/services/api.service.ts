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

  const message = error.data.message || error.response.data.message || error.message || 'Request failed';
  console.log('Api request error', message)

  if (error.status == 401) {
    toast.error(message)
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
    const res = await api.post(url,body,{headers,validateStatus:(status)=> status != 401 && status !== 403})
    console.log('response from api',res)

    if(!res.data.success){
      console.log('res',res)
      handleAPIerror(res,options)
    }
    return res.data
  } catch (error) {
    console.log('fucking king')
    // handleAPIerror(error,options)
    return null
  }
}

export const getRequest = async <T = any>(
  url: string,
  params?: object,
  options: ApiOption = defaultOptions
): Promise<T | null> => {
  try {
    console.log('sending request to ',url)
    const res = await api.get(url, params ? { params , validateStatus:(status)=> status != 401 && status !== 403 } : {validateStatus:(status)=> status != 401 && status !== 403});
    if (!res.data.success) {
      handleAPIerror(res,options)
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
    const res = await api.patch(url, body, { headers,validateStatus:(status)=> status != 401 && status !== 403 });
    if (!res.data.success) {
      handleAPIerror(res,options)
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
    const res = await api.put(url, body, { headers,validateStatus:(status)=> status != 401 && status !== 403 });
    if (!res.data.success) {
      handleAPIerror(res,options)
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
    const res = await api.delete(url, params ? { params, validateStatus:(status)=> status != 401 && status !== 403 } : {validateStatus:(status)=> status != 401 && status !== 403});
    if (!res.data.success) {
      handleAPIerror(res,options)
    }
    return res.data;
  } catch (error: any) {
    handleAPIerror(error, options);
    return null;
  }
};