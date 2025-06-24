import { useEffect, useRef, useState } from "react";
import axios from "axios";
import OrderModal from "../../components/OrderModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap"; // 引入Modal模組


export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [tempOrder, setTempOrder] = useState({});//把當前商品傳進去所使用的暫存欄位

  const orderModal = useRef(null);//我建立了一個 ref(參考物件)，他的初始值是 null(格式：{current:null})

  useEffect(() => {
    orderModal.current = new Modal('#orderModal', {// 依照元件的id，建立一個 Modal 實體並儲存在 useRef 回傳的物件中(這個物件存在productModal這個變數中)。
      backdrop: 'static',//按旁邊不會關掉
      keyboard: false    //按esc不會關掉
    });
    getOrders();
  }, []);

  const getOrders = async (page = 1) => { //如果沒有帶入參數page，預設值為1
    const orderRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/orders?page=${page}`);//問號用來查詢參數
    setOrders(orderRes.data.orders);
    setPagination(orderRes.data.pagination);
  }

  const openOrderModal = (order) => {
    setTempOrder(order);
    orderModal.current.show();
  }
  const closeOrderModal = () => {
    orderModal.current.hide();
  }

  const deleteOrder = async (id) => {
    try {
      const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/order/${id}`);
      if (res.data.success) {
        alert("訂單已刪除！");
        getOrders();//重新載入訂單列表
      }
    } catch (error) {
      alert("訂單刪除失敗，請稍後再試");
    }
  }

  return (<>
    <div className="p-3">
      <OrderModal
        closeProductModal={closeOrderModal} //我把closeOrderModal prop出去的名稱取叫closeProductModal
        getOrders={getOrders}
        tempOrder={tempOrder}
      />
      <h3>訂單列表</h3>
      <hr />
      <table className="table">
        <thead>
          <tr>
            <th scope='col'>訂單 id</th>
            <th scope='col'>購買用戶</th>
            <th scope='col'>訂單金額</th>
            <th scope='col'>付款狀態</th>
            <th scope='col'>付款日期</th>
            <th scope='col'>留言訊息</th>
            <th scope='col'>編輯</th>
            <th scope='col'>刪除</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => {
            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {order.user?.name}
                  {order.user?.email}
                </td>
                <td>${order.total}</td>
                <td>
                  {order.is_paid ? (
                    <span className='text-success fw-bold'>付款完成</span>
                  ) : (
                    '未付款'
                  )}
                </td>
                <td>
                  {order.paid_date
                    ? new Date(order.paid_date * 1000).toLocaleString()
                    : '未付款'}
                </td>
                <td>{order.message}</td>

                <td>
                  <button
                    type='button'
                    className='btn btn-primary btn-sm'
                    onClick={() => {
                      openOrderModal(order);
                    }}
                  >
                    查看
                  </button>
                </td>
                <td>
                  <button
                    type='button'
                    className='btn btn-outline-danger btn-sm'
                    onClick={() => {
                      if (window.confirm("確定要刪除這筆訂單嗎？")) {
                        deleteOrder(order.id);
                      }
                    }}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination pagination={pagination} changePage={getOrders} />
    </div>
  </>)
}