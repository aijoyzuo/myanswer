import axios, { AxiosRequestConfig, Method } from 'axios';
import { useEffect, useState } from "react";
import { useMessage, handleSuccessMessage, handleErrorMessage } from "../context/messageContext";

/** 後端的優惠券結構（用到的欄位） */
export interface Coupon {
  id?: string | number;
  title: string;
  is_enabled: 0 | 1;       // 後端常見是 0/1
  percent: number;         // 折扣（%）
  due_date: number;        // Unix 秒（注意：是「秒」不是「毫秒」）
  code: string;
}

/** 元件 props 型別 */
type Props = {
  closeModal: () => void;
  getCoupons: () => void;
  type: 'create' | 'edit';
  tempCoupon?: Partial<Coupon>;
};

/** 將 Date 轉為 <input type="date"> 需要的 yyyy-MM-dd */
const formatDateForInput = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd = date.getDate().toString().padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function CouponModal({ closeModal, getCoupons, type, tempCoupon }: Props) {
  const [tempData, setTempData] = useState<Coupon>({
    title: "超優惠",
    is_enabled: 1,
    percent: 80,
    due_date: 1555459200,
    code: 'testCode',
  });
  const { dispatch } = useMessage();

  //把input輸入的時間格式(2025-04-25)經過轉成new Date再轉成api的時間格式(unix timestamp)
  const [date, setDate] = useState(new Date());


  useEffect(() => {
    if (type === 'create') {
      setTempData({
        title: "",
        is_enabled: 1,
        percent: 80,
        due_date: 1555459200,
        code: 'testCode',
      });
      setDate(new Date());//在編輯時抓到最後一次設定的時間
    } else if (type === "edit") {
      setTempData((prev) => ({
        ...prev,
        ...tempCoupon,
        // 保底，避免 title/code/percent 不存在
        title: tempCoupon?.title ?? "",
        code: tempCoupon?.code ?? "",
        percent: tempCoupon?.percent ?? prev.percent,
        is_enabled: (tempCoupon?.is_enabled ?? 0) as 0 | 1,
        due_date: tempCoupon?.due_date ?? prev.due_date,
      }));

      const due = tempCoupon?.due_date;
      setDate(due ? new Date(due * 1000) : new Date());
    }
  }, [type, tempCoupon]);//只要 type 或 tempCoupon 發生變化，就會重新執行這段邏輯。

  /** 處理所有 input 變更 */
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value, checked } = e.target;

    type TextField = 'title' | 'code';
    type NumberField = 'percent';

    if (name === 'is_enabled') {
      setTempData((prev) => ({ ...prev, is_enabled: checked ? 1 : 0 }));
      return;
    }

    if ((['percent'] as NumberField[]).includes(name as NumberField)) {
      if (value.trim() === '' || Number.isNaN(Number(value))) return;
      setTempData((prev) => ({ ...prev, percent: Number(value) }));
      return;
    }

    if (name === 'title' || name === 'code') {
      const key: 'title' | 'code' = name; // 明確窄化
      setTempData(prev => ({ ...prev, [key]: value }));
      return;
    }
  };


  /** 送出表單（新增/編輯） */
  const handleSubmit = async (): Promise<void> => {
    try {
      // 依照 create/edit 決定 API 與 method
      let url = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon`;
      let method: Extract<Method, 'post' | 'put'> = 'post';

      if (type === "edit") {
        if (!tempCoupon?.id) {
          handleErrorMessage(dispatch, { message: "缺少優惠券 id，無法編輯" });
          return;
        }
        url = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${tempCoupon.id}`;
        method = "put";
      }

      // 後端需要「秒」，Date.getTime() 是「毫秒」→ 要除以 1000
      const payload: Coupon = {
        ...tempData,
        due_date: Math.floor(date.getTime() / 1000),
      };

      const config: AxiosRequestConfig = {
        url,
        method,
        data: { data: payload }, // 該 API 要包 { data: {...} }
      };

      const res = await axios.request(config);

      handleSuccessMessage(dispatch, res);
      closeModal();
      getCoupons();
    } catch (error: unknown) {
      handleErrorMessage(dispatch, error);
    }
  };

  return (
    <div className="modal fade" id="productModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5" id="exampleModalLabel">
              {type === 'create' ? '建立新優惠券' : `編輯${tempData.title}`}
            </h2>
            <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
            {/*把data-bs-dismiss改成onClick={closeModal} */}
          </div>
          <div className="modal-body">
            <div className='mb-2'>
              <label className='w-100' htmlFor='title'>
                標題
                <input
                  type='text'
                  id='title'
                  placeholder='請輸入標題'
                  name='title'
                  className='form-control mt-1'
                  value={tempData.title}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className='row'>
              <div className='col-md-6 mb-2'>
                <label className='w-100' htmlFor='percent'>
                  折扣（%）
                  <input
                    type='text'
                    name='percent'
                    id='percent'
                    placeholder='請輸入折扣（%）'
                    className='form-control mt-1'
                    value={tempData.percent}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className='col-md-6 mb-2'>
                <label className='w-100' htmlFor='due_date'>
                  到期日
                  <input
                    type='date'
                    id='due_date'
                    name='due_date'
                    placeholder='請輸入到期日'
                    className='form-control mt-1'
                    value={formatDateForInput(date)}
                    onChange={(e) => {
                      setDate(new Date(e.target.value));//先把時間存在new Date
                    }}
                  />
                </label>
              </div>
              <div className='col-md-6 mb-2'>
                <label className='w-100' htmlFor='code'>
                  優惠碼
                  <input
                    type='text'
                    id='code'
                    name='code'
                    placeholder='請輸入優惠碼'
                    className='form-control mt-1'
                    value={tempData.code}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>
            <label className='form-check-label' htmlFor='is_enabled'>
              <input
                className='form-check-input me-2'
                type='checkbox'
                id='is_enabled'
                name='is_enabled'
                checked={!!tempData.is_enabled}
                onChange={handleChange}
              />
              是否啟用
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal} >關閉</button>
            {/*把data-bs-dismiss改成onClick={closeModal} */}
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>儲存</button>
          </div>
        </div>
      </div>
    </div >
  )
}