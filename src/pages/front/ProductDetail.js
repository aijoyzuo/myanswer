import { useEffect, useState } from 'react';
import axios from 'axios';
import { useOutletContext, useParams, Link } from 'react-router-dom';
import ImageSwiper from '../../components/ImageSwiper';
import Loading from "../../components/Loading";
import Breadcrumbs from '../../components/Breadcrumbs';

export default function ProductDetail() {
  const [product, setProduct] = useState({});
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { id } = useParams();
  const { getCart } = useOutletContext();

  const getProduct = async () => {
    setIsLoading(true);
    try {
      const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/product/${id}`);
      const fetchedProduct = productRes.data.product;
      setProduct(fetchedProduct);
      getRelatedProducts(fetchedProduct.category, fetchedProduct.id);
    } catch (error) {
      console.error('取得商品失敗', error);
    } finally {
      setIsLoading(false); // ✅ 確保不論成功或錯誤都會關閉 loading
    }
  };

  const getRelatedProducts = async (category, currentProductId) => {
    try {
      const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
      const allProducts = res.data.products;
      const related = allProducts
        .filter(p => p.category === category && p.id !== currentProductId)
        .slice(0, 3);
      setRelatedProducts(related);
    } catch (err) {
      console.log('取得相關產品失敗', err);
    }
  };

  const addToCart = async () => {
    const data = {
      data: {
        product_id: product.id,
        qty: cartQuantity,
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

  useEffect(() => {
    const scrollTop = window.innerWidth >= 768 ? 140 : 0;
    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    getProduct(id);
  }, [id]);


  const allImages = [
    ...(product.imageUrl ? [product.imageUrl] : []),
    ...(Array.isArray(product.imagesUrl) ? product.imagesUrl : [])
  ];

  return (

    <>
      <div className="container">
        <Loading isLoading={isLoading} />
        <Breadcrumbs />

        {/* 商品內容區塊 */}
        <div className="row mt-4">
          {/* 左欄：swiper 圖片 */}
          <div className="col-12 col-md-7">
            {allImages.length > 0 && <ImageSwiper images={allImages} />}
          </div>

          {/* 右欄：文字說明 + 加入購物車 */}
          <div className="col-12 col-md-5">
            <h2 className="mb-2 fw-bold">{product.title}</h2>
            <div className='d-flex align-items-center mb-3'>
              <p className="text-muted mb-0">品牌：</p>
              <p className="h6 text-white badge bg-primary d-inline-block mb-0">{product.category}</p>
            </div>

            <div className="pb-3 border-bottom">
              <p className="mb-0">適用：</p>
              <p className="text-muted">{product.description}</p>
            </div>


            {/* 成分與使用方法說明 */}
            <div className="my-3">
              <div className="">
                <div className="py-3">
                  <h6 className="mb-0">成分及使用說明：</h6>
                </div>
                <div className="text-muted">{product.content}</div>
              </div>
            </div>
            <p className="fw-bold fs-5 text-end">NT${(product.price ?? 0).toLocaleString()}</p>

            {/* 數量 + 加入購物車按鈕 */}
            <div className="input-group mb-3 border">
              <button
                className="btn btn-outline-dark rounded-0 border-0 py-3"
                type="button"
                onClick={() => setCartQuantity((pre) => (pre === 1 ? pre : pre - 1))}
              >
                <i className="bi bi-dash"></i>
              </button>
              <input
                type="number"
                className="form-control border-0 text-center shadow-none"
                value={cartQuantity}
                readOnly
              />
              <button
                className="btn btn-outline-dark rounded-0 border-0 py-3"
                type="button"
                onClick={() => setCartQuantity((pre) => pre + 1)}
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>

            <button
              type="button"
              className="btn btn-primary text-white w-100 py-3 rounded-0  d-none d-md-block"
              onClick={addToCart}
              disabled={isLoading}
            >
              加入購物車
            </button>
          </div>
        </div>

        {/* 猜你也會喜歡 */}
        {relatedProducts.length > 0 && (
          <div className="mt-5">
            <h4 className="mb-3 fw-bold">猜你也會喜歡</h4>
            <hr className="text-secondary"></hr>
            <div className="row">
              {relatedProducts.map((item) => (
                <div className="col-4 mb-4" key={item.id}>
                  <Link to={`/product/${item.id}`} className="text-decoration-none">
                    <div className="card h-100 border-0 text-center hover-shadow">
                      <img
                        src={item.imageUrl}
                        className="card-img-top object-fit-contain"
                        alt={item.title}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body p-2">
                        <h6 className="card-title text-truncate mb-1">{item.title}</h6>
                        <p className="card-text text-muted small mb-1">{item.category}</p>
                        <p className="card-text text-muted mb-0">
                          NT${(item.price ?? 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* 手機版購物車按鈕 */}
      <div className="d-md-none">
        <div className="fixed-bottom border-top shadow">
          <button
            type="button"
            className="btn btn-primary w-100 rounded-0 text-white"
            onClick={addToCart}
            disabled={isLoading}
            style={{ height: "48px" }}
          >
            加入購物車
          </button>
        </div>
      </div>

    </>
  );
}
