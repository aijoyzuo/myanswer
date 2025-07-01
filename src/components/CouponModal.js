import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { MessageContext, handleSuccessMessage, handleErrorMessage } from "../context/messageContext";


export default function CouponModal({ closeModal, getCoupons, type, tempCoupon }) {
  const [tempData, setTempData] = useState({
    title: "超優惠",
    is_enabled: 1,
    percent: 80,
    due_date: 1555459200,
    code: 'testCode',
  });
  const [, dispatch] = useContext(MessageContext)

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
    } else if (type === 'edit') {
      setTempData(tempCoupon);
      setDate(new Date(tempCoupon.due_date));//在編輯時抓到該優惠券原設定的時間
    }
  }, [type, tempCoupon]);//只要 type 或 tempCoupon 發生變化，就會重新執行這段邏輯。

  const handleChange = (e) => { //使用者輸入內容時觸發onChange事件，呼叫handleChange(e)，從 e.target 抓到輸入欄位的 name 和 value，用setTempData更新對應欄位
    const { value, name } = e.target; //從e.target中解構出name屬性(欄位名稱)跟value(值)
    if (['price', 'origin_price', 'percent'].includes(name)) { //如果name屬性裡面包含到價格，要先轉成數字型別
      if (isNaN(value) || value.trim() === "") return; // 若不是數字或為空字串就不更新
      setTempData({
        ...tempData,
        [name]: Number(value)//轉換成數字型別
      });
    } else if (name === 'is_enabled') {
      setTempData({
        ...tempData,
        [name]: +e.target.checked,//e.target.checked是布林值，前面加上+號，將true轉成1，false轉成0
      })
    } else {
      setTempData({
        ...tempData,
        [name]: value
      })
    }
  };

  const submit = async () => {//把剛剛填進去的所有輸入資料（tempData）透過 axios 傳送到後端 API
    try {
      let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon`
      let method = 'post';
      if (type === 'edit') {
        api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${tempCoupon.id}`;
        method = 'put';
      }//執行submit的時候他會先確認是要新增還是編輯，進而變更串接api的方式
      const res = await axios[method](
        api,
        {
          data: {
            ...tempData,
            due_date: date.getTime(),//把我用newDate儲存的資料轉換成unix timestamp
          },
        });//此api要求把資料包在一個 data 欄位裡，而tempData必須是個物件

      handleSuccessMessage(dispatch, res);
      closeModal();//submit之後關閉modal
      getCoupons();//並重新取得遠端資料
    } catch (error) {

      handleErrorMessage(dispatch, error);
    }
  };

  return (
    <div className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                    value={`${date.getFullYear().toString()}-${(date.getMonth() + 1) //getMonth需加1才會是正確月份
                      .toString()
                      .padStart(2, 0)}-${date //第一個參數是目標字串長度(targetLength)，第二個參數是在前面用字串0補上(padString)
                        .getDate()
                        .toString()
                        .padStart(2, 0)}`}
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
            <button type="button" className="btn btn-primary" onClick={submit}>儲存</button>
          </div>
        </div>
      </div>
    </div >
  )
}