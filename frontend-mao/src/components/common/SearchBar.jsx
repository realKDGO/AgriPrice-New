import { FiSearch } from "react-icons/fi";
function SearchBar({ value, onChange, placeholder = "Search..." }) { return <label className="search-control"><FiSearch /><input value={value} onChange={onChange} placeholder={placeholder} /></label>; }
export default SearchBar;
