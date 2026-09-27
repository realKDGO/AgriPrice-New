import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Brand from "./Brand";
import ActionButton from "./ActionButton";
function PortalSignIn({ portalName, title, description, emailPlaceholder, onSubmit }) {
  const [visible, setVisible] = useState(false);
  const handleSubmit = (event) => { event.preventDefault(); onSubmit?.(event); };
  return <main className="auth-page"><section className="auth-card"><div className="auth-brand"><Brand subtitle={portalName} /></div><h1>{title}</h1><p className="auth-description">{description}</p><form onSubmit={handleSubmit}><label className="form-group"><span className="form-label">Email Address</span><input className="form-control" type="email" placeholder={emailPlaceholder} autoComplete="email" required /></label><label className="form-group"><span className="form-label">Password</span><span className="password-wrap"><input className="form-control" type={visible ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" required /><button className="password-toggle" type="button" onClick={() => setVisible(v => !v)} aria-label={visible ? "Hide password" : "Show password"}>{visible ? <FiEyeOff /> : <FiEye />}</button></span></label><ActionButton className="auth-submit" type="submit">Sign In</ActionButton></form><a className="auth-back" href="/">← Back to AgriPrice</a></section></main>;
}
export default PortalSignIn;
