import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  Link,
  useOutletContext,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import Pagination, { type PaginationData } from "../../components/Pagination";
import Loading from "../../components/Loading";
import useWishList from "../../hook/useWishList";
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
  description?: string;
  price: number;
  imageUrl?: string;
  [key: string]: unknown;
}

type ProductsApiResponse = {
  products?: Record<string, Product> | Product[];
  pagination?: PaginationData;
  success?: boolean;
  message?: string;
};

type GetProductsArgs = {
  page?: number;
  keyword?: string;
};

export default function Products(): JSX.Element {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);

  const { wishList, toggleWish } = useWishList() as {
    wishList: string[];
    toggleWish: (id: string) => void;
  };

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { getCart } = useOutletContext<FrontOutletContext>();
  const toast = useToast() as ToastApi;

  const getErrMsg = (err: unknown, fallback: string): string => {
    const axErr = err as AxiosError<ApiErrorData>;
    return axErr.response?.data?.message || axErr.message || fallback;
  };

  const filterProducts = (list: Product[], keyword: string): Product[] => {
    const kw = keyword.toLowerCase();
    return list.filter(
      (item) =>
        item.title?.toLowerCase().includes(kw) ||
        item.category?.toLowerCase().includes(kw)
    );
  };

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getProducts = useCallback(
    async ({ page = 1, keyword = "" }: GetProductsArgs = {}): Promise<void> => {
      scrollToTop();
      setIsLoading(true);

      try {
        const url = keyword
          ? `/v2/api/${process.env.REACT_APP_API_PATH}/products/all`
          : `/v2/api/${process.env.REACT_APP_API_PATH}/products?page=${page}`;

        const res = await axios.get<ProductsApiResponse>(url);

        const raw = res.data.products ?? {};
        const allProducts: Product[] = Array.isArray(raw)
          ? raw
          : Object.values(raw);

        let filtered = allProducts;

        if (keyword) {
          filtered = filterProducts(allProducts, keyword);

          if (filtered.length === 0) {
            window.setTimeout(() => {
              setSearchKeyword("");
              setSelectedCategory("");
              setProducts(allProducts);
            }, 2000);
          }
        }

        setProducts(filtered);
        setPagination(res.data.pagination ?? null);
      } catch (error: unknown) {
        console.error(error);
        toast.error("載入產品失敗");
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const getAllCategories = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<ProductsApiResponse>(
        `/v2/api/${process.env.REACT_APP_API_PATH}/products/all`
      );

      const raw = res.data.products ?? {};
      const allProducts: Product[] = Array.isArray(raw)
        ? raw
        : Object.values(raw);

      const allCategories = [...new Set(allProducts.map((p) => p.category))];
      setCategories(allCategories);
    } catch (error: unknown) {
      toast.error(getErrMsg(error, "載入分類失敗"));
    }
  }, [toast]);

  useEffect(() => {
    void getAllCategories();
  }, [getAllCategories]);

  useEffect(() => {
    const raw = searchParams.get("category") || "";
    const kw = raw.trim();

    if (kw) {
      setSelectedCategory(kw);
      setSearchKeyword(kw);
      void getProducts({ page: 1, keyword: kw });
    } else {
      setSelectedCategory("");
      setSearchKeyword("");
      void getProducts({ page: 1 });
    }
  }, [searchParams, getProducts]);

  const addToCart = async (product: Product, qty = 1): Promise<void> => {
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

  const normalize = (s: unknown): string =>
    (s ?? "").toString().replace(/\s+/g, " ").trim().toLowerCase();

  const matchCategory = (kw: string): string => {
    const n = normalize(kw);
    return categories.find((c) => normalize(c) === n) || "";
  };

  return (
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
            className={`btn btn-sm ${selectedCategory === "" ? "btn-primary" : "btn-outline-primary"
              }`}
            onClick={() => {
              setSelectedCategory("");
              setSearchKeyword("");
              void getProducts({ page: 1 });
              navigate("/products", { replace: true });
            }}
            aria-pressed={selectedCategory === ""}
          >
            全部品牌
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${selectedCategory === cat ? "btn-primary" : "btn-outline-primary"
                }`}
              onClick={() => {
                setSelectedCategory(cat);
                setSearchKeyword("");
                void getProducts({ page: 1, keyword: cat });
                navigate(`/products?category=${encodeURIComponent(cat)}`, {
                  replace: true,
                });
              }}
              aria-pressed={selectedCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="row">
          <div className="col-md-5">
            <div className="input-group mb-0 mt-2">
              <input
                type="text"
                className="form-control rounded-0"
                placeholder="輸入關鍵字"
                value={searchKeyword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchKeyword(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    const kw = searchKeyword;
                    const matched = matchCategory(kw);
                    setSelectedCategory(matched);
                    void getProducts({ page: 1, keyword: kw });
                  }
                }}
              />

              <button
                className="btn btn-primary rounded-0 text-white"
                type="button"
                onClick={() => {
                  const kw = searchKeyword;
                  const matched = matchCategory(kw);
                  setSelectedCategory(matched);
                  void getProducts({ page: 1, keyword: kw });
                }}
              >
                搜尋
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="row">
        {searchKeyword && products.length === 0 && (
          <div className="text-center py-5 text-muted">
            沒有找到符合「{searchKeyword}」的產品，請嘗試其他關鍵字。
            <br />
            將自動導回全部產品列表……
          </div>
        )}

        {products.map((product) => (
          <div className="col-md-4 mb-3 d-flex" key={product.id}>
            <div className="card border-0 position-relative d-flex flex-column h-100 w-100 hover-shadow">
              <Link to={`/product/${product.id}`} className="nodecoration">
                <img
                  src={product.imageUrl}
                  className="card-img-top rounded-0 object-cover responsive-img"
                  alt={product.title}
                />

                <div className="text-dark">
                  <i
                    className={`bi ${wishList.includes(product.id) ? "bi-heart-fill" : "bi-heart"
                      } text-primary`}
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWish(product.id);
                    }}
                    style={{
                      right: "16px",
                      top: "16px",
                      position: "absolute",
                      cursor: "pointer",
                      width: "48px",
                      display: "flex",
                      height: "48px",
                      alignItems: "flex-start",
                      justifyContent: "flex-end",
                    }}
                    aria-label={wishList.includes(product.id) ? "移出收藏" : "加入收藏"}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWish(product.id);
                      }
                    }}
                  />
                </div>
              </Link>

              <div className="card-body d-flex flex-column">
                <Link to={`/product/${product.id}`} className="nodecoration">
                  <h4
                    className="mb-1 mt-3 h5 text-center text-primary"
                    style={{ letterSpacing: "0.05em", fontWeight: 500 }}
                  >
                    {product.title}
                  </h4>

                  <div className="text-center">
                    <span className="h6 text-white badge bg-primary d-inline-block mt-1">
                      {product.category}
                    </span>
                  </div>

                  <p className="card-text text-muted mb-0 flex-grow-1 mt-2">
                    {product.description}
                  </p>

                  <p className="card-text text-muted mb-0 flex-grow-1 mt-2 pb-3 text-end pe-2">
                    NT$ {product.price.toLocaleString()}
                  </p>
                </Link>

                <button
                  type="button"
                  className="mt-auto btn btn-primary text-white btn-block rounded-0 overflow-hidden py-2 w-100"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    void addToCart(product, 1);
                  }}
                  disabled={isLoading}
                >
                  加入購物車
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <nav className="d-flex justify-content-center mt-3">
        <Pagination
          pagination={pagination}
          changePage={(p: number) =>
            void getProducts({
              page: p,
              keyword: selectedCategory || searchKeyword,
            })
          }
        />
      </nav>
    </div>
  );
}
