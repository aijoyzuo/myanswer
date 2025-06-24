export default function Pagination({ pagination, changePage }) { //在這裡把getProducts改名為changePage以免混淆，┬但呼叫的仍是getProducts
  if (!pagination) return null;
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        <li className="page-item">
          <a className={`page-link ${pagination.has_pre ? '' : 'disabled'}`} //布林值，如果有前一頁，不做變動，如果沒有前一頁，應該加上disabled這個class
            href="/"
            aria-label="Previous"
            onClick={(e) => {
              e.preventDefault();
              changePage(pagination.current_page - 1);
            }}>
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {
          [...new Array(pagination.total_pages)].map((_, i) => ( //Array()裡面放總頁數。先用 ... 展開一個長度為 total_pages 的空陣列，並用 map 遍歷它，每個位置對應一個頁碼（index + 1）；原本第一個參數是value，但我不需要所以寫 _ (空值)；最後 map 回傳一個新陣列。
            // eslint-disable-next-line react/no-array-index-key
            <li className="page-item" key={`${i}_page`}>
              <a
                className={`page-link ${(i + 1 === pagination.current_page) && 'active'}`}//當index+1等於當前頁面時，新增active這個class
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  changePage(i + 1);//i + 1 是實際頁碼（因為 index 從 0 開始）
                }}>
                {i + 1}
              </a>

            </li>
          ))
        }
        <li className="page-item">
          <a className={`page-link ${pagination.has_next ? '' : 'disabled'} `}
            href="/"
            aria-label="Next"
            onClick={(e) => {
              e.preventDefault();
              changePage(pagination.current_page + 1);
            }}>
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}