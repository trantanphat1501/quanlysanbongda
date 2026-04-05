import './Table.css'

export function Table({ children, className = '' }) {
  return (
    <div className="table-wrapper">
      <table className={`table ${className}`}>{children}</table>
    </div>
  )
}

export function TableHeader({ children }) {
  return <thead className="table-header">{children}</thead>
}

export function TableBody({ children }) {
  return <tbody className="table-body">{children}</tbody>
}

export function TableRow({ children, className = '', ...props }) {
  return <tr className={`table-row ${className}`} {...props}>{children}</tr>
}

export function TableHead({ children, className = '' }) {
  return <th className={`table-head ${className}`}>{children}</th>
}

export function TableCell({ children, className = '' }) {
  return <td className={`table-cell ${className}`}>{children}</td>
}
