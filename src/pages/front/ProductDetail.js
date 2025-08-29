import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useOutletContext, useParams, Link } from 'react-router-dom';
import ImageSwiper from '../../components/ImageSwiper';
import Loading from "../../components/Loading";
import Breadcrumbs from '../../components/Breadcrumbs';
import { useToast } from '../../context/toastContext';

export default function ProductDetail() {
  const [product, setProduct] = useState({});
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { id } = useParams();
  const { getCart } = useOutletContext();
  const toast = useToast();

  // ------- data fetchers（非事件處理，不用 handle 前綴）-------
  const getRelatedProducts = useCallback(async (category, currentProductId) => {
    try {
      const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
      const allProducts = Object.values(res.data.products ?? {});
      const related = allProducts
        .filter((p) => p.category === category && p.id !== currentProductId)
        .slice(0, 3);
      setRelatedProducts(related);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || '取得相關產品失敗';
      toast.error(msg);
    }
  }, [toast]);

  const getProduct = useCallback(async () => {
    setIsLoading(true);
    try {
      const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/product/${id}`);
      const fetchedProduct = productRes.data.product;
      setProduct(fetchedProduct);
      if (fetchedProduct?.category && fetchedProduct?.id) {
        getRelatedProducts(fetchedProduct.category, fetchedProduct.id);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || '取得商品失敗';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [id, getRelatedProducts, toast]);

  // ------- effects -------
  useEffect(() => {
    const top = window.innerWidth >= 768 ? 140 : 0;
    window.scrollTo({ top, behavior: 'smooth' });
    if (id) getProduct();
  }, [id, getProduct]);

  // ------- handlers（事件處理一律 handle*）-------
  const handleDecrementQty = () =>
    setCartQuantity((pre) => (pre === 1 ? pre : pre - 1));

  const handleIncrementQty = () =>
    setCartQuantity((pre) => pre + 1);

  const handleAddToCart = async () => {
    if (!product?.id) {
      toast.error('商品資訊尚未載入，請稍候再試');
      return;
    }
    const qty = Number(cartQuantity) > 0 ? Number(cartQuantity) : 1;
    const data = { data: { product_id: product.id, qty } };

    setIsLoading(true);
    try {
      await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`, data);
      await getCart();
      toast.success(`已加入購物車：${product.title}`);
    } catch (error) {
      const msg = error?.response?.data?.message || '加入購物車失敗';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ------- view helpers -------
  const allImages = [
    ...(product.imageUrl ? [product.imageUrl] : []),
    ...(Array.isArray(product.imagesUrl) ? product.imagesUrl : []),
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
            <div className="d-flex align-items-center mb-3">
              <p className="text-muted mb-0">品牌：</p>
              <p className="h6 text-white badge bg-primary d-inline-block mb-0">
                {product.category}
              </p>
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

            <p className="fw-bold fs-5 text-end">
              NT${(product.price ?? 0).toLocaleString()}
            </p>

            {/* 數量 + 加入購物車按鈕 */}
            <div className="input-group mb-3 border">
              <button
                className="btn btn-outline-dark rounded-0 border-0 py-3"
                type="button"
                onClick={handleDecrementQty}
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
                onClick={handleIncrementQty}
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>

            <button
              type="button"
              className="btn btn-primary text-white w-100 py-3 rounded-0 d-none d-md-block"
              onClick={handleAddToCart}
              disabled={isLoading || !product?.id}
            >
              加入購物車
            </button>
          </div>
        </div>

        {/* 猜你也會喜歡 */}
        {relatedProducts.length > 0 && (
          <div className="mt-5">
            <h4 className="mb-3 fw-bold">猜你也會喜歡</h4>
            <hr className="text-secondary" />
            <div className="row">
              {relatedProducts.map((item) => (
                <div className="col-4 mb-4" key={item.id}>
                  <Link to={`/product/${item.id}`} className="text-decoration-none">
                    <div className="card h-100 border-0 text-center hover-shadow">
                      <img
                        src={item.imageUrl}
                        className="card-img-top object-fit-contain"
                        alt={item.title}
                        style={{ height: '200px', objectFit: 'cover' }}
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
            onClick={handleAddToCart}
            disabled={isLoading || !product?.id}
            style={{ height: '48px' }}
          >
            加入購物車
          </button>
        </div>
      </div>
    </>
  );
}
