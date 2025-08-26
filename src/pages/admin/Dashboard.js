import { Outlet, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import Message from "../../components/Message";
import { MessageContext, messageReducer, inistate } from "../../context/messageContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const reducer = useReducer(messageReducer, inistate);
  const [authChecked, setAuthChecked] = useState(false);

  // 讀取 cookie 的小工具
  const getToken = () => {
    const raw = document.cookie.split("; ").find((row) => row.startsWith("answerToken="));
    return raw ? raw.split("=")[1] : "";
  };

  const token = getToken();
  if (token) {
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }

  const handleLogout = () => {
    // 正確清 cookie（含 path 與立刻過期）
    document.cookie = "answerToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  useEffect(() => {
    // 沒 token：直接回登入
    if (!token) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const res = await axios.post("/v2/api/user/check");
        if (!res?.data?.success) {
          navigate("/login");
          return;
        }
      } catch (error) {
        // 安全取值，任何不成功都導回登入
        const success = error?.response?.data?.success;
        if (!success) navigate("/login");
      } finally {
        setAuthChecked(true);
      }
    })();
  }, [navigate, token]);

  return (
    <MessageContext.Provider value={reducer}>
      <Message />
      <nav className="navbar navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <p className="text-white mb-0">ANSWER 後台管理系統</p>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <button type="button" className="btn btn-sm btn-light" onClick={handleLogout}>
                  登出
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="d-flex" style={{ minHeight: "calc(100vh - 56px)" }}>
        <div className="bg-light" style={{ width: "200px" }}>
          <ul className="list-group list-group-flush">
            <Link className="list-group-item list-group-item-action py-3" to="/admin/products">
              <i className="bi bi-cup-fill me-2" />
              產品列表
            </Link>
            <Link className="list-group-item list-group-item-action py-3" to="/admin/coupons">
              <i className="bi bi-ticket-perforated-fill me-2" />
              優惠卷列表
            </Link>
            <Link className="list-group-item list-group-item-action py-3" to="/admin/orders">
              <i className="bi bi-receipt me-2" />
              訂單列表
            </Link>
          </ul>
        </div>

        <div className="w-100">
          {/* 驗證完成才渲染 Outlet，避免驗證中子頁先跑 API 導致 crash */}
          {authChecked && <Outlet />}
        </div>
      </div>
    </MessageContext.Provider>
  );
}
