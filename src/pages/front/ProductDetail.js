import { useEffect, useState } from 'react';
import axios from 'axios';
import { useOutletContext, useParams, Link } from 'react-router-dom';
import ImageSwiper from '../../components/ImageSwiper';

export default function ProductDetail() {
  const [product, setProduct] = useState({});
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { id } = useParams();
  const { getCart } = useOutletContext();

  const getProduct = async () => {
    try {
      const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/product/${id}`);
      const fetchedProduct = productRes.data.product;
      setProduct(fetchedProduct);
      getRelatedProducts(fetchedProduct.category, fetchedProduct.id);
    } catch (error) {
      console.error('取得商品失敗', error);
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

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div
              style={{
                height: '300px',
                backgroundImage: `url(${product.imageUrl})`,
                backgroundPosition: 'center center',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
              }}
            ></div>
          </div>
          <div className="col-md-6">
            <div className="my-4">
              {Array.isArray(product.imagesUrl) && product.imagesUrl.length > 0 && (
                <ImageSwiper images={product.imagesUrl} />
              )}
            </div>
          </div>
        </div>

        <div className="row justify-content-between mt-4 mb-7">
          <div className="col-md-7">
            <h2 className="mb-0">{product.title}</h2>
            <p className="fw-bold">NT${(product.price ?? 0).toLocaleString()}</p>
            <p className="text-muted mb-0">品牌：{product.category}</p>
            <p>{product.description}</p>

            <div className="accordion border mb-3" id="accordionExample">
              <div className="card border-0">
                <div
                  className="card-header py-4 bg-white border"
                  id="headingOne"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                >
                  <div className="d-flex justify-content-between align-items-center pe-1">
                    <h4 className="mb-0">成分及使用方法說明</h4>
                    <i className="fas fa-minus"></i>
                  </div>
                </div>
                <div
                  id="collapseOne"
                  className="collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="card-body pb-5">{product.content}</div>
                </div>
              </div>
            </div>

            {relatedProducts.length > 0 && (
              <div className="card border-0 mt-1">
                <h4 className="mb-2">猜你也會喜歡</h4>
                <div className="row">
                  {relatedProducts.map((item) => (
                    <div className="col-4" key={item.id}>
                      <Link to={`/product/${item.id}`} className="text-decoration-none">
                        <div
                          className="card h-100 border-0 text-center position-relative"
                          style={{ height: '150px', width: '150px' }}
                        >
                          <img src={item.imageUrl} className="card-img-top" alt={item.title} />
                          <div className="card-body p-2">
                            <h6 className="card-title text-truncate mb-0">{item.title}</h6>
                            <p className="card-text mb-1 text-muted">{item.category}</p>
                            <p className="card-text text-muted">
                              NT${(item.price ?? 0).toLocaleString()}
                            </p>
                            <span className="stretched-link"></span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="col-md-4">
            <div className="input-group mb-3 border mt-3">
              <button
                className="btn btn-outline-dark rounded-0 border-0 py-3"
                type="button"
                onClick={() => setCartQuantity((pre) => (pre === 1 ? pre : pre - 1))}
              >
                <i className="bi bi-dash"></i>
              </button>
              <input
                type="number"
                className="form-control border-0 text-center my-auto shadow-none"
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
              className="btn btn-primary text-white btn-block rounded-0 py-3 w-100"
              onClick={addToCart}
              disabled={isLoading}
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <Link to="/products" className="btn btn-outline-secondary mb-3">
          <i className="bi bi-arrow-left me-1"></i> 返回產品列表
        </Link>
      </div>
    </>
  );
}
