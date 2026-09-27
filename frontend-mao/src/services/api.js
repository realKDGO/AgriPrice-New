import axios from "axios";
let accessToken=null,refreshing=null;
export const setAccessToken=(token)=>{accessToken=token};
const localApiBase=`${window.location.protocol}//${window.location.hostname}:5000/api/v1`;
export const api=axios.create({baseURL:import.meta.env.VITE_API_BASE_URL||localApiBase,withCredentials:true,timeout:20000});
api.interceptors.request.use(config=>{if(accessToken)config.headers.Authorization=`Bearer ${accessToken}`;return config;});
export async function refreshSession(){if(!refreshing)refreshing=api.post("/auth/refresh",{}, {_skipRefresh:true}).then(r=>{setAccessToken(r.data.data.accessToken);return r.data.data;}).finally(()=>{refreshing=null});return refreshing;}
api.interceptors.response.use(r=>r,async error=>{const config=error.config;if(error.response?.status===401&&config&&!config._retry&&!config._skipRefresh&&!config.url.startsWith("/auth/")){config._retry=true;try{await refreshSession();return api(config)}catch{setAccessToken(null);window.dispatchEvent(new Event("agriprice:session-ended"));}}return Promise.reject(error)});
export const get=async(path,params)=>(await api.get(path,{params})).data.data;
export const post=async(path,body)=>(await api.post(path,body)).data.data;
export const errorMessage=e=>e.response?.data?.errors?.map(x=>x.message).join(" ")||e.response?.data?.message||"Unable to connect. Please try again.";
