export default function AdminPagination({ page, pageSize, count, setPage }) {
  const isLastPage = (page + 1) * pageSize >= count

  function handlePrevious() {
    setPage((currentPage) => Math.max(currentPage - 1, 0))
  }

  function handleNext() {
    setPage((currentPage) =>
      (currentPage + 1) * pageSize < count ? currentPage + 1 : currentPage
    )
  }

  return (
    <div className="mb-2 flex justify-end space-x-2">
      <button
        onClick={handlePrevious}
        disabled={page === 0}
        className="rounded border border-theater-light bg-theater-light px-2 py-1 disabled:opacity-50"
      >
        Назад
      </button>
      <button
        onClick={handleNext}
        disabled={isLastPage}
        className="rounded border border-theater-light bg-theater-light px-2 py-1 disabled:opacity-50"
      >
        Напред
      </button>
    </div>
  )
}
