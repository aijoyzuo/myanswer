import axios from "axios";
import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import StepIndicator from "../../components/StepIndicator";

export default function Cart() {
  const { cartData, getCart } = useOutletContext();
  const [loadingItems, setLoadingItems] = useState([]); // 追蹤個別品項的 loading（刪除、更新數量都可共用）
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false); // 優惠券防連點
  const [isCheckingOut, setIsCheckingOut] = useState(false); // 結帳防連點
  const navigate = useNavigate();

  const SHIPPING_FEE = 160;

  const removeCartItem = async (id) => {
    // 將該品項加入 loading 清單（防連點）
    setLoadingItems((prev) => [...prev, id]);
    try {
      const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/cart/${id}`);
      await getCart(); // 刪除後更新購物車
      console.log("刪除後重新取得的結果", res);
    } catch (error) {
      console.log(error);
    } finally {
      // 無論成功或失敗，都把 loading 狀態移除
      setLoadingItems((prev) => prev.filter((x) => x !== id));
    }
  };

  const updateCartItem = async (item, quantity) => {
    const data = {
      data: {
        product_id: item.product_id,
        qty: quantity,
      },
    };
    setLoadingItems((prev) => [...prev, item.id]);
    try {
      const res = await axios.put(`/v2/api/${process.env.REACT_APP_API_PATH}/cart/${item.id}`, data);
      await getCart();
      console.log("新增", res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingItems((prev) => prev.filter((x) => x !== item.id));
    }
  };

  const applyCoupon = async () => {
    if (!couponCode || couponLoading) return;
    setCouponLoading(true);
    try {
      await getCart(); // 重新取得購物車，讓折扣更新（你若有實際套用優惠券 API，可放在這裡）
      alert("優惠券套用成功");
    } catch (error) {
      alert("優惠碼錯誤或已過期");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (isCheckingOut) return; // 防止重複點擊
    setIsCheckingOut(true);
    try {
      // 若這一頁會先打「結帳」相關 API，可在這裡呼叫；現在先直接導向 checkout 頁
      navigate("../checkout");
    } catch (error) {
      console.log(error);
      setIsCheckingOut(false);
    }
    // 注意：navigate 會換頁，通常不會回來；若有需要留在本頁處理錯誤，再依需求調整
  };

  return (
    <>
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

            {cartData?.carts?.length > 0 ? (
              <>
                {cartData?.carts?.map((item) => {
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
                          onClick={() => removeCartItem(item.id)}
                          disabled={isLoading}           // ✅ 刪除按鈕防連點
                          aria-disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : (
                            <i className="bi bi-x"></i>
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
                              disabled={isLoading}        // ✅ 更新數量時也禁用（你原本已做，這裡沿用 isLoading）
                              onChange={(e) =>
                                updateCartItem(item, Number(e.target.value))
                              }
                            >
                              {[...(new Array(20))].map((_, num) => (
                                <option value={num + 1} key={num}>
                                  {num + 1}
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
                      disabled={couponLoading} // ✅ 套券期間禁用輸入
                    />
                  </div>
                  <div className="col-5">
                    <button
                      className="btn btn-dark btn-block rounded-0 py-1 w-100"
                      type="button"
                      onClick={applyCoupon}
                      disabled={!couponCode || couponLoading} // ✅ 防連點
                    >
                      {couponLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
                        -NT${(cartData.total - cartData.final_total)?.toLocaleString()}
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

                {/* ✅ 替換 Link 為 button，點擊後先禁用再導頁，避免重複點擊 */}
                <button
                  onClick={handleCheckout}
                  className="fw-bold btn btn-primary text-white btn-block mt-4 rounded-0 py-3 w-100 d-none d-md-block"
                  disabled={isCheckingOut}
                  aria-disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      前往結帳…
                    </>
                  ) : (
                    "前往結帳"
                  )}
                </button>

                <button
                  onClick={handleCheckout}
                  className="fw-bold btn btn-primary text-white rounded-0 w-100 fixed-bottom d-block d-md-none"
                  disabled={isCheckingOut}
                  aria-disabled={isCheckingOut}
                  style={{ height: "48px" }}
                >
                  {isCheckingOut ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
    </>
  );
}
