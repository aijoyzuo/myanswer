// 用 form 的 onSubmit 讓按 Enter 可送出表單
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    password: "",
  });

  // 只在錯誤時有值：{ message, ... }
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    // 使用者輸入時清掉舊錯誤
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 避免表單刷新
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await axios.post("/v2/admin/signin", data);
      const { token, expired, success } = res.data;

      // 將 token 存入 cookie（標準 UTC 格式）
      document.cookie = `answerToken=${token}; expires=${new Date(expired).toUTCString()}; path=/`;

      if (success) {
        axios.defaults.headers.common["Authorization"] = token; // 全域帶 token
        navigate("/admin/products");
      }
    } catch (err) {
      // 後端常見錯誤格式：{ message: "..." }
      setError(err?.response?.data ?? { message: "登入失敗，請稍後再試" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>登入帳號</h2>

          <div
            className={`alert alert-danger ${error?.message ? "d-block" : "d-none"}`}
            role="alert"
          >
            {error?.message}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-2">
              <label htmlFor="email" className="form-label w-100">
                Email
                <input
                  id="email"
                  name="username"
                  type="email"
                  className="form-control"
                  placeholder="Email Address"
                  value={data.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                  disabled={isSubmitting}
                />
              </label>
            </div>

            <div className="mb-2">
              <label htmlFor="password" className="form-label w-100">
                密碼
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="請輸入密碼"
                  value={data.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                />
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "登入中…" : "登入"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
