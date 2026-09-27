import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Field } from "../../components/common/UI";
import { useApp } from "../../hooks/useApp";
import { authService } from "../../services/authService";

function validEmail(value) {
  const email=value.trim();
  const ok=/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i.test(email);
  return ok && !new Set(["example","invalid","local","localhost","test"]).has(email.split(".").at(-1)?.toLowerCase());
}
function ErrorText({id,children}){return children?<small id={id} className="auth-field-error" role="alert">{children}</small>:null}
function TextField({label,name,error,...props}){const id=`${name}-error`;return <Field label={label}><input name={name} aria-label={label} aria-invalid={!!error} aria-describedby={error?id:undefined} {...props}/><ErrorText id={id}>{error}</ErrorText></Field>}
function Password({value,onChange,onBlur,error}){const[show,setShow]=useState(false);return <Field label="Password"><div className="password-field"><input name="password" aria-label="Password" type={show?"text":"password"} required autoComplete="current-password" value={value} onChange={onChange} onBlur={onBlur} aria-invalid={!!error}/><button type="button" className="password-toggle" aria-label={show?"Hide password":"Show password"} onClick={()=>setShow(!show)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div><ErrorText id="password-error">{error}</ErrorText></Field>}
export default function Auth({mode="login"}){
 const{login,notify}=useApp(),navigate=useNavigate(),formRef=useRef(null),forgot=mode==="forgot";
 const[busy,setBusy]=useState(false),[errors,setErrors]=useState({}),[form,setForm]=useState({email:"",password:"",rememberMe:false});
 const msg=(n,v=form)=>{if(n==="email"){if(!v.email.trim())return"Email address is required.";if(!validEmail(v.email))return"Enter an email address with a valid mail domain."}if(n==="password"&&!v.password)return"Password is required.";return""};
 const fields=()=>forgot?["email"]:["email","password"];
 const setValue=(n,v)=>{const next={...form,[n]:v};setForm(next);if(errors[n])setErrors(c=>({...c,[n]:msg(n,next)}))};
 const validate=()=>{const next=Object.fromEntries(fields().map(n=>[n,msg(n)]));setErrors(next);const first=fields().find(n=>next[n]);if(first)requestAnimationFrame(()=>formRef.current?.querySelector(`[name="${first}"]`)?.focus());return !first};
 const submit=async e=>{e.preventDefault();if(!validate())return;setBusy(true);try{if(forgot){const r=await authService.forgot(form.email.trim());notify(r.message);return}const u=await login(form.email.trim(),form.password,form.rememberMe);if(u){notify("Signed in successfully.");navigate("/")}}catch(err){const r=err.response,n={};if(r?.status===401)n.password="The email address or password is incorrect.";else n.email=r?.data?.message||"Unable to continue. Try again.";setErrors(n)}finally{setBusy(false)}};
 return <div className="auth-shell"><aside className="auth-story"><span className="auth-wordmark">AgriPrice</span><img className="auth-hero-logo" src="/images/agriprice-white.png" alt="" aria-hidden="true"/></aside><section className="auth-form"><h1>{forgot?"Forgot your password?":"Sign in"}</h1><p className="muted auth-description">{forgot?"Enter the email address associated with your AgriPrice account.":"Enter your credentials to access your dashboard."}</p><form ref={formRef} onSubmit={submit} noValidate><div className="form-stack"><TextField label="Email Address" name="email" type="email" required autoComplete="email" placeholder="you@email.com" value={form.email} onChange={e=>setValue("email",e.target.value)} onBlur={()=>setErrors(c=>({...c,email:msg("email")}))} error={errors.email}/>{!forgot&&<><Password value={form.password} onChange={e=>setValue("password",e.target.value)} onBlur={()=>setErrors(c=>({...c,password:msg("password")}))} error={errors.password}/><div className="auth-options"><label className="auth-check"><input name="rememberMe" type="checkbox" checked={form.rememberMe} onChange={e=>setValue("rememberMe",e.target.checked)}/><span>Remember me</span></label><Link className="text-link" to="/forgot-password">Forgot Password?</Link></div></>}<button disabled={busy} className="button w-full">{busy?"Please wait…":forgot?"Check Recovery Options":"Sign In"}</button></div></form>{forgot&&<p className="auth-switch"><Link className="text-link" to="/login">Remember your password? Sign in</Link></p>}</section></div>
}
