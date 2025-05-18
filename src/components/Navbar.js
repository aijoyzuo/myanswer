import { NavLink } from "react-router-dom";
import { useWishList } from "../store/wishListContext";


export default function Navbar({ cartData}) {
    const { wishList } = useWishList();
    return (
        <>
            <div className="bg-white sticky-top">
                <div className="container">
                    <nav className="navbar px-0 navbar-expand-lg navbar-light bg-white">
                        <NavLink className="navbar-brand position-absolute" to="/"
                            style={{ left: '50%', transform: 'translate(-50%, -50%)', top: '50%', }}>
                            ANSWER 安瑟肌膚管理中心
                        </NavLink>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse bg-white custom-header-md-open" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item active">
                                    <NavLink className="nav-link ps-0" to='/products'>產品列表</NavLink>
                                </li>
                            </ul>
                        </div>
                        <div className="d-flex">
                            <NavLink to="/wishlist" className="nav-link position-relative">
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
                    </nav>
                </div>
            </div>
        </>
    )
}