export default function Pagination({ pagination, changePage }) { //在這裡把getProducts改名為changePage以免混淆，┬但呼叫的仍是getProducts
  if (!pagination || !pagination.total_pages) return null;
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        {/* 上一頁 */}
        <li className={`page-item ${!pagination.has_pre ? 'disabled' : ''}`}>
          <a
            className="page-link"
            href="/"
            aria-label="Previous"
            onClick={(e) => {
              e.preventDefault();
              if (pagination.has_pre) {
                changePage({ page: pagination.current_page - 1 });
              }
            }}
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        {/* 頁碼清單 */}
        {Array.from({ length: pagination.total_pages }, (_, i) => (
          <li
            className={`page-item ${pagination.current_page === i + 1 ? 'active' : ''}`}
            key={`page_${i + 1}`}
          >
            <a
              className="page-link"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                changePage({ page: i + 1 });
              }}
            >
              {i + 1}
            </a>
          </li>
        ))}

        {/* 下一頁 */}
        <li className={`page-item ${!pagination.has_next ? 'disabled' : ''}`}>
          <a
            className="page-link"
            href="/"
            aria-label="Next"
            onClick={(e) => {
              e.preventDefault();
              if (pagination.has_next) {
                changePage({ page: pagination.current_page + 1 });
              }
            }}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}