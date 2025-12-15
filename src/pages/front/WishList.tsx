import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useOutletContext, Link } from "react-router-dom";
import useWishList from "../../hook/useWishList";
import Loading from "../../components/Loading";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useToast } from "../../context/toastContext";

type ApiErrorData = { message?: string; success?: boolean };

type ToastApi = {
  success: (msg: string) => void;
  error: (msg: string) => void;
};

type FrontOutletContext = {
  getCart: () => Promise<void>;
};

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  imageUrl?: string;
  [key: string]: unknown;
}

type ProductsAllResponse = {
  products?: Record<string, Product> | Product[];
  success?: boolean;
  message?: string;
};

export default function WishList(): JSX.Element {
  const { wishList, toggleWish } = useWishList(); 

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { getCart } = useOutletContext<FrontOutletContext>();
  const toast = useToast() as ToastApi;

  const getErrMsg = (err: unknown, fallback: string): string => {
    const axErr = err as AxiosError<ApiErrorData>;
    return axErr.response?.data?.message || axErr.message || fallback;
  };

  const getAllProducts = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await axios.get<ProductsAllResponse>(
        `/v2/api/${process.env.REACT_APP_API_PATH}/products/all`
      );

      const raw = res.data.products ?? {};
      const allProducts: Product[] = Array.isArray(raw)
        ? raw
        : Object.values(raw);

      const filtered = allProducts.filter((item) => wishList.includes(item.id));
      setProducts(filtered);
    } catch (err: unknown) {
      toast.error(getErrMsg(err, "載入收藏商品失敗"));
    } finally {
      setIsLoading(false);
    }
  }, [wishList, toast]);

  useEffect(() => {
    void getAllProducts();
  }, [getAllProducts]);

  const handleAddToCart = async (product: Product, qty = 1): Promise<void> => {
    const data = { data: { product_id: product.id, qty } };
    setIsLoading(true);
    try {
      await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`, data);
      await getCart();
      toast.success(`已加入購物車：${product.title}`);
    } catch (error: unknown) {
      toast.error(getErrMsg(error, "加入購物車失敗"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <Loading isLoading={isLoading} />
      <Breadcrumbs />

      <h2>心動清單</h2>

      {wishList.length === 0 ? (
        <div className="text-center">
          <p>目前沒有心動商品。</p>
          <Link to="/products" className="btn btn-primary rounded-0">
            前往產品列表
          </Link>
        </div>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div className="col-md-3" key={product.id}>
              <div className="card border-0 h-100 position-relative">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="card-img-top wishlist-img"
                />

                <div className="card-body d-flex flex-column text-center">
                  <h5>{product.title}</h5>
                  <p className="text-muted">{product.category}</p>
                  <p>NT${product.price?.toLocaleString()}</p>

                  <button
                    className="btn btn-outline-primary mt-auto rounded-0"
                    onClick={() => toggleWish(product.id)}
                  >
                    取消收藏
                  </button>

                  <button
                    className="btn btn-primary mt-2 rounded-0"
                    onClick={() => void handleAddToCart(product, 1)}
                    disabled={isLoading || !product.id}
                  >
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
