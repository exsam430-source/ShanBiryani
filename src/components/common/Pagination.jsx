import { ChevronLeft, ChevronRight } from 'lucide-react';
import { classNames } from '../../utils/helpers.js';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  className = ''
}) => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className={classNames('flex items-center justify-center gap-2', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-dark-lighter text-text-secondary hover:bg-dark-card hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {showPageNumbers && (
        <>
          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-1.5 rounded-lg bg-dark-lighter text-text-secondary hover:bg-dark-card hover:text-white transition-colors"
              >
                1
              </button>
              {startPage > 2 && <span className="text-text-muted">...</span>}
            </>
          )}

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={classNames(
                'px-3 py-1.5 rounded-lg transition-colors',
                page === currentPage
                  ? 'bg-primary text-white'
                  : 'bg-dark-lighter text-text-secondary hover:bg-dark-card hover:text-white'
              )}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-text-muted">...</span>}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-1.5 rounded-lg bg-dark-lighter text-text-secondary hover:bg-dark-card hover:text-white transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-dark-lighter text-text-secondary hover:bg-dark-card hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;