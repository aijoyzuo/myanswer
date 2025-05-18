import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ProductModal from "../../components/ProductModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap"; // 引入Modal模組


export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    //type:決定modal展開的用途,預設為create，不然就會是edit
    const [type, setType] = useState('create');
    const [tempProduct, setTempProduct] = useState({});//把當前商品傳進去所使用的暫存欄位

    const productModal = useRef(null);//我建立了一個 ref(參考物件)，他的初始值是 null(格式：{current:null})
    const deleteModal = useRef(null);

    useEffect(() => {
        productModal.current = new Modal('#productModal', {// 依照元件的id，建立一個 Modal 實體並儲存在 useRef 回傳的物件中(這個物件存在productModal這個變數中)。
            backdrop: 'static',//按旁邊不會關掉
            keyboard: false    //按esc不會關掉
        });
        deleteModal.current = new Modal('#deleteModal', {
            backdrop: 'static',
            keyboard: false
        });
        getProducts();
    }, []);

    const getProducts = async (page = 1) => { //如果沒有帶入參數page，預設值為1
        const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/products?page=${page}`);//問號用來查詢參數
        console.log("產品資料", productRes);
        setProducts(productRes.data.products);
        setPagination(productRes.data.pagination);
    }

    const openProductModal = (type, product) => {
        setType(type);
        setTempProduct(product);//選擇我原先就寫好的product資料，將當下要編輯的這一筆product，以setTempProduct方式，暫存到tempProduct中。因為當下根本沒有tempProduct，所以不是傳入tempProduct
        productModal.current.show();
    }
    const closeProducModal = () => {//將boostsrap關閉的方法改成用js關閉
        productModal.current.hide();
    }

    const openDeleteModal = (product) => {
        setTempProduct(product);//暫存我要刪除的品項
        deleteModal.current.show();
    }
    const closeDeleteModal = () => {
        deleteModal.current.hide();
    }
    const deleteProduct = async (id) => {
        try {
            const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${id}`);
            if (res.data.success) {//如果資料確認有刪除
                getProducts();//就重新取得產品資料
                deleteModal.current.hide();//並關閉Modal
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (<>
        <div className="p-3">
            <ProductModal
                closeProducModal={closeProducModal}
                getProducts={getProducts}
                tempProduct={tempProduct}
                type={type}
            />
            <DeleteModal
                close={closeDeleteModal}
                text={tempProduct.title}
                handleDelete={deleteProduct}
                id={tempProduct.id}
            />
            <h3>產品列表</h3>
            <hr />
            <div className="text-end">
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => openProductModal('create', {})}//在我click時執行openProductModal，如果誤寫openProductModal()會變成馬上執行
                >
                    建立新商品
                </button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">分類</th>
                        <th scope="col">名稱</th>
                        <th scope="col">售價</th>
                        <th scope="col">啟用狀態</th>
                        <th scope="col">編輯</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => {
                        return (
                            <tr key={product.id}>
                                <td>{product.category}</td>
                                <td>{product.title}</td>
                                <td>{product.price}</td>
                                <td>{product.is_enabled ? "啟用" : "未啟用"}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                        onClick={() => openProductModal('edit', product)}
                                    >
                                        編輯
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm ms-2"
                                        onClick={() => openDeleteModal(product)}
                                    >
                                        刪除
                                    </button>
                                </td>
                            </tr>
                        )

                    })}
                </tbody>
            </table>
            <Pagination pagination={pagination} changePage={getProducts} />
        </div>
    </>)
}