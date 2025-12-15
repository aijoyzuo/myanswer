import { Outlet, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Message from "../../components/Message";
import { MessageProvider } from "../../context/messageContext";

export default function Dashboard(): JSX.Element {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  const getToken = () => {
    const raw = document.cookie
      .split("; ")
      .find((row) => row.startsWith("answerToken="));
    return raw ? raw.split("=")[1] : "";
  };

  const token = getToken();
  if (token) axios.defaults.headers.common["Authorization"] = token;
  else delete axios.defaults.headers.common["Authorization"];

  const handleLogout = () => {
    document.cookie =
      "answerToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const res = await axios.post("/v2/api/user/check");
        if (!res?.data?.success) navigate("/login");
      } catch {
        navigate("/login");
      } finally {
        setAuthChecked(true);
      }
    })();
  }, [navigate, token]);

  return (
    <MessageProvider>
      <Message />
      {/* 下面 UI 你原本的照放 */}
      <nav className="navbar navbar-expand-lg bg-dark">
        {/* ...略 */}
        <button type="button" className="btn btn-sm btn-light" onClick={handleLogout}>
          登出
        </button>
      </nav>

      <div className="d-flex" style={{ minHeight: "calc(100vh - 56px)" }}>
        <div className="bg-light" style={{ width: "200px" }}>
          <ul className="list-group list-group-flush">
            <Link className="list-group-item list-group-item-action py-3" to="/admin/products">
              產品列表
            </Link>
            <Link className="list-group-item list-group-item-action py-3" to="/admin/coupons">
              優惠卷列表
            </Link>
            <Link className="list-group-item list-group-item-action py-3" to="/admin/orders">
              訂單列表
            </Link>
          </ul>
        </div>

        <div className="w-100">{authChecked && <Outlet />}</div>
      </div>
    </MessageProvider>
  );
}
