import { classNames } from '../../utils/helpers.js';
import { SectionLoader } from './Loader.jsx';
import EmptyState from './EmptyState.jsx';
import { Database } from 'lucide-react';

const Table = ({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className = ''
}) => {
  if (isLoading) {
    return <SectionLoader />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={Database}
        title="No data"
        description={emptyMessage}
      />
    );
  }

  return (
    <div className={classNames('overflow-x-auto', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-lighter">
            {columns.map((column, index) => (
              <th
                key={index}
                className={classNames(
                  'px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider',
                  column.className
                )}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-lighter">
          {data.map((row, rowIndex) => (
            <tr
              key={row._id || rowIndex}
              onClick={() => onRowClick?.(row)}
              className={classNames(
                'hover:bg-dark-lighter/50 transition-colors',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={classNames(
                    'px-4 py-3 text-sm',
                    column.cellClassName
                  )}
                >
                  {column.render
                    ? column.render(row[column.accessor], row)
                    : row[column.accessor]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;