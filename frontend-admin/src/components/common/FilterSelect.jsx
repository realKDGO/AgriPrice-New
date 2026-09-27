function FilterSelect({ value, onChange, children, ariaLabel = "Filter" }) { return <select className="filter-select" value={value} onChange={onChange} aria-label={ariaLabel}>{children}</select>; }
export default FilterSelect;
