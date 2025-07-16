import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useLocation } from "react-router-dom"; //運費

export default function Success() {
  const { orderId } = useParams();//從網址的路由參數中，取得 orderId 的值，並存到變數 orderId。(它會回傳一個物件{orderId: (路由上的值)}
  const location = useLocation(); //接收運費
  const SHIPPING_FEE = location.state?.shipping || 160; // fallback 預設 160（保險）


  const [orderData, setOrderData] = useState({});

  const getCart = async (orderId) => {
    const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/order/${orderId}`);
    setOrderData(res.data.order);
  }

  useEffect(() => {
    getCart(orderId)
  }, [orderId]);

  const productArray = Object.values(orderData?.products || {});//先把物件轉成陣列

  return (<>
    <div className="container">

      <div style={{
        height: "400px", backgroundImage: "url(https://images.plurk.com/52b9CUh5PAv7UT3ScyjoTk.jpg )",
        backgroundPosition: "center center",
      }}>
      </div>


      <div className="mt-5 mb-7">
        <div className="row">
          <div className="col-md-6">
            <h2>結帳成功</h2>
            <p>訂單已交由專人盡速為您處理，<br />
              肌膚煥新，從此刻開始。</p>
            <a href="./index.html" className="btn btn-dark me-2 rounded-0 mb-4">回到首頁</a>
          </div>
          <div className="col-md-6">
            <div className="card rounded-0 py-4">
              <div className="card-header border-bottom-0 bg-white px-4 py-0">
                <h2>帳單明細</h2>
              </div>
              <div className="card-body px-4 py-0">
                <ul className="list-group list-group-flush">
                  {productArray.map((item) => {
                    return (
                      <li className="list-group-item px-0" key={item.id}>
                        <div className="d-flex mt-2">
                          <img src={item.product.imageUrl} alt="" className="me-2" style={{ width: "60px", height: "60px", objectFit: "cover", }} />
                          <div className="w-100 d-flex flex-column">
                            <div className="d-flex justify-content-between fw-bold">
                              <h5>{item.product.title}</h5>
                              <p className="mb-0">x{item.qty}</p>
                            </div>
                            <div className="d-flex justify-content-between mt-auto">
                              <p className="text-muted mb-0"><small>NT${item.product.price?.toLocaleString()}</small></p>
                              <p className="mb-0">NT${Math.ceil(item.final_total)?.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}

                  <li className="list-group-item px-0 pb-0">
                    <table className="table text-muted">
                      <tbody>
                        <tr>
                          <th scope="row" className="border-0 px-0 font-weight-normal">運費</th>
                          <td className="text-end border-0 px-0">NT${SHIPPING_FEE.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="d-flex justify-content-between mt-2">
                      <p className="mb-0 h4 fw-bold">結帳總金額</p>
                      <p className="mb-0 h4 fw-bold">
                        NT${Math.ceil(orderData.total + SHIPPING_FEE)?.toLocaleString()} </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>)
}