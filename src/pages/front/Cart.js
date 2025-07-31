import axios from "axios";
import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import StepIndicator from "../../components/StepIndicator";


export default function Cart() {
  const { cartData, getCart } = useOutletContext(); //用useOutletContext方法從frontlayout取得cartData
  const [loadingItems, setLoadingItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");//套用優惠券
  const SHIPPING_FEE = 160;//定義運費

  const removeCartItem = async (id) => {
    try {
      const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/cart/${id}`);
      getCart();//刪除品項之後，重新取得一次購物車
      console.log("刪除後重新取得的結果", res);
    } catch (error) {
      console.log(error);
    }
  }

  const updateCartItem = async (item, quantity) => {
    const data = {
      data: {
        product_id: item.product_id,
        qty: quantity,
      },
    };
    setLoadingItems([...loadingItems, item.id])
    try {
      const res = await axios.put(`/v2/api/${process.env.REACT_APP_API_PATH}/cart/${item.id}`, data);
      getCart();
      console.log("新增", res);
      setLoadingItems(loadingItems.filter((loadingObject) => loadingObject !== item.id),);
    } catch (error) {
      console.log(error);
    }
  }

  const applyCoupon = async () => {
    try {
      getCart(); // 重新取得購物車，讓折扣更新
      alert("優惠券套用成功");
    } catch (error) {
      alert("優惠碼錯誤或已過期");
    }
  };


  return (<>
    <div className="container">
      <Breadcrumbs />
      <div className="row mt-5 justify-content-center">
        <div className="col-md-6">
          <StepIndicator currentStep={1} />
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6 bg-white pt-3 pb-5" style={{ minHeight: "calc(100vh - 56px - 76px)" }}>
          <div className="d-flex justify-content-between">
            <h2 className="mt-2">購物車明細</h2>
          </div>
          {cartData?.carts?.length > 0 ? (<>
            {cartData?.carts?.map((item) => {
              return (
                <div className="d-flex mt-4 bg-light" key={item.id}>
                  <img src={item.product.imageUrl} alt="" style={{ width: "120px" }} className="object-cover" />
                  <div className="w-100 p-3 position-relative">
                    <button
                      type="button"
                      className="position-absolute btn"
                      style={{ top: "8px", right: "16px", }}
                      onClick={() => removeCartItem(item.id)}>
                      <i className="bi bi-x"></i></button>
                    <p className="mb-0 fw-bold">{item.product.title}</p>
                    <p className="mt-1 mb-1 text-muted" style={{ fontSize: "14px" }}>{item.product.description}</p>
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div className="input-group w-50 align-items-center">
                        <select name="" className="form-select" id=""
                          value={item.qty}//select 的選中項目會依照 item.qty 自動顯示目前數量
                          disabled={loadingItems.includes(item.id)}
                          onChange={(e) => {
                            updateCartItem(item, Number(e.target.value)); // 將字串轉為數字，避免型別錯誤
                          }}>
                          {
                            [...(new Array(20))].map((_, num) => {
                              return (
                                <option value={num + 1} key={num}>{num + 1}</option>
                              )
                            })
                          }
                        </select>
                      </div>
                      <p className="mb-0 ms-auto">NT${item.total?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="row mt-4">
              <div className="col-7">
                <input type="text" className="form-control rounded-0 py-1 w-100" placeholder="輸入優惠碼享折扣"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)} />
              </div>
              <div className="col-5">
                <button className="btn btn-dark btn-block rounded-0 py-1 w-100" type="button" onClick={applyCoupon} disabled={!couponCode}>套用優惠券</button>
              </div>
            </div>
            <table className="table mt-1 text-muted">
              <tbody>
                <tr>
                  <th scope="row" className="border-0 px-0 font-weight-normal">小計</th>
                  <td className="text-end border-0 px-0">NT$ {cartData.total?.toLocaleString()}</td>
                </tr>
                <tr>
                  <th scope="row" className="border-0 px-0 pt-0 font-weight-normal">套用優惠券</th>
                  <td className="text-end border-0 px-0 pt-0">-NT${(cartData.total - cartData.final_total)?.toLocaleString()}</td>
                </tr>
                <tr>
                  <th scope="row" className="border-0 px-0 pt-0 font-weight-normal">運費</th>
                  <td className="text-end border-0 px-0 pt-0">+NT${SHIPPING_FEE.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <div className="d-flex justify-content-between mt-4">
              <p className="mb-0 h4 fw-bold">結帳總金額</p>
              <p className="mb-0 h4 fw-bold">NT${Math.ceil(cartData.final_total + SHIPPING_FEE).toLocaleString()}</p>
            </div>
            <Link to="../checkout" className="fw-bold btn btn-primary text-white btn-block mt-4 rounded-0 py-3 w-100 d-none d-md-block">前往結帳</Link>
            <Link
              to="../checkout"
              className="fw-bold btn btn-primary text-white rounded-0 py-4 w-100 fixed-bottom d-block d-md-none"
            >
              前往結帳
            </Link></>)
            : (<div className="text-center mt-5">
              <h4 className="mb-3">目前購物車是空的</h4>
              <Link to="/products" className="btn btn-dark btn-block mt-4 rounded-0 py-3 px-5">
                前往選購商品
              </Link>
            </div>)}
        </div>
      </div>
    </div >
  </>)
}