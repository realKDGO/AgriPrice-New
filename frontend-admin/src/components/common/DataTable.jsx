function DataTable({ columns, rows, renderCell }) { return <div className="table-wrap"><table className="data-table"><thead><tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.id ?? index}>{columns.map(c => <td key={c.key}>{renderCell ? renderCell(row, c) : row[c.key]}</td>)}</tr>)}</tbody></table></div>; }
export default DataTable;
