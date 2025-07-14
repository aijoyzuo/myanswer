import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import useWishList from "../../hook/useWishList";



export default function Products() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { wishList, toggleWish } = useWishList();

  // 抽出：過濾商品的邏輯
  const filterProducts = (products, keyword) => {
    return products.filter((item) =>
      item.title.toLowerCase().includes(keyword.toLowerCase()) ||
      item.category.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  //  改寫 getProducts，用物件參數
  const getProducts = useCallback(async ({ page = 1, keyword = '' } = {}) => {
    setIsLoading(true);

    const url = keyword
      ? `/v2/api/${process.env.REACT_APP_API_PATH}/products/all`
      : `/v2/api/${process.env.REACT_APP_API_PATH}/products?page=${page}`;

    const res = await axios.get(url);
    const allProducts = Object.values(res.data.products);

    let filtered = allProducts;

    if (keyword) {
      filtered = filterProducts(allProducts, keyword);

      if (filtered.length === 0) {
        setTimeout(() => {
          setSearchKeyword('');
          setProducts(allProducts);
        }, 2000);
      }
    }


    setProducts(filtered);
    setPagination(res.data.pagination || {});
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getProducts({ page: 1 });
  }, [getProducts]);


  return (<>
    <div className="container mt-md-6 mt-3 mb-7">
      <Loading isLoading={isLoading} />
      <div className="col-md-4 d-flex flex-column justify-content-center mt-md-0 mt-3">
        <h2 className="fw-bold">產品列表</h2>
        <h6 className="font-weight-normal text-muted mt-2">
          搜尋您有興趣的產品或品牌：
        </h6>
        <div className="input-group mb-0 mt-2">
          <input type="text"
            className="form-control rounded-0"
            placeholder="輸入關鍵字"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                getProducts({ page: 1, keyword: searchKeyword }); // 強制回第一頁
              }
            }} />
          <button className="btn btn-primary rounded-0 text-white"
            type="button"
            onClick={() => getProducts({ page: 1, keyword: searchKeyword })} //搜尋時自動 reset 分頁
          >
            搜尋
          </button>




        </div>
      </div>
      <hr></hr>
      <div className="row">
        {searchKeyword && products.length === 0 && (
          <div className="text-center py-5 text-muted">
            沒有找到符合「{searchKeyword}」的產品，請嘗試其他關鍵字。<br />將自動導回全部產品列表……
          </div>
        )}
        {products.map((product) => {
          //console.log(product);
          return (
            <div className="col-md-3" key={product.id}>
              <div className="card border-0 mb-4 position-relative position-relative d-flex flex-column h-100">
                <Link to={`/product/${product.id}`} >
                  <img
                    src={product.imageUrl}
                    className="card-img-top rounded-0 object-cover" //object-cover是我在utilities自己設定的
                    height={300}
                    alt="..." />
                </Link>
                <div className="text-dark">
                  <i className={`bi ${wishList.includes(product.id) ? 'bi-heart-fill' : 'bi-heart'} text-primary`}
                    onClick={() => toggleWish(product.id)}
                    style={{ right: '16px', top: '16px', position: "absolute", cursor: "pointer" }}></i>
                </div>

                <div className="card-body p-0  d-flex flex-column">

                  <h4 className="mb-1 mt-3 h5 text-center"><Link to={`/product/${product.id}`} >{product.title}</Link></h4>
                  <p className="text-muted mt-1 h6 text-center">{product.category}</p>
                  <p className="card-text text-muted mb-0 flex-grow-1">{product.description}</p>
                  <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <p className="text-white mt-3 text-center bg-primary p-2 ">NT$ {product.price}</p>
                  </Link>

                </div>
              </div>
            </div>
          )
        })}

      </div>
      <nav className="d-flex justify-content-center">
        <Pagination pagination={pagination} changePage={getProducts} />
      </nav>
    </div>
  </>)
}