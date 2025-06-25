import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { MessageContext, handleSuccessMessage, handleErrorMessage } from "../store/messageStore";


export default function ProductModal({ closeProducModal, getProducts, type, tempProduct }) {
  const [tempData, setTempData] = useState({
    title: "",
    category: "",
    origin_price: 100,
    price: 300,
    unit: "個",
    description: "",
    content: "這是內容",
    is_enabled: 1,
    imageUrl: "",
    imagesUrl: [],
  });

  const [, dispatch] = useContext(MessageContext) //這段中不會用到第一個參數message所以可以清掉

  useEffect(() => {//如果type是create的話，TempData就會是預設值，如果是edit，將父元件傳來的 tempProduct 帶入表單，代表要編輯這筆商品。
    if (type === 'create') {
      setTempData({
        title: "",
        category: "",
        origin_price: 100,
        price: 300,
        unit: "個",
        description: "",
        content: "這是內容",
        is_enabled: 1,
        imageUrl: "",
        imagesUrl: [],
      });
    } else if (type === 'edit') {
      setTempData(tempProduct);
    }
  }, [type, tempProduct]);//只要 type 或 tempProduct 發生變化，就會重新執行這段邏輯。

  const handleChange = (e) => { //使用者輸入內容時觸發onChange事件，呼叫handleChange(e)，從 e.target 抓到輸入欄位的 name 和 value，用setTempData更新對應欄位

    const { value, name } = e.target; //從e.target中解構出name屬性(欄位名稱)跟value(值)
    if (['price', 'origin_price'].includes(name)) { //如果name屬性裡面包含到價格，要先轉成數字型別
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

  const submit = async () => {
    try {
      let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product`
      let method = 'post';
      if (type === 'edit') {
        api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${tempProduct.id}`;
        method = 'put';
      }//執行submit的時候他會先確認是要新增還是編輯，進而變更串接api的方式
      const res = await axios[method](
        api,
        {
          data: tempData
        });//此api要求把資料包在一個 data 欄位裡，而tempData必須是個物件。按下submit之後，將tempData的整包資料傳給後端

      handleSuccessMessage(dispatch, res);
      closeProducModal();//submit之後關閉modal
      getProducts();//並重新取得遠端資料
    } catch (error) {
      handleErrorMessage(dispatch, error);
    }
  };

  const [tempImage, setTempImage] = useState("");//附屬圖片單筆網址

  const handleUpload = async (file, type = 'main') => { //參數是file，如果按了上傳但沒有檔案，就直接中斷函式不執行。我自己取了一個叫做type的第二個參數，所以當我執行handleupload的時候，我需要給他兩個參數。
    if (!file) { return }
    const formData = new FormData(); //建立formData物件，專門用來處理檔案上傳
    formData.append('file-to-upload', file); //file-to-upload是api指定的欄位名稱，用append將他加到formData中

    try {
      const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/upload`, formData);//第一個參數是路徑，第二個參數用formData，他會自動用 multipart/form-data 格式送出
      if (res.data.success) {
        if (type === 'main') {
          setTempData((pre) => ({
            ...pre, //用展開方式保留之前資料
            imageUrl: res.data.imageUrl, //使用api回傳的網址
          }));
        } else {
          setTempData((pre) => ({
            ...pre, //用展開方式保留之前資料
            imagesUrl: [...(pre.imagesUrl || []), res.data.imageUrl], //如果 pre.imagesUrl 是 undefined，就用空陣列；否則展開舊的 imagesUrl 陣列，並在最後新增這次上傳的圖片網址。
          }));
        }

      }
    } catch (error) {
      console.log(error)
    }

    return (
      <div className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5" id="exampleModalLabel">
                {type === 'create' ? '建立新商品' : `編輯${tempData.title}`}
              </h2>
              <button type="button" className="btn-close" aria-label="Close" onClick={closeProducModal}></button>
              {/*把data-bs-dismiss改成onClick={closeProducModal} */}
            </div>
            <div className="modal-body">
              <div className='row'>
                <div className='col-sm-4'>
                  <div className='form-group mb-2'>
                    <label className='w-100' htmlFor='image'>
                      輸入主圖片網址
                      <input
                        type='text'
                        name='imageUrl'
                        id='image'
                        placeholder='請輸入圖片連結'
                        className='form-control'
                        value={tempData.imageUrl}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <div className='form-group mb-2'>
                    <label className='w-100' htmlFor='customFile'>
                      或 上傳主圖片
                      <input
                        type='file'
                        id='customFile'
                        className='form-control'
                        onChange={(e) => handleUpload(e.target.files[0], 'main')} //只要我在input裡面選擇了檔案，就執行uploadFile
                      />
                    </label>
                  </div>
                  {tempData.imageUrl && (
                    <img src={tempData.imageUrl} alt="預覽圖片" className="img-fluid" />
                  )}
                  {/*條件渲染，如果tempData有值，就顯示<img>*/}
                  <div className='form-group my-4'>
                    <label className='w-100'>
                      輸入附屬圖片網址
                      <div className="input-group mb-2">

                        <input
                          type="text"
                          className="form-control"
                          placeholder="請輸入附屬圖片連結"
                          value={tempImage}
                          onChange={(e) => setTempImage(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => {
                            if (!tempImage) return;
                            setTempData((pre) => ({
                              ...pre,
                              imagesUrl: [...pre.imagesUrl, tempImage]
                            }));
                            setTempImage("");  // 清空輸入欄位
                          }}
                        >
                          新增
                        </button>
                      </div>
                    </label>
                    <div className='form-group mb-2'>
                      <label className='w-100' htmlFor='customFileSub'>
                        或 上傳附屬圖片
                        <input
                          type='file'
                          id='customFileSub'
                          className='form-control'
                          onChange={(e) => handleUpload(e.target.files[0], 'sub')}
                        />
                      </label>
                    </div>
                  </div>
                  {tempData.imagesUrl && tempData.imagesUrl.map((img, i) => (
                    <div key={i} className="mb-2 position-relative">
                      <img src={img} alt={`附屬圖片 ${i}`} className="img-fluid" />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute"
                        style={{ top: '10px', right: '10px' }}
                        onClick={() => {
                          // 刪除某張附屬圖片
                          setTempData((pre) => ({
                            ...pre,
                            imagesUrl: pre.imagesUrl.filter((_, index) => index !== i)
                          }));
                        }}
                      >
                        刪除
                      </button>
                    </div>
                  ))}


                </div>
                <div className='col-sm-8'>
                  {/*<pre>
                                    {JSON.stringify(tempData)}這段是用來試看是否正確輸入
                                </pre>*/}
                  <div className='form-group mb-2'>
                    <label className='w-100' htmlFor='title'>
                      標題
                      <input
                        type='text'
                        id='title'
                        name='title'
                        placeholder='請輸入標題'
                        className='form-control'
                        onChange={handleChange}
                        value={tempData.title}
                      />
                    </label>
                  </div>
                  <div className='row'>
                    <div className='form-group mb-2 col-md-6'>
                      <label className='w-100' htmlFor='category'>
                        分類
                        <input
                          type='text'
                          id='category'
                          name='category'
                          placeholder='請輸入分類'
                          className='form-control'
                          onChange={handleChange}
                          value={tempData.category}
                        />
                      </label>
                    </div>
                    <div className='form-group mb-2 col-md-6'>
                      <label className='w-100' htmlFor='unit'>
                        單位
                        <input
                          type='unit'
                          id='unit'
                          name='unit'
                          placeholder='請輸入單位'
                          className='form-control'
                          onChange={handleChange}
                          value={tempData.unit}
                        />
                      </label>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='form-group mb-2 col-md-6'>
                      <label className='w-100' htmlFor='origin_price'>
                        原價
                        <input
                          type='number'
                          id='origin_price'
                          name='origin_price'
                          placeholder='請輸入原價'
                          className='form-control'
                          onChange={handleChange}
                          value={tempData.origin_price}
                        />
                      </label>
                    </div>
                    <div className='form-group mb-2 col-md-6'>
                      <label className='w-100' htmlFor='price'>
                        售價
                        <input
                          type='number'
                          id='price'
                          name='price'
                          placeholder='請輸入售價'
                          className='form-control'
                          onChange={handleChange}
                          value={tempData.price}
                        />
                      </label>
                    </div>
                  </div>
                  <hr />
                  <div className='form-group mb-2'>
                    <label className='w-100' htmlFor='description'>
                      產品描述
                      <textarea
                        type='text'
                        id='description'
                        name='description'
                        placeholder='請輸入產品描述'
                        className='form-control'
                        onChange={handleChange}
                        value={tempData.description}
                      />
                    </label>
                  </div>
                  <div className='form-group mb-2'>
                    <label className='w-100' htmlFor='content'>
                      說明內容
                      <textarea
                        type='text'
                        id='content'
                        name='content'
                        placeholder='請輸入產品說明內容'
                        className='form-control'
                        onChange={handleChange}
                        value={tempData.content}
                      />
                    </label>
                  </div>
                  <div className='form-group mb-2'>
                    <div className='form-check'>
                      <label
                        className='w-100 form-check-label'
                        htmlFor='is_enabled'
                      >
                        是否啟用
                        <input
                          type='checkbox'
                          id='is_enabled'
                          name='is_enabled'
                          placeholder='請輸入產品說明內容'
                          className='form-check-input'
                          onChange={handleChange}
                          checked={!!tempData.is_enabled}//以true false判斷，!!寫法等同Boolean(tempData.is_enabled)
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeProducModal} >關閉</button>
              {/*把data-bs-dismiss改成onClick={closeProducModal} */}
              <button type="button" className="btn btn-primary" onClick={submit}>儲存</button>
            </div>
          </div>
        </div>
      </div>
    )
  }




}