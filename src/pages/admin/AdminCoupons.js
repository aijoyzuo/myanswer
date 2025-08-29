// src/pages/admin/AdminCoupons.jsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import CouponModal from "../../components/CouponModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [pagination, setPagination] = useState({});
  // type: 'create' | 'edit'
  const [type, setType] = useState("create");
  // 暫存目前操作的優惠券
  const [tempCoupon, setTempCoupon] = useState({});

  const couponModal = useRef(null);
  const deleteModal = useRef(null);

  useEffect(() => {
    // 注意：確保 CouponModal 外層元素 id="productModal"、DeleteModal 外層元素 id="deleteModal"
    const couponEl = document.getElementById("productModal");
    const deleteEl = document.getElementById("deleteModal");

    if (couponEl) {
      couponModal.current = new Modal(couponEl, {
        backdrop: "static",
        keyboard: false,
      });
    }
    if (deleteEl) {
      deleteModal.current = new Modal(deleteEl, {
        backdrop: "static",
        keyboard: false,
      });
    }

    getCoupons();

    return () => {
      couponModal.current?.dispose();
      deleteModal.current?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 

  const alertError = (title, text = "") =>
    Swal.fire({
      title,
      text,
      icon: "error",
      confirmButtonText: "確定",
    });

  const alertSuccess = (title, text = "") =>
    Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonText: "好的",
    });

  const getCoupons = async (page = 1) => {
    try {
      const res = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupons?page=${page}`
      );
      setCoupons(res.data.coupons || []);
      setPagination(res.data.pagination || {});
      // 如需提示可打開下面一行
      // toast("已載入優惠券", "success");
    } catch (err) {
      alertError("載入優惠券失敗", "請稍後再試或聯絡管理員。");
    }
  };

  const openCouponModal = (mode, item = {}) => {
    setType(mode);
    setTempCoupon(item);
    couponModal.current?.show();
  };

  const closeModal = () => {
    couponModal.current?.hide();
    setTempCoupon({});
  };

  const openDeleteModal = (coupon) => {
    setTempCoupon(coupon);
    deleteModal.current?.show();
  };

  const closeDeleteModal = () => {
    deleteModal.current?.hide();
    setTempCoupon({});
  };

  const deleteCoupon = async (id) => {
    try {
      const res = await axios.delete(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${id}`
      );

      if (res.data?.success) {
        await getCoupons();
        deleteModal.current?.hide();
        setTempCoupon({});
        alertSuccess("刪除成功", "已移除該優惠券。");
      } else {
        alertError("刪除失敗", res.data?.message || "請稍後再試。");
      }
    } catch (err) {
      alertError("刪除發生錯誤", "請稍後再試或聯絡管理員。");
    }
  };

  return (
    <>
      <div className="p-3">
        {/* 兩個 Modal */}
        <CouponModal
          closeModal={closeModal}
          getCoupons={getCoupons}
          tempCoupon={tempCoupon}
          type={type}
        />
        <DeleteModal
          close={closeDeleteModal}
          text={tempCoupon?.title}
          handleDelete={deleteCoupon}
          id={tempCoupon?.id}
        />

        <h3>優惠券列表</h3>
        <hr />
        <div className="text-end">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => openCouponModal("create", {})}
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
            {coupons.map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{c.percent}</td>
                {/* 若 due_date 是 Unix「秒」→ 乘 1000 轉 JS Date */}
                <td>
                  {c.due_date
                    ? new Date(c.due_date * 1000).toLocaleDateString()
                    : "-"}
                </td>
                <td>{c.code}</td>
                <td>{c.is_enabled ? "啟用" : "未啟用"}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => openCouponModal("edit", c)}
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => openDeleteModal(c)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination pagination={pagination} changePage={getCoupons} />
      </div>
    </>
  );
}
