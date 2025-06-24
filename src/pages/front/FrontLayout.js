//style在js中應該要以物件方式寫，並將文字改成字串，分號改成逗號， object-fit 應該改成objectFit
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import { WishListProvider } from "../../store/wishListContext";


export default function FrontLayout() {
  const [cartData, setCartData] = useState({}); //取得購物車資訊

  const getCart = async () => {
    try {
      const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`,);


      const rawData = res.data.data; // 處理優惠券打折後進位的問題 final_total
      const cleanedData = {
        ...rawData,
        final_total: Math.ceil(rawData.final_total),
      };

      setCartData(cleanedData); // 提供給所有頁面使用
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCart();
  }, [])

  return (<>
    <WishListProvider>
      <Navbar cartData={cartData}></Navbar>
      <Outlet context={{ getCart, cartData }}></Outlet>
      <div className="bg-dark">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between text-white py-4">
            <p className="mb-0">© 2025 ANSWER All Rights Reserved.</p>
            <ul className="d-flex list-unstyled mb-0 h4">
              <li><a href="#" className="text-white mx-3"><i className="fab fa-facebook"></i></a></li>
              <li><a href="#" className="text-white mx-3"><i className="fab fa-instagram"></i></a></li>
              <li><a href="#" className="text-white ms-3"><i className="fab fa-line"></i></a></li>
            </ul>
          </div>
        </div>
      </div>
    </WishListProvider>
  </>)
}