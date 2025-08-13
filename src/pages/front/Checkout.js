
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useForm } from 'react-hook-form'; //先執行npm install react-hook-form
import { Input } from "../../components/form/Input"; //將事先做好的表格元件存成元件再引入需要的部分
import { useState } from "react";
import axios from "axios";
import StepIndicator from "../../components/StepIndicator";

export default function Checkout() {
  const { cartData } = useOutletContext(); //取得購物車資料

  const navigate = useNavigate();//submit到下一頁
  const SHIPPING_FEE = 160;


  const paymentOptions = [
    { id: 'option1', label: 'WebATM' },
    { id: 'option2', label: 'ATM' },
    { id: 'option3', label: 'ApplePay' },
  ];

  const defaultPayment = paymentOptions[0].id; // 抓第一個 key 當預設
  const [payment, setPayment] = useState(defaultPayment);//付款方式額外設定

  const {  //react-hook-form的啟用
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });

  const onSubmit = async (data) => { //去配對表單中的標籤
    const { name, email, tel, address, message } = data;

    // 從 cartData 中提取商品資訊
    const products = cartData.carts.map((item) => ({
      product_id: item.product.id,
      qty: item.qty,
    }));

    const form = {
      data: {
        user: {
          name,
          email,
          tel,
          address,
        },
        message,
        products,
      },
    };
    try {
      const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/order`, form);
      navigate(`/success/${res.data.orderId}`, {  // 抓到回傳的 order id,把 orderId 帶到網址上
        state: { shipping: SHIPPING_FEE }, //把運費帶進下一頁
      });
    } catch (error) {
      console.error('建立訂單失敗', error);
    }
  };



  return (<>
    <div className="bg-light pt-5 pb-7">
      <div className="container">
        <div className="row mt-5 justify-content-center">
          <div className="col-md-6">
            <StepIndicator currentStep={2} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-6">
            <div className="d-flex justify-content-start">
              <h2 className="mt-2">付款資訊</h2>
            </div>
          </div>
          <div className="col-md-4"></div>
        </div>
        <div className="row justify-content-center flex-md-row flex-column-reverse">
          <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
            {/*handleSubmit的功能就是在提交時先驗證表單*/}
            <div className="bg-white p-4">
              <h4 className="fw-bold">聯絡資料</h4>
              <div>
                <div className="mb-2">
                  <Input
                    id='email'
                    labelText='Email'
                    placeholder='answer@gmail.com'
                    type='email'
                    errors={errors}
                    register={register}
                    rules={{
                      required: 'Email 為必填',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Email 格式不正確',
                      },
                    }}
                  ></Input>
                </div>
                <div className="mb-2">
                  <Input
                    id='name'
                    type='text'
                    errors={errors}
                    labelText='姓名'
                    placeholder='○○○'
                    register={register}
                    rules={{
                      required: '使用者名稱為必填',
                      maxLength: {
                        value: 10,
                        message: '使用者名稱長度不超過 10',
                      },
                    }}
                  ></Input>
                </div>
                <div className="mb-2">
                  <Input
                    id='tel'
                    labelText='電話'
                    type='tel'
                    placeholder='09xx-xxx-xxx'
                    errors={errors}
                    register={register}
                    rules={{
                      required: '電話為必填',
                      minLength: {
                        value: 6,
                        message: '電話不少於 6 碼'
                      },
                      maxLength: {
                        value: 12,
                        message: '電話不超過 12 碼'
                      }
                    }}
                  ></Input>
                </div>
                <div className="mb-2">
                  <Input
                    id='address'
                    labelText='地址'
                    placeholder='台北市小安區民和路一段113號2樓之一'
                    type='address'
                    errors={errors}
                    register={register}
                    rules={{
                      required: '地址為必填',
                    }}
                  ></Input>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 mt-3">
              <h4 className="fw-bold">付款方式</h4>
              {paymentOptions.map((opt) => (
                <div className="form-check mb-2" key={opt.id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gridRadios"
                    value={opt.id}
                    checked={payment === opt.id}
                    onChange={(e) => setPayment(e.target.value)}
                  />
                  <label className="form-check-label text-muted">
                    {opt.label}
                  </label>
                </div>
              ))}
            </div>
            <div className="bg-white px-4 py-3 mt-3">
              <p className="mb-2">備註(非必填)</p>
              <input type="text" className="form-control rounded-0 mt-1" id="message" placeholder="" {...register('message')} />
            </div>

            <div className="d-flex mt-4 justify-content-between align-items-center align-items-end w-100">
              <Link to="../products" className="text-dark"><i className="bi bi-arrow-left-short me-1"></i> 繼續選購</Link>
              <button type="submit" className="btn btn-dark py-3 px-7 rounded-0">送出結帳</button>
            </div>
          </form>

          <div className="col-md-4">
            <div className="border p-4 mb-4">
              <h4 className="mb-4">購物車明細</h4>
              {cartData?.carts?.map((item) => {
                return (
                  <div className="d-flex mb-2" key={item.id}>
                    <img src={item.product.imageUrl} alt="" className="me-2" style={{ width: "48px", height: "48px", objectFit: "cover", }} />
                    <div className="w-100">
                      <div className="d-flex justify-content-between fw-bold">
                        <p className="mb-0">{item.product.title}</p>
                        <p className="mb-0">x{item.qty}</p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p className="text-muted mb-0"><small>NT${item.product.price?.toLocaleString()}</small></p>
                        <p className="mb-0">NT${item.total?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )
              }
              )}

              <table className="table mt-4 border-top border-bottom text-muted">
                <tbody>
                  <tr>
                    <th scope="row" className="border-0 px-0 pb-3 font-weight-normal bg-transparent">小計</th>
                    <td className="text-end border-0 px-0 pb-3 bg-transparent">NT$ {cartData.total?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="border-0 px-0 pb-3 pt-0 font-weight-normal bg-transparent">套用優惠券</th>
                    <td className="text-end border-0 px-0 pb-3 pt-0 bg-transparent">-NT${(cartData.total - cartData.final_total)?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="border-0 px-0 pb-3 pt-0 font-weight-normal bg-transparent">運費</th>
                    <td className="text-end border-0 px-0 pb-3 pt-0 bg-transparent">+NT${SHIPPING_FEE.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="border-0 px-0 pt-0 pb-4 font-weight-normal bg-transparent">付款方式</th>
                    <td className="text-end border-0 px-0 pt-0 pb-4 bg-transparent">
                      {paymentOptions.find(opt => opt.id === payment)?.label}
                      {/*把 payment 這個變數的值（如 'option1'）拿來當作「索引 key」去查 paymentOptions 的值*/}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="d-flex justify-content-between mt-4">
                <p className="mb-0 h4 fw-bold">結帳總金額</p>
                <p className="mb-0 h4 fw-bold">NT${(cartData.final_total + SHIPPING_FEE)?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>)
}