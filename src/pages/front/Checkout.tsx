import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "../../components/form/Input";
import { useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import StepIndicator from "../../components/StepIndicator";
import { useToast } from "../../context/toastContext";

type ApiErrorData = { message?: string; success?: boolean };

// 依你 checkout 會送的欄位定型別
type CheckoutFormValues = {
  email: string;
  name: string;
  tel: string;
  address: string;
  message?: string;
};

// cartData 需要用到的最小型別（你頁面用到哪些就先定哪些）
interface CartProduct {
  id: string;
  title?: string;
  price?: number;
  imageUrl?: string;
  [key: string]: unknown;
}

interface CartItem {
  id: string;
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
};

// 你這頁只用到 toast.error，所以先最小化型別
type ToastApi = {
  error: (msg: string) => void;
};

type PaymentOption = { id: string; label: string };
type PaymentId = "option1" | "option2" | "option3";

export default function Checkout(): JSX.Element {
  const { cartData } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();
  const toast = useToast() as ToastApi;

  const SHIPPING_FEE = 160;

  const paymentOptions: PaymentOption[] = useMemo(
    () => [
      { id: "option1", label: "WebATM" },
      { id: "option2", label: "ATM" },
      { id: "option3", label: "ApplePay" },
    ],
    []
  );

  const defaultPayment = paymentOptions[0].id as PaymentId;
  const [payment, setPayment] = useState<PaymentId>(defaultPayment);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({ mode: "onTouched" });

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPayment(e.target.value as PaymentId);
  };

  const getErrMsg = (err: unknown, fallback = "建立訂單失敗"): string => {
    const axErr = err as AxiosError<ApiErrorData>;
    return axErr.response?.data?.message || axErr.message || fallback;
  };

  const handleCheckoutSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    const { name, email, tel, address, message } = data;

    const products = (cartData?.carts ?? []).map((item) => ({
      product_id: item.product.id,
      qty: item.qty,
    }));

    const form = {
      data: {
        user: { name, email, tel, address },
        message,
        products,
      },
    };

    try {
      const res = await axios.post<{ orderId: string }>(
        `/v2/api/${process.env.REACT_APP_API_PATH}/order`,
        form
      );

      navigate(`/success/${res.data.orderId}`, {
        state: { shipping: SHIPPING_FEE },
      });
    } catch (error: unknown) {
      toast.error(getErrMsg(error));
    }
  };

  return (
    <div className="bg-light pt-5 pb-7">
      <div className="container">
        <div className="row mt-5 justify-content-center">
          <div className="col-md-6">
            <StepIndicator currentStep={2} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-1" />
          <div className="col-md-6">
            <div className="d-flex justify-content-start">
              <h2 className="mt-2">付款資訊</h2>
            </div>
          </div>
          <div className="col-md-4" />
        </div>

        <div className="row justify-content-center flex-md-row flex-column-reverse">
          <form className="col-md-6" onSubmit={handleSubmit(handleCheckoutSubmit)}>
            <div className="bg-white p-4">
              <h4 className="fw-bold">聯絡資料</h4>

              <div className="mb-2">
                <Input
                  id="email"
                  labelText="Email"
                  placeholder="answer@gmail.com"
                  type="email"
                  errors={errors}
                  register={register}
                  rules={{
                    required: "Email 為必填",
                    pattern: { value: /^\S+@\S+$/i, message: "Email 格式不正確" },
                  }}
                />
              </div>

              <div className="mb-2">
                <Input
                  id="name"
                  type="text"
                  errors={errors}
                  labelText="姓名"
                  placeholder="○○○"
                  register={register}
                  rules={{
                    required: "使用者名稱為必填",
                    maxLength: { value: 10, message: "使用者名稱長度不超過 10" },
                  }}
                />
              </div>

              <div className="mb-2">
                <Input
                  id="tel"
                  labelText="聯絡電話"
                  type="tel"
                  placeholder="手機 09xx-xxx-xxx 或 市話 0x-xxxx-xxxx"
                  inputMode="tel"
                  errors={errors}
                  register={register}
                  rules={{
                    required: "聯絡電話為必填",
                    setValueAs: (v: unknown) =>
                      v ? String(v).replace(/\D/g, "") : v,
                    pattern: {
                      value: /^(09\d{8}|0\d{1,2}\d{6,8})$/,
                      message: "請輸入有效的手機或市話號碼",
                    },
                  }}
                />
              </div>

              <div className="mb-2">
                <Input
                  id="address"
                  labelText="地址"
                  placeholder="台北市小安區民和路一段113號2樓之一"
                  type="text"
                  errors={errors}
                  register={register}
                  rules={{ required: "地址為必填" }}
                />
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
                    onChange={handlePaymentChange}
                  />
                  <label className="form-check-label text-muted">{opt.label}</label>
                </div>
              ))}
            </div>

            <div className="bg-white px-4 py-3 mt-3">
              <p className="mb-2">備註(非必填)</p>
              <input
                type="text"
                className="form-control rounded-0 mt-1"
                id="message"
                placeholder=""
                {...register("message")}
              />
            </div>

            <div className="d-flex mt-4 justify-content-between align-items-center w-100">
              <Link to="../products" className="text-dark">
                <i className="bi bi-arrow-left-short me-1" /> 繼續選購
              </Link>
              <button type="submit" className="btn btn-dark py-3 px-7 rounded-0">
                送出結帳
              </button>
            </div>
          </form>

          <div className="col-md-4">
            <div className="border p-4 mb-4">
              <h4 className="mb-4">購物車明細</h4>

              {cartData?.carts?.map((item) => (
                <div className="d-flex mb-2" key={item.id}>
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="me-2"
                    style={{ width: "48px", height: "48px", objectFit: "cover" }}
                  />
                  <div className="w-100">
                    <div className="d-flex justify-content-between fw-bold">
                      <p className="mb-0">{item.product.title}</p>
                      <p className="mb-0">x{item.qty}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className="text-muted mb-0">
                        <small>NT${item.product.price?.toLocaleString()}</small>
                      </p>
                      <p className="mb-0">NT${item.total?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}

              <table className="table mt-4 border-top border-bottom text-muted">
                <tbody>
                  <tr>
                    <th className="border-0 px-0 pb-3 font-weight-normal bg-transparent">
                      小計
                    </th>
                    <td className="text-end border-0 px-0 pb-3 bg-transparent">
                      NT$ {cartData.total?.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <th className="border-0 px-0 pb-3 pt-0 font-weight-normal bg-transparent">
                      套用優惠券
                    </th>
                    <td className="text-end border-0 px-0 pb-3 pt-0 bg-transparent">
                      -NT${(cartData.total - cartData.final_total).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <th className="border-0 px-0 pb-3 pt-0 font-weight-normal bg-transparent">
                      運費
                    </th>
                    <td className="text-end border-0 px-0 pb-3 pt-0 bg-transparent">
                      +NT${SHIPPING_FEE.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <th className="border-0 px-0 pt-0 pb-4 font-weight-normal bg-transparent">
                      付款方式
                    </th>
                    <td className="text-end border-0 px-0 pt-0 pb-4 bg-transparent">
                      {paymentOptions.find((opt) => opt.id === payment)?.label}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="d-flex justify-content-between mt-4">
                <p className="mb-0 h4 fw-bold">結帳總金額</p>
                <p className="mb-0 h4 fw-bold">
                  NT${(cartData.final_total + SHIPPING_FEE).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* row */}
      </div>
      {/* container */}
    </div>
  );
}
