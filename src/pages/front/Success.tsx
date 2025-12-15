import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import StepIndicator from "../../components/StepIndicator";

type ApiErrorData = { message?: string; success?: boolean };

type LocationState = {
  shipping?: number;
};

type OrderProduct = {
  id: string;
  qty: number;
  final_total: number;
  product: {
    title?: string;
    imageUrl?: string;
    price?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type OrderData = {
  total: number;
  products: Record<string, OrderProduct>;
  [key: string]: unknown;
};

type OrderResponse = {
  order?: Partial<OrderData>;
  success?: boolean;
  message?: string;
};

export default function Success(): JSX.Element {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;

  const SHIPPING_FEE = state?.shipping ?? 160;

  const [orderData, setOrderData] = useState<OrderData>({
    total: 0,
    products: {},
  });

  const getErrMsg = (err: unknown, fallback: string): string => {
    const axErr = err as AxiosError<ApiErrorData>;
    return axErr.response?.data?.message || axErr.message || fallback;
  };

  const getOrder = async (id: string): Promise<void> => {
    try {
      const res = await axios.get<OrderResponse>(
        `/v2/api/${process.env.REACT_APP_API_PATH}/order/${id}`
      );

      const raw = res.data.order ?? {};
      setOrderData({
        total: Number(raw.total ?? 0),
        products: (raw.products as Record<string, OrderProduct>) ?? {},
        ...raw,
      });
    } catch (err: unknown) {
      // 你如果有 toast 也可以改成 toast.error(...)
      console.error(getErrMsg(err, "取得訂單失敗"));
    }
  };

  useEffect(() => {
    if (!orderId) return;
    void getOrder(orderId);
  }, [orderId]);

  const productArray = useMemo(
    () => Object.values(orderData.products ?? {}),
    [orderData.products]
  );

  return (
    <div className="container">
      <div className="row mt-5 justify-content-center">
        <div className="col-md-6">
          <StepIndicator currentStep={3} />
        </div>
      </div>

      <div
        className="d-none d-md-block"
        style={{
          height: "400px",
          backgroundImage:
            "url(https://images.plurk.com/52b9CUh5PAv7UT3ScyjoTk.jpg )",
          backgroundPosition: "center center",
        }}
      />

      <div className="mt-3 mb-7">
        <div className="row">
          <div className="col-md-6">
            <h2>結帳成功</h2>
            <p>
              訂單已交由專人盡速為您處理，
              <br />
              肌膚煥新，從此刻開始。
            </p>
            <Link to="/products" className="btn btn-dark me-2 rounded-0 mb-4">
              繼續逛逛
            </Link>
          </div>

          <div className="col-md-6">
            <div className="card rounded-0 py-4">
              <div className="card-header border-bottom-0 bg-white px-4 py-0">
                <h2>帳單明細</h2>
              </div>

              <div className="card-body px-4 py-0">
                <ul className="list-group list-group-flush">
                  {productArray.map((item) => (
                    <li className="list-group-item px-0" key={item.id}>
                      <div className="d-flex mt-2">
                        <img
                          src={item.product.imageUrl}
                          alt=""
                          className="me-2"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="w-100 d-flex flex-column">
                          <div className="d-flex justify-content-between fw-bold">
                            <h5>{item.product.title}</h5>
                            <p className="mb-0">x{item.qty}</p>
                          </div>
                          <div className="d-flex justify-content-between mt-auto">
                            <p className="text-muted mb-0">
                              <small>
                                NT${item.product.price?.toLocaleString()}
                              </small>
                            </p>
                            <p className="mb-0">
                              NT${Math.ceil(item.final_total).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}

                  <li className="list-group-item px-0 pb-0">
                    <table className="table text-muted">
                      <tbody>
                        <tr>
                          <th
                            scope="row"
                            className="border-0 px-0 font-weight-normal"
                          >
                            運費
                          </th>
                          <td className="text-end border-0 px-0">
                            NT${SHIPPING_FEE.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="d-flex justify-content-between mt-2">
                      <p className="mb-0 h4 fw-bold">結帳總金額</p>
                      <p className="mb-0 h4 fw-bold">
                        NT$
                        {Math.ceil(orderData.total + SHIPPING_FEE).toLocaleString()}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* col */}
        </div>
      </div>
    </div>
  );
}
