import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useOutletContext, } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import useWishList from "../../hook/useWishList";
import Breadcrumbs from "../../components/Breadcrumbs";




export default function Products() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { wishList, toggleWish } = useWishList();

  const { getCart } = useOutletContext();

  const [categories, setCategories] = useState([]);

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

  //品牌按鈕
  const getAllCategories = useCallback(async () => {
    try {
      const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
      const allProducts = Object.values(res.data.products);
      const allCategories = [...new Set(allProducts.map(p => p.category))];
      setCategories(allCategories);
    } catch (error) {
      console.error("無法取得全部產品分類", error);
    }
  }, []);

  useEffect(() => {
    getProducts({ page: 1 });
    getAllCategories();
  }, [getProducts, getAllCategories]);

  const addToCart = async (product, qty = 1) => {
    const data = {
      data: {
        product_id: product.id,
        qty: qty,
      },
    };
    setIsLoading(true);
    try {
      await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`, data);
      getCart();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };



  return (<>
    <div className="container mt-md-6 mt-3 mb-7">
      <Loading isLoading={isLoading} />
      <Breadcrumbs />
      <div className="d-flex flex-column justify-content-center mt-md-0 mt-3">
        <h2 className="fw-bold">產品列表</h2>
        <h6 className="font-weight-normal text-muted mt-2">
          搜尋您有興趣的產品或品牌：
        </h6>
        <div className="d-flex flex-wrap gap-2 mt-1">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => getProducts({ page: 1 })}
          >
            全部品牌
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className="btn btn-outline-primary btn-sm"
              onClick={() => getProducts({ page: 1, keyword: cat })}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="row">
          <div className="col-md-5">
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
          return (

            <div className="col-md-4 mb-3 d-flex" key={product.id}>
              <div className="card border-0 position-relative d-flex flex-column h-100 w-100 hover-shadow">
                <Link to={`/product/${product.id}`} className="nodecoration">
                  <img
                    src={product.imageUrl}
                    className="card-img-top rounded-0 object-cover responsive-img" //object-cover是我在utilities自己設定的
                    alt={product.title} />
                  <div className="text-dark">
                    <i className={`bi ${wishList.includes(product.id) ? 'bi-heart-fill' : 'bi-heart'} text-primary`}
                      onClick={() => toggleWish(product.id)}
                      style={{ right: '16px', top: '16px', position: "absolute", cursor: "pointer" }}></i>
                  </div>
                </Link>
                <div className="card-body d-flex flex-column">
                  <Link to={`/product/${product.id}`} className="nodecoration">
                    <h4 className="mb-1 mt-3 h5 text-center text-primary" style={{ letterSpacing: '0.05em', fontWeight: 500 }}>
                      {product.title}
                    </h4>
                    <div className="text-center">
                      <span className="h6 text-white badge bg-primary d-inline-block mt-1">{product.category}</span>
                    </div>
                    <p className="card-text text-muted mb-0 flex-grow-1 mt-2 ">{product.description}</p>
                    <p className="card-text text-muted mb-0 flex-grow-1 mt-2 pb-3 text-end pe-2">$NT {product.price.toLocaleString()}</p>
                  </Link>
                  <button
                    type="button"
                    className="mt-auto btn btn-primary text-white btn-block rounded-0 overflow-hidden py-2 w-100"
                    onClick={(e) => {
                      e.preventDefault(); // 防止點擊 Link 跳頁
                      addToCart(product, 1);
                    }}
                    disabled={isLoading}              >
                    加入購物車
                  </button>
                </div>

              </div>
            </div>
          )
        })}

      </div>
      <nav className="d-flex justify-content-center mt-3">
        <Pagination pagination={pagination} changePage={getProducts} />
      </nav>
    </div>
  </>)
}