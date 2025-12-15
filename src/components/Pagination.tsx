/** 後端回傳的分頁結構 */
export type PaginationData = {
  total_pages: number;
  current_page: number;
  has_pre: boolean;
  has_next: boolean;
};

/** 元件 props 型別 */
type PaginationProps = {
  pagination: PaginationData | null;
  changePage: (page: number) => void;
};

export default function Pagination({
  pagination,
  changePage,
}: PaginationProps): JSX.Element | null {
  if (!pagination || pagination.total_pages <= 1) return null;

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        {/* 上一頁 */}
        <li className={`page-item ${!pagination.has_pre ? "disabled" : ""}`}>
          <a
            className="page-link"
            href="/"
            aria-label="Previous"
            onClick={(e) => {
              e.preventDefault();
              if (pagination.has_pre) changePage(pagination.current_page - 1);
            }}
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        {/* 頁碼清單 */}
        {Array.from({ length: pagination.total_pages }, (_, i) => {
          const page = i + 1;
          return (
            <li
              className={`page-item ${
                pagination.current_page === page ? "active" : ""
              }`}
              key={`page_${page}`}
            >
              <a
                className="page-link"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  changePage(page);
                }}
              >
                {page}
              </a>
            </li>
          );
        })}

        {/* 下一頁 */}
        <li className={`page-item ${!pagination.has_next ? "disabled" : ""}`}>
          <a
            className="page-link"
            href="/"
            aria-label="Next"
            onClick={(e) => {
              e.preventDefault();
              if (pagination.has_next) changePage(pagination.current_page + 1);
            }}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
