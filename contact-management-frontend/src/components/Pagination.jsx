export default function Pagination({ page, totalPages, onPrev, onNext, disabled }) {
  const current = page + 1;
  return (
    <div className="pagination" role="navigation" aria-label="Pagination">
      <button type="button" className="btn btn-ghost" onClick={onPrev} disabled={disabled || page <= 0}>
        Previous
      </button>
      <span className="pagination-info">
        Page {current} of {Math.max(totalPages, 1)}
      </span>
      <button
        type="button"
        className="btn btn-ghost"
        onClick={onNext}
        disabled={disabled || page >= totalPages - 1 || totalPages === 0}
      >
        Next
      </button>
    </div>
  );
}
