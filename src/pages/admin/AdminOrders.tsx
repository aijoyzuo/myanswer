// src/pages/admin/AdminOrders.tsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import OrderModal from "../../components/OrderModal";
import Pagination, { type PaginationData } from "../../components/Pagination";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";

interface OrderUser {
  name?: string;
  email?: string;
  [key: string]: unknown;
}

interface Order {
  id: string;
  user?: OrderUser;
  total?: number;
  is_paid?: boolean;
  paid_date?: number; // unix seconds
  message?: string;
  [key: string]: unknown;
}

interface OrdersResponse {
  orders?: Order[];
  pagination?: PaginationData;
  success?: boolean;
  message?: string;
}

export default function AdminOrders(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
 const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [tempOrder, setTempOrder] = useState<Partial<Order>>({});

  const orderModal = useRef<Modal | null>(null);

  useEffect(() => {
    const orderEl = document.getElementById("orderModal");

    if (orderEl) {
      orderModal.current = new Modal(orderEl, {
        backdrop: "static",
        keyboard: false,
      });
    }

    void getOrders();

    return () => {
      orderModal.current?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOrders = async (page = 1): Promise<void> => {
    try {
      const orderRes = await axios.get<OrdersResponse>(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/orders?page=${page}`
      );
      setOrders(orderRes.data.orders ?? []);
      setPagination(orderRes.data.pagination ?? null);
    } catch {
      void Swal.fire({
        title: "載入訂單失敗",
        text: "請稍後再試或聯絡管理員。",
        icon: "error",
        confirmButtonText: "確定",
      });
    }
  };

  const openOrderModal = (order: Partial<Order>): void => {
    setTempOrder(order);
    orderModal.current?.show();
  };

  const closeOrderModal = (): void => {
    orderModal.current?.hide();
  };

  const deleteOrder = async (id?: string): Promise<void> => {
    if (!id) return;

    try {
      const res = await axios.delete<OrdersResponse>(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/order/${id}`
      );

      if (res.data?.success) {
        await getOrders();
      } else {
        void Swal.fire({
          title: "刪除失敗",
          text: res.data?.message || "請稍後再試。",
          icon: "error",
          confirmButtonText: "確定",
        });
      }
    } catch {
      void Swal.fire({
        title: "訂單刪除失敗",
        text: "請稍後再試或聯絡管理員。",
        icon: "error",
        confirmButtonText: "確定",
      });
    }
  };

  return (
    <div className="p-3">
      <OrderModal
        closeProductModal={closeOrderModal}
        getOrders={getOrders}
        tempOrder={tempOrder}
      />

      <h3>訂單列表</h3>
      <hr />

      <table className="table">
        <thead>
          <tr>
            <th scope="col">訂單 id</th>
            <th scope="col">購買用戶</th>
            <th scope="col">訂單金額</th>
            <th scope="col">付款狀態</th>
            <th scope="col">付款日期</th>
            <th scope="col">留言訊息</th>
            <th scope="col">編輯</th>
            <th scope="col">刪除</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>
                {order.user?.name}
                {order.user?.email}
              </td>
              <td>${order.total}</td>
              <td>
                {order.is_paid ? (
                  <span className="text-success fw-bold">付款完成</span>
                ) : (
                  "未付款"
                )}
              </td>
              <td>
                {order.paid_date
                  ? new Date(order.paid_date * 1000).toLocaleString()
                  : "未付款"}
              </td>
              <td>{order.message}</td>

              <td>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => openOrderModal(order)}
                >
                  查看
                </button>
              </td>

              <td>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => {
                    void Swal.fire({
                      title: "確定要刪除嗎？",
                      text: "刪除後就無法恢復了！",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#d33",
                      cancelButtonColor: "#6c757d",
                      confirmButtonText: "確認刪除",
                      cancelButtonText: "取消",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        void deleteOrder(order.id);
                        void Swal.fire("刪除成功！", "該訂單已被刪除。", "success");
                      }
                    });
                  }}
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination pagination={pagination} changePage={getOrders} />
    </div>
  );
}
