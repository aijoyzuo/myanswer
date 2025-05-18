import { useEffect, useRef, useState } from "react";
import axios from "axios";
import CouponModal from "../../components/CouponModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap"; // 引入Modal模組


export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [pagination, setPagination] = useState({});
    //type:決定modal展開的用途,預設為create，不然就會是edit
    const [type, setType] = useState('create');
    const [tempCoupon, setTempCoupon] = useState({});//把當前商品傳進去所使用的暫存欄位

    const couponModal = useRef(null);//我建立了一個 ref(參考物件)，他的初始值是 null(格式：{current:null})
    const deleteModal = useRef(null);

    useEffect(() => {
        couponModal.current = new Modal('#productModal', {// 依照元件的id，建立一個 Modal 實體並儲存在 useRef 回傳的物件中(這個物件存在productModal這個變數中)。
            backdrop: 'static',//按旁邊不會關掉
            keyboard: false    //按esc不會關掉
        });
        deleteModal.current = new Modal('#deleteModal', {
            backdrop: 'static',
            keyboard: false
        });
        getCoupons();
    }, []);

    const getCoupons = async (page = 1) => { //如果沒有帶入參數page，預設值為1
        const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupons?page=${page}`);//問號用來查詢參數
        console.log("產品資料", res);
        setCoupons(res.data.coupons);
        setPagination(res.data.pagination);
    }

    const openCouponModal = (type, item) => {
        setType(type);
        setTempCoupon(item);
        couponModal.current.show();
    }
    const closeModal = () => {//將boostsrap關閉的方法改成用js關閉
        couponModal.current.hide();
    }

    const openDeleteModal = (product) => {
        setTempCoupon(product);//暫存我要刪除的品項
        deleteModal.current.show();
    }
    const closeDeleteModal = () => {
        deleteModal.current.hide();
    }
    const deleteCoupon = async (id) => {
        try {
            const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${id}`);
            if (res.data.success) {//如果資料確認有刪除
                getCoupons();//就重新取得產品資料
                deleteModal.current.hide();//並關閉Modal
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (<>
        <div className="p-3">
            <CouponModal
                closeModal={closeModal}
                getCoupons={getCoupons}
                tempCoupon={tempCoupon}
                type={type}
            />
            <DeleteModal
                close={closeDeleteModal}
                text={tempCoupon.title}
                handleDelete={deleteCoupon}
                id={tempCoupon.id}
            />
            <h3>優惠券列表</h3>
            <hr />
            <div className="text-end">
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => openCouponModal('create', {})}
                >
                    建立新優惠券
                </button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">標題</th>
                        <th scope="col">折扣</th>
                        <th scope="col">到期日</th>
                        <th scope="col">優惠碼</th>
                        <th scope="col">啟用狀態</th>
                        <th scope="col">編輯</th>
                    </tr>
                </thead>
                <tbody>
                    {coupons.map((product) => {
                        return (
                            <tr key={product.id}>
                                <td>{product.title}</td>
                                <td>{product.percent}</td>
                                <td>{new Date(product.due_date).toDateString()}</td>
                                {/*把unix timestamp格式轉成時間字串*/}
                                <td>{product.code}</td>
                                <td>{product.is_enabled ? "啟用" : "未啟用"}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                        onClick={() => openCouponModal('edit', product)}
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
            <Pagination pagination={pagination} changePage={getCoupons} />
        </div>
    </>)
}