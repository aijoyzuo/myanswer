import React, { useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { useMessage, handleSuccessMessage, handleErrorMessage } from '../context/messageContext';

/** --- 最小必要型別，依你的使用場景建立 --- */
type OrderLine = {
  id: string | number;
  product: { title: string };
  qty: number;
};

type Order = {
  id: string | number;
  user?: { email?: string; name?: string; address?: string };
  message?: string;
  products?: Record<string, OrderLine>;
  total?: number;                         // ✅ 可選
  is_paid?: boolean;                      // ✅ 可選
  status?: 0 | 1 | 2 | 3;                 // ✅ 可選
};

type OrderModalProps = {
  closeProductModal: () => void;
  getOrders: () => void;
  tempOrder: Partial<Order>;
};

type TempData = {
  is_paid: boolean;
  status: 0 | 1 | 2 | 3;
} & Partial<Order>;

export default function OrderModal({
  closeProductModal,
  getOrders,
  tempOrder,
}: OrderModalProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [tempData, setTempData] = useState<TempData>({
    ...tempOrder,
    is_paid: !!tempOrder.is_paid,
    status: (tempOrder.status ?? 0) as 0 | 1 | 2 | 3,
  });

  // ✅ 用物件格式取得 dispatch（也可以取出 state，看需要）
  const { dispatch } = useMessage();

  useEffect(() => {
    setTempData({
      ...tempOrder,
      is_paid: !!tempOrder.is_paid,
      status: (tempOrder.status ?? 0) as 0 | 1 | 2 | 3,
    });
  }, [tempOrder]);

  /** input/select 通用變更處理 */
  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
    const { name, value } = e.target;

    // ✅ 針對 checkbox：靠欄位名窄化 + 明確轉型成 HTMLInputElement 才能讀 checked
    if (name === 'is_paid') {
      const input = e.target as HTMLInputElement;
      setTempData((prev) => ({ ...prev, is_paid: input.checked }));
      return;
    }

    // ✅ 針對 select：把字串 value 轉成對應的數字聯合
    if (name === 'status') {
      const num = Number(value) as 0 | 1 | 2 | 3;
      setTempData((prev) => ({ ...prev, status: num }));
      return;
    }

    // 其他欄位若不需要更新就不用處理；真的要處理再逐一加分支，避免動態 [name]
  };


  const handleSubmit = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const url = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/order/${tempOrder.id}`;

      const config: AxiosRequestConfig = {
        url,
        method: 'put',
        data: { data: { ...tempData } },
      };

      const res = await axios.request(config);

      handleSuccessMessage(dispatch, res);
      setIsLoading(false);
      getOrders();
    } catch (error: unknown) {
      setIsLoading(false);
      handleErrorMessage(dispatch, error);
    }
  };

  return (
    <div
      className="modal fade"
      tabIndex={-1}
      id="orderModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5" id="exampleModalLabel">
              {`編輯 ${tempData.id}`}
            </h2>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeProductModal}
            />
          </div>

          <div className="modal-body">
            <div className="mb-3 row">
              <span className="col-sm-2 col-form-label">Email</span>
              <div className="col-sm-10">
                <input
                  type="email"
                  readOnly
                  className="form-control-plaintext"
                  id="staticEmail"
                  defaultValue={tempOrder?.user?.email ?? ''}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <span className="col-sm-2 col-form-label">訂購者</span>
              <div className="col-sm-10">
                <input
                  type="text"
                  readOnly
                  className="form-control-plaintext"
                  id="staticName"
                  defaultValue={tempOrder?.user?.name ?? ''}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <span className="col-sm-2 col-form-label">外送地址</span>
              <div className="col-sm-10">
                <input
                  type="text"
                  readOnly
                  className="form-control-plaintext"
                  id="staticAddress"
                  defaultValue={tempOrder?.user?.address ?? ''}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <span className="col-sm-2 col-form-label">留言</span>
              <div className="col-sm-10">
                <textarea
                  readOnly
                  className="form-control-plaintext"
                  defaultValue={tempOrder.message ?? ''}
                />
              </div>
            </div>

            {tempOrder.products && (
              <table className="table">
                <thead>
                  <tr>
                    <th>品項名稱</th>
                    <th>數量</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(tempOrder.products).map((cart) => (
                    <tr key={cart.id}>
                      <td>{cart.product.title}</td>
                      <td>{cart.qty}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="border-0 text-end">總金額</td>
                    <td className="border-0">${tempOrder.total ?? 0}</td>
                  </tr>
                </tfoot>
              </table>
            )}

            <div>
              <h5 className="mt-4">修改訂單狀態</h5>

              <div className="form-check mb-4">
                <label className="form-check-label" htmlFor="is_paid">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="is_paid"
                    id="is_paid"
                    checked={!!tempData.is_paid}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  付款狀態 ({tempOrder.is_paid ? '已付款' : '未付款'})
                </label>
              </div>

              <div className="mb-4">
                <span className="col-sm-2 col-form-label d-block">外送進度</span>
                <select
                  className="form-select"
                  name="status"
                  value={tempData.status}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value={0}>未確認</option>
                  <option value={1}>已確認</option>
                  <option value={2}>外送中</option>
                  <option value={3}>已送達</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeProductModal}>
              關閉
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={isLoading}>
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
