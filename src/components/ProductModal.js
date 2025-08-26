import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { MessageContext, handleSuccessMessage, handleErrorMessage } from "../context/messageContext";

export default function ProductModal({ closeProductModal, getProducts, type, tempProduct }) {
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

  const [, dispatch] = useContext(MessageContext);

  useEffect(() => {
    if (type === "create") {
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
    } else if (type === "edit") {
      setTempData(tempProduct);
    }
  }, [type, tempProduct]);

  const handleChange = (e) => {
    const { value, name, checked } = e.target;
    if (["price", "origin_price"].includes(name)) {
      setTempData((prev) => ({ ...prev, [name]: Number(value) }));
    } else if (name === "is_enabled") {
      setTempData((prev) => ({ ...prev, [name]: +checked }));
    } else {
      setTempData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product`;
      let method = "post";
      if (type === "edit") {
        api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${tempProduct.id}`;
        method = "put";
      }
      const res = await axios[method](api, { data: tempData });

      handleSuccessMessage(dispatch, res);
      closeProductModal();
      getProducts();
    } catch (error) {
      handleErrorMessage(dispatch, error);
      //console.error正式環境不輸出：
      if (process.env.NODE_ENV !== "production") console.error(error);
    }
  };

  const [tempImage, setTempImage] = useState("");

  const handleUpload = async (file, which = "main") => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file-to-upload", file);

    try {
      const res = await axios.post(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/upload`,
        formData
      );
      if (res.data.success) {
        if (which === "main") {
          setTempData((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
        } else {
          setTempData((prev) => ({
            ...prev,
            imagesUrl: [...(prev.imagesUrl || []), res.data.imageUrl],
          }));
        }
      }
    } catch (error) {
      handleErrorMessage(dispatch, error);
      if (process.env.NODE_ENV !== "production") console.error(error);
    }
  };

  // 元件本體的 return
  return (
    <div className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5" id="exampleModalLabel">
              {type === "create" ? "建立新商品" : `編輯${tempData.title}`}
            </h2>
            <button type="button" className="btn-close" aria-label="Close" onClick={closeProductModal} />
          </div>

          <div className="modal-body">
            <div className="row">
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
                      onChange={(e) => handleUpload(e.target.files[0], "main")}
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
                          setTempImage("");
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
                        onChange={(e) => handleUpload(e.target.files[0], "sub")}
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
                        style={{ top: "10px", right: "10px" }}
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
                        type="text"            // 原本寫成 type="unit" 不是合法型別
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
