function ActionButton({ children, icon: Icon, variant = "primary", type = "button", className = "", ...props }) {
  return <button type={type} className={`btn btn-${variant} ${className}`.trim()} {...props}>{Icon ? <Icon /> : null}{children}</button>;
}
export default ActionButton;
