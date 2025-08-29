// style 在 JSX 內需用物件寫法，值為字串，屬性用駝峰式（例如 objectFit）
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import { WishListProvider } from "../../context/wishListContext";
import Swal from "sweetalert2";

export default function FrontLayout() {
  const [cartData, setCartData] = useState({}); // 取得購物車資訊

  // SweetAlert2 - Toast 共用設定
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  const getCart = async () => {
    try {
      const res = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/cart`
      );

      const rawData = res?.data?.data ?? {};
      // final_total 可能為 undefined，先保底為 0 再進位
      const cleanedData = {
        ...rawData,
        final_total: Math.ceil(Number(rawData.final_total ?? 0)),
      };

      setCartData(cleanedData); // 提供給所有頁面使用
    } catch (error) {
      await Toast.fire({
        icon: "error",
        title: "載入購物車失敗",
        text: error?.response?.data?.message || error?.message || "請稍後再試",
      });
    }
  };

  useEffect(() => {
    getCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <WishListProvider>
          <Navbar cartData={cartData} />
          <main className="flex-grow-1">
            <Outlet context={{ getCart, cartData }} />
          </main>

          <footer className="bg-dark">
            <div className="container">
              <div
                className="d-flex align-items-center justify-content-center text-white"
                style={{ height: "48px" }}
              >
                <p className="mb-0">© 2025 ANSWER All Rights Reserved.</p>
                {/* 
                <ul className="d-flex list-unstyled mb-0 h4">
                  <li><a href="#" className="text-white mx-3"><i className="fab fa-facebook"></i></a></li>
                  <li><a href="#" className="text-white mx-3"><i className="fab fa-instagram"></i></a></li>
                  <li><a href="#" className="text-white ms-3"><i className="fab fa-line"></i></a></li>
                </ul>
                */}
              </div>
            </div>
          </footer>
        </WishListProvider>
      </div>
    </>
  );
}
