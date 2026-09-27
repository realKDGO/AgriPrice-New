function Panel({ title, meta, children, flush = false }) {
  return <section className="panel">{(title || meta) && <div className="panel-header"><h2 className="panel-title">{title}</h2>{meta && <span className="panel-meta">{meta}</span>}</div>}<div className={`panel-body ${flush ? "panel-flush" : ""}`}>{children}</div></section>;
}
export default Panel;
