import React, { useEffect, useState } from 'react';
import axios, { AxiosRequestConfig, Method } from 'axios';
import { useMessage, handleSuccessMessage, handleErrorMessage } from '../context/messageContext';

/** 商品資料型別（可依實際 API 擴充） */
export type Product = {
  id?: string | number;
  title: string;
  category: string;
  origin_price: number;
  price: number;
  unit: string;
  description: string;
  content: string;
  is_enabled: 0 | 1;
  imageUrl: string;
  imagesUrl: string[]; // 多圖（後端有些寫 imagesUrl）
};

/** 元件 props 型別 */
type ProductModalProps = {
  closeProductModal: () => void;
  getProducts: () => void;
  type: 'create' | 'edit';
  tempProduct: Product;
};

export default function ProductModal({
  closeProductModal,
  getProducts,
  type,
  tempProduct,
}: ProductModalProps): JSX.Element {
  // 用完整 Product 型別管理表單狀態
  const [tempData, setTempData] = useState<Product>({
    title: '',
    category: '',
    origin_price: 100,
    price: 300,
    unit: '個',
    description: '',
    content: '這是內容',
    is_enabled: 1,
    imageUrl: '',
    imagesUrl: [],
  });

  // ✅ 用物件格式拿到 dispatch（如果有需要也可取 state）
  const { dispatch } = useMessage();

  useEffect(() => {
    if (type === 'create') {
      setTempData({
        title: '',
        category: '',
        origin_price: 100,
        price: 300,
        unit: '個',
        description: '',
        content: '這是內容',
        is_enabled: 1,
        imageUrl: '',
        imagesUrl: [],
      });
    } else if (type === 'edit') {
      // 確保 imagesUrl 至少是陣列
      setTempData({
        ...tempProduct,
        imagesUrl: Array.isArray(tempProduct.imagesUrl) ? tempProduct.imagesUrl : [],
      });
    }
  }, [type, tempProduct]);

  /** 文字、數字、checkbox、textarea 的共用處理 */
 const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
  // 用 currentTarget，型別比較準；先不要解構 checked
  const { name, value, type } = e.currentTarget;

  // 1) checkbox（is_enabled）
  if (name === 'is_enabled' && type === 'checkbox') {
    const checked = (e.currentTarget as HTMLInputElement).checked; // 這裡才取 checked
    setTempData(prev => ({ ...prev, is_enabled: checked ? 1 : 0 }));
    return;
  }

  // 2) 數字欄位
  if (name === 'price' || name === 'origin_price') {
    setTempData(prev => ({ ...prev, [name]: Number(value) } as Product));
    return;
  }

  // 3) 其他字串欄位
  setTempData(prev => ({ ...prev, [name]: value } as Product));
};


  /** 送出表單（新增/編輯） */
  const handleSubmit = async (): Promise<void> => {
    try {
      let url = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product`;
      let method: Extract<Method, 'post' | 'put'> = 'post';

      if (type === 'edit') {
        url = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${tempProduct.id}`;
        method = 'put';
      }

      const config: AxiosRequestConfig = {
        url,
        method,
        data: { data: tempData },
      };

      const res = await axios.request(config);

      handleSuccessMessage(dispatch, res);
      closeProductModal();
      getProducts();
    } catch (error: unknown) {
      handleErrorMessage(dispatch, error);
      if (process.env.NODE_ENV !== 'production') console.error(error);
    }
  };

  const [tempImage, setTempImage] = useState<string>('');

  /** 上傳主圖/副圖 */
  const handleUpload = async (file: File | undefined, which: 'main' | 'sub' = 'main'): Promise<void> => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file-to-upload', file);

    try {
      const res = await axios.post(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/upload`,
        formData
      );

      if (res.data?.success) {
        const url = res.data.imageUrl as string;
        if (which === 'main') {
          setTempData((prev) => ({ ...prev, imageUrl: url }));
        } else {
          setTempData((prev) => ({
            ...prev,
            imagesUrl: [...(prev.imagesUrl || []), url],
          }));
        }
      }
    } catch (error: unknown) {
      handleErrorMessage(dispatch, error);
      if (process.env.NODE_ENV !== 'production') console.error(error);
    }
  };

  return (
    <div className="modal fade" id="productModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5" id="exampleModalLabel">
              {type === 'create' ? '建立新商品' : `編輯 ${tempData.title}`}
            </h2>
            <button type="button" className="btn-close" aria-label="Close" onClick={closeProductModal} />
          </div>

          <div className="modal-body">
            <div className="row">
              {/* 左：圖片區 */}
              <div className="col-sm-4">
                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="image">
                    輸入主圖片網址
                    <input
                      type="text"
                      name="imageUrl"
                      id="image"
                      placeholder="請輸入圖片連結"
                      className="form-control"
                      value={tempData.imageUrl}
                      onChange={handleChange}
                    />
                  </label>
                </div>

                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="customFile">
                    或 上傳主圖片
                    <input
                      type="file"
                      id="customFile"
                      className="form-control"
                      onChange={(e) => handleUpload(e.target.files?.[0], 'main')}
                    />
                  </label>
                </div>

                {tempData.imageUrl && (
                  <img src={tempData.imageUrl} alt="預覽圖片" className="img-fluid" />
                )}

                <div className="form-group my-4">
                  <label className="w-100">
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
                          setTempData((prev) => ({
                            ...prev,
                            imagesUrl: [...(prev.imagesUrl || []), tempImage],
                          }));
                          setTempImage('');
                        }}
                      >
                        新增
                      </button>
                    </div>
                  </label>

                  <div className="form-group mb-2">
                    <label className="w-100" htmlFor="customFileSub">
                      或 上傳附屬圖片
                      <input
                        type="file"
                        id="customFileSub"
                        className="form-control"
                        onChange={(e) => handleUpload(e.target.files?.[0], 'sub')}
                      />
                    </label>
                  </div>
                </div>

                {Array.isArray(tempData.imagesUrl) &&
                  tempData.imagesUrl.map((img, i) => (
                    <div key={i} className="mb-2 position-relative">
                      <img src={img} alt={`附屬圖片 ${i}`} className="img-fluid" />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute"
                        style={{ top: '10px', right: '10px' }}
                        onClick={() => {
                          setTempData((prev) => ({
                            ...prev,
                            imagesUrl: prev.imagesUrl.filter((_, idx) => idx !== i),
                          }));
                        }}
                      >
                        刪除
                      </button>
                    </div>
                  ))}
              </div>

              {/* 右：表單欄位 */}
              <div className="col-sm-8">
                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="title">
                    標題
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="請輸入標題"
                      className="form-control"
                      onChange={handleChange}
                      value={tempData.title}
                    />
                  </label>
                </div>

                <div className="row">
                  <div className="form-group mb-2 col-md-6">
                    <label className="w-100" htmlFor="category">
                      分類
                      <input
                        type="text"
                        id="category"
                        name="category"
                        placeholder="請輸入分類"
                        className="form-control"
                        onChange={handleChange}
                        value={tempData.category}
                      />
                    </label>
                  </div>

                  <div className="form-group mb-2 col-md-6">
                    <label className="w-100" htmlFor="unit">
                      單位
                      <input
                        type="text"
                        id="unit"
                        name="unit"
                        placeholder="請輸入單位"
                        className="form-control"
                        onChange={handleChange}
                        value={tempData.unit}
                      />
                    </label>
                  </div>
                </div>

                <div className="row">
                  <div className="form-group mb-2 col-md-6">
                    <label className="w-100" htmlFor="origin_price">
                      原價
                      <input
                        type="number"
                        id="origin_price"
                        name="origin_price"
                        placeholder="請輸入原價"
                        className="form-control"
                        onChange={handleChange}
                        value={tempData.origin_price}
                      />
                    </label>
                  </div>

                  <div className="form-group mb-2 col-md-6">
                    <label className="w-100" htmlFor="price">
                      售價
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="請輸入售價"
                        className="form-control"
                        onChange={handleChange}
                        value={tempData.price}
                      />
                    </label>
                  </div>
                </div>

                <hr />

                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="description">
                    產品描述
                    <textarea
                      id="description"
                      name="description"
                      placeholder="請輸入產品描述"
                      className="form-control"
                      onChange={handleChange}
                      value={tempData.description}
                    />
                  </label>
                </div>

                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="content">
                    說明內容
                    <textarea
                      id="content"
                      name="content"
                      placeholder="請輸入產品說明內容"
                      className="form-control"
                      onChange={handleChange}
                      value={tempData.content}
                    />
                  </label>
                </div>

                <div className="form-group mb-2">
                  <div className="form-check">
                    <label className="w-100 form-check-label" htmlFor="is_enabled">
                      是否啟用
                      <input
                        type="checkbox"
                        id="is_enabled"
                        name="is_enabled"
                        className="form-check-input"
                        onChange={handleChange}
                        checked={!!tempData.is_enabled}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeProductModal}>
              關閉
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
