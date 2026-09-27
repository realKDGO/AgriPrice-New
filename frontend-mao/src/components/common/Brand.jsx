function Brand({ subtitle = "" }) {
  return (
    <div className="brand">
      <img className="brand-logo" src="/images/agriprice-logo.png" alt="AgriPrice" />
      <div className="brand-copy">
        <span className="brand-name">AgriPrice</span>
        {subtitle ? <span className="brand-subtitle">{subtitle}</span> : null}
      </div>
    </div>
  );
}
export default Brand;
