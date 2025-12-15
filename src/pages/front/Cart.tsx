// src/pages/front/Cart.tsx (路徑依你專案調整)
import axios, { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import StepIndicator from "../../components/StepIndicator";
import Swal from "sweetalert2";

type ApiErrorData = { message?: string; success?: boolean };

interface CartProduct {
  title?: string;
  description?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

interface CartItem {
  id: string;
  product_id: string;
  qty: number;
  total: number;
  product: CartProduct;
  [key: string]: unknown;
}

interface CartData {
  carts: CartItem[];
  total: number;
  final_total: number;
  [key: string]: unknown;
}

type OutletContextType = {
  cartData: CartData;
  getCart: () => Promise<void>;
};

export default function Cart(): JSX.Element {
  const { cartData, getCart } = useOutletContext<OutletContextType>();

  const [loadingItems, setLoadingItems] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponLoading, setCouponLoading] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  const navigate = useNavigate();
  const SHIPPING_FEE = 160;

  // SweetAlert2 - Toast 共用設定（用 useMemo 避免每次 render 重建）
  const Toast = useMemo(
    () =>
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      }),
    []
  );

  const getErrMsg = (err: unknown, fallback = "請稍後再試"): string => {
    const axErr = err as AxiosError<ApiErrorData>;
    return (
      axErr.response?.data?.message ||
      axErr.message ||
      fallback
    );
  };

  const removeCartItem = async (id: string): Promise<void> => {
    setLoadingItems((prev) => [...prev, id]);
    try {
      await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/cart/${id}`);
      await getCart();
      await Toast.fire({ icon: "success", title: "已刪除購物車品項" });
    } catch (error: unknown) {
      await Toast.fire({
        icon: "error",
        title: "刪除失敗",
        text: getErrMsg(error),
      });
    } finally {
      setLoadingItems((prev) => prev.filter((x) => x !== id));
    }
  };

  const updateCartItem = async (item: CartItem, quantity: number): Promise<void> => {
    const data = {
      data: {
        product_id: item.product_id,
        qty: quantity,
      },
    };

    setLoadingItems((prev) => [...prev, item.id]);
    try {
      await axios.put(
        `/v2/api/${process.env.REACT_APP_API_PATH}/cart/${item.id}`,
        data
      );
      await getCart();
      await Toast.fire({ icon: "success", title: "已更新數量" });
    } catch (error: unknown) {
      await Toast.fire({
        icon: "error",
        title: "更新失敗",
        text: getErrMsg(error),
      });
    } finally {
      setLoadingItems((prev) => prev.filter((x) => x !== item.id));
    }
  };

  const applyCoupon = async (): Promise<void> => {
    const code = couponCode.trim();
    if (!code || couponLoading) return;

    setCouponLoading(true);
    try {
      const res = await axios.post<{ message?: string }>(
        `/v2/api/${process.env.REACT_APP_API_PATH}/coupon`,
        { data: { code } }
      );

      await getCart();
      await Toast.fire({
        icon: "success",
        title: res.data?.message || "優惠券套用成功",
      });
    } catch (error: unknown) {
      const msg = getErrMsg(error, "優惠碼錯誤或已過期");
      await Swal.fire({
        icon: "error",
        title: "套用失敗",
        text: msg,
        confirmButtonText: "重試",
        confirmButtonColor: "#000000ff",
      });
    } finally {
      setCouponLoading(false);
    }
  };

  const confirmRemove = async (item: CartItem): Promise<void> => {
    if (loadingItems.includes(item.id)) return;

    const { isConfirmed } = await Swal.fire({
      title: `要移除「${item.product.title ?? ""}」嗎？`,
      text: "移除後可再加入一次",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "移除",
      cancelButtonText: "取消",
      confirmButtonColor: "#dc3545",
    });

    if (isConfirmed) {
      await removeCartItem(item.id);
      await Toast.fire({ icon: "success", title: "已移除" });
    }
  };

  const handleCheckout = async (): Promise<void> => {
    if (isCheckingOut) return;

    setIsCheckingOut(true);
    try {
      navigate("../checkout");
    } catch (error: unknown) {
      await Toast.fire({
        icon: "error",
        title: "前往結帳失敗",
        text: getErrMsg(error),
      });
      setIsCheckingOut(false);
    }
  };

  const hasItems = (cartData?.carts?.length ?? 0) > 0;

  return (
    <div className="container">
      <Breadcrumbs />
      <div className="row mt-5 justify-content-center">
        <div className="col-md-6">
          <StepIndicator currentStep={1} />
        </div>
      </div>

      <div className="row justify-content-center">
        <div
          className="col-md-6 bg-white pt-3 pb-5"
          style={{ minHeight: "calc(100vh - 56px - 76px)" }}
        >
          <div className="d-flex justify-content-between">
            <h2 className="mt-2">購物車明細</h2>
          </div>

          {hasItems ? (
            <>
              {cartData.carts.map((item) => {
                const isLoading = loadingItems.includes(item.id);

                return (
                  <div className="d-flex mt-4 bg-light" key={item.id}>
                    <img
                      src={item.product.imageUrl}
                      alt=""
                      style={{ width: "120px" }}
                      className="object-cover"
                    />

                    <div className="w-100 p-3 position-relative">
                      <button
                        type="button"
                        className="position-absolute btn"
                        style={{ top: "8px", right: "16px" }}
                        onClick={() => void confirmRemove(item)}
                        disabled={isLoading}
                        aria-disabled={isLoading}
                      >
                        {isLoading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : (
                          <i className="bi bi-x" />
                        )}
                      </button>

                      <p className="mb-0 fw-bold">{item.product.title}</p>
                      <p className="mt-1 mb-1 text-muted" style={{ fontSize: "14px" }}>
                        {item.product.description}
                      </p>

                      <div className="d-flex justify-content-between align-items-center w-100">
                        <div className="input-group w-50 align-items-center">
                          <select
                            className="form-select"
                            value={item.qty}
                            disabled={isLoading}
                            onChange={(e) =>
                              void updateCartItem(item, Number(e.target.value))
                            }
                          >
                            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                              <option value={n} key={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>

                        <p className="mb-0 ms-auto">
                          NT${item.total?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="row mt-4 g-1">
                <div className="col-7">
                  <input
                    type="text"
                    className="form-control rounded-0 py-1 w-100"
                    placeholder="輸入優惠碼享折扣"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponLoading}
                  />
                </div>
                <div className="col-5">
                  <button
                    className="btn btn-dark btn-block rounded-0 py-1 w-100"
                    type="button"
                    onClick={() => void applyCoupon()}
                    disabled={!couponCode || couponLoading}
                  >
                    {couponLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        套用中…
                      </>
                    ) : (
                      "套用優惠券"
                    )}
                  </button>
                </div>
              </div>

              <table className="table mt-1 text-muted">
                <tbody>
                  <tr>
                    <th scope="row" className="border-0 px-0 font-weight-normal">
                      小計
                    </th>
                    <td className="text-end border-0 px-0">
                      NT$ {cartData.total?.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="border-0 px-0 pt-0 font-weight-normal">
                      套用優惠券
                    </th>
                    <td className="text-end border-0 px-0 pt-0">
                      -NT$ {(cartData.total - cartData.final_total).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="border-0 px-0 pt-0 font-weight-normal">
                      運費
                    </th>
                    <td className="text-end border-0 px-0 pt-0">
                      +NT${SHIPPING_FEE.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="d-flex justify-content-between mt-4">
                <p className="mb-0 h4 fw-bold">結帳總金額</p>
                <p className="mb-0 h4 fw-bold">
                  NT${Math.ceil(cartData.final_total + SHIPPING_FEE).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => void handleCheckout()}
                className="fw-bold btn btn-primary text-white btn-block mt-4 rounded-0 py-3 w-100 d-none d-md-block"
                disabled={isCheckingOut}
                aria-disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    前往結帳…
                  </>
                ) : (
                  "前往結帳"
                )}
              </button>

              <button
                onClick={() => void handleCheckout()}
                className="fw-bold btn btn-primary text-white rounded-0 w-100 fixed-bottom d-block d-md-none"
                disabled={isCheckingOut}
                aria-disabled={isCheckingOut}
                style={{ height: "48px" }}
              >
                {isCheckingOut ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    前往結帳…
                  </>
                ) : (
                  "前往結帳"
                )}
              </button>
            </>
          ) : (
            <div className="text-center mt-5">
              <h4 className="mb-3">目前購物車是空的</h4>
              <Link
                to="/products"
                className="btn btn-dark btn-block mt-4 rounded-0 py-3 px-5"
              >
                前往選購商品
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
