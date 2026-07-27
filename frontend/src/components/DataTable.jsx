import { formatProductMessage } from '../utils/formatters.js';

function DataTable({ columns, data, loading, emptyMessage = 'No records found.' }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#263247]">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-[#0B1220] text-xs uppercase tracking-wide text-[#94A3B8]">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`px-4 py-3 font-semibold ${column.className || ''}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#263247] bg-[#151B2B]">
          {loading && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-[#94A3B8]">
                Loading records...
              </td>
            </tr>
          )}
          {!loading && data.map((row) => (
            <tr key={row.id || row.assignmentId || row.orderId || row.employeeUserId || row.trackingNumber || row.key} className="transition hover:bg-[#1B2233]">
              {columns.map((column) => (
                <td key={column.key} className={`px-4 py-3 align-middle text-[#CBD5E1] ${column.cellClassName || ''}`}>
                  {column.render ? column.render(row) : typeof row[column.key] === 'string' ? formatProductMessage(row[column.key]) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
          {!loading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-[#94A3B8]">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
