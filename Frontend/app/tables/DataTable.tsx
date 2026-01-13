// Reusable Table component placeholder
interface TableProps {
  headers: string[]
  rows: any[]
  className?: string
}

export function Table({ headers, rows, className = '' }: TableProps) {
  return (
    <div className={`table-container ${className}`}>
      <table className="table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((_, colIndex) => (
                <td key={colIndex}>
                  {row[colIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
