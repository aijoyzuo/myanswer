import { NavLink } from "react-router-dom";
import useWishList from "../hook/useWishList";
import { useRef } from "react";
import { Collapse } from "bootstrap/dist/js/bootstrap.bundle.min";





export default function Navbar({ cartData }) {
    const { wishList } = useWishList;
    const collapseRef = useRef(null);

    const handleNavClick = () => {
        if (window.innerWidth < 768 && collapseRef.current) { //collapseRef.current：確保 ref 真的有抓到 <div className="collapse navbar-collapse" id="navbarNav"> 這個 DOM 元素。
            // useRef(null) 創建一個物件，裡面有一個 .current 屬性，初始值是 null。
            //把這個 collapseRef 綁定（ref={collapseRef}）到某個 JSX 元素上後，React 會自動把該元素的 DOM 節點指派給 collapseRef.current。
            const bsCollapse = Collapse.getOrCreateInstance(collapseRef.current);
            //Collapse.getOrCreateInstance(element) 會：
            //檢查這個 element（DOM 節點）上是否已經有一個 Bootstrap Collapse 的實例（instance）。
            //如果有，就回傳已存在的實例。
            //如果沒有，就建立一個新的 Collapse 實例並回傳。
            bsCollapse.hide();//呼叫 Bootstrap 提供的 .hide() 方法
        }
    };

    const getNavClass = ({ isActive }) =>
        'nav-link ps-0 text-decoration-none' + (isActive ? ' text-dark fw-bold' : '');


    return (
        <>
            <div className="bg-warning text-dark text-center py-2 fw-bold small marquee">
                <span>歡迎加入ANSWER  ❤️ 新戶優惠，輸入 happy99 享不限金額 9 折!!  ❤️</span>
            </div>
            <div className="bg-white sticky-top">
                <div className="container">
                    <nav className="navbar px-0 navbar-expand-md navbar-light bg-white">
                        <div className="container-fluid position-relative d-flex align-items-center justify-content-between">
                            <button className="navbar-toggler d-md-none"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarNav"
                                aria-controls="navbarNav"
                                aria-expanded="false"
                                aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon" style={{ width: "18px", height: "18px" }}></span>
                            </button>
                            <ul className="navbar-nav d-none d-md-flex gap-2 w-50">
                                <li className="nav-item">
                                    <NavLink className={getNavClass} to='/' >關於我們</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className={getNavClass} to='/services'>服務項目</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className={getNavClass} to='/products'>產品列表</NavLink>
                                </li>
                            </ul>
                            <NavLink className="navbar-brand position-absolute" to="/" style={{ top: "0%", left: "50%", transform: "translateX(-50%)" }}>
                                ANSWER 肌膚管理中心
                            </NavLink>
                            <div className="d-flex align-items-center justify-content-end w-50">
                                <NavLink to="/wishlist" className="nav-link position-relative d-none d-md-block">
                                    <i className="bi bi-heart-fill"></i>
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {wishList.length}
                                    </span>
                                </NavLink>
                                <NavLink to="/cart" className="nav-link position-relative ms-4">
                                    <i className="bi bi-bag-fill"></i>
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {cartData?.carts?.length}
                                    </span>
                                </NavLink>
                            </div>
                            <div className="collapse navbar-collapse" id="navbarNav" ref={collapseRef}  >
                                <ul className="navbar-nav text-center w-100 d-md-none">
                                    <li className="nav-item">
                                        <NavLink className="nav-link pt-3" to="/" onClick={handleNavClick}>
                                            關於我們
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link pt-3" to="/services" onClick={handleNavClick}>
                                            服務項目
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link pt-3" to="/products" onClick={handleNavClick}>
                                            產品列表
                                        </NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink className="nav-link pt-3" to="/wishlist" onClick={handleNavClick}>
                                            <i className="bi bi-heart-fill me-1"></i>
                                            心動清單
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav >
                </div >
            </div >
        </>
    )
}