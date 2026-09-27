import PageHeader from "./PageHeader";
function PlaceholderPage({ title, description }) { return <div className="placeholder-wrap"><PageHeader title={title} description={description} /><div className="placeholder-card"><h2>Page foundation ready</h2><p>The route, portal shell, shared styles, logo, header, and navigation are already connected. Build this page using the reusable components in <strong>src/components/common</strong>.</p></div></div>; }
export default PlaceholderPage;
