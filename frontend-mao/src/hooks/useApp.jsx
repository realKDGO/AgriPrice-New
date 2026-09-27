import {createContext,useContext,useEffect,useState} from "react";
import {authService} from "../services/authService";
const Context=createContext(null);
export function AppProvider({children}){const[session,setSession]=useState(null),[authLoading,setAuthLoading]=useState(true),[toast,setToast]=useState("");
useEffect(()=>{authService.restore().then(async r=>{if(r.user?.role!=="MAO"||r.user?.status!=="ACTIVE"){await authService.logout().catch(()=>{});setSession(null);return}setSession(r.user)}).catch(()=>{}).finally(()=>setAuthLoading(false));const end=()=>setSession(null);window.addEventListener("agriprice:session-ended",end);return()=>window.removeEventListener("agriprice:session-ended",end)},[]);
async function login(email,password,rememberMe){const u=await authService.login(email,password,rememberMe);if(u?.role!=="MAO"||u?.status!=="ACTIVE"){await authService.logout().catch(()=>{});const e=new Error("This account does not belong to the MAO portal.");e.response={status:403,data:{message:"This account belongs to a different AgriPrice portal. Use the correct portal to sign in."}};throw e}setSession(u);return u}
async function logout(){await authService.logout();setSession(null)}
return <Context.Provider value={{session,authLoading,login,logout,notify:setToast,t:x=>x}}>{children}{toast&&<div className="toast" role="status">{toast}</div>}</Context.Provider>}
export const useApp=()=>useContext(Context);
