import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type LoginForm = {
  username: string;
  password: string;
};

type ApiErrorData = {
  message?: string;
  [key: string]: unknown;
};

type SignInResponse = {
  token: string;
  expired: number | string; // 有些後端是 timestamp，有些是字串
  success: boolean;
  message?: string;
};

export default function Login(): JSX.Element {
  const navigate = useNavigate();

  const [data, setData] = useState<LoginForm>({
    username: "",
    password: "",
  });

  const [error, setError] = useState<ApiErrorData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value } as LoginForm));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await axios.post<SignInResponse>("/v2/admin/signin", data);
      const { token, expired, success } = res.data;

      document.cookie = `answerToken=${token}; expires=${new Date(
        expired
      ).toUTCString()}; path=/`;

      if (success) {
        axios.defaults.headers.common["Authorization"] = token;
        navigate("/admin/products");
      } else {
        setError({ message: res.data.message ?? "登入失敗" });
      }
    } catch (err: unknown) {
      const axErr = err as AxiosError<ApiErrorData>;
      setError(axErr.response?.data ?? { message: "登入失敗，請稍後再試" });
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
