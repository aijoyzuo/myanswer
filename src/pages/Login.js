//用form的onsubmit功能達到按enter可以送出表單

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: '',
    password: ''
  });

  const [loginState, setLoginState] = useState({});//用來儲存登入失敗的資訊

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });//中括號是因為他是動態的，我有username跟password兩種[name]屬性的資料
  }

  const submit = async (e) => {
    e.preventDefault(); //避免表單刷新
    try {
      const res = await axios.post('/v2/admin/signin', data);//發送 POST 請求 到後端登入 API（路徑是 /v2/admin/signin，data是我的登入資訊）
      const { token, expired } = res.data; //從回傳資料中，解構出 token 跟 expired (Token過期時間)

      document.cookie = `answerToken=${token}; expires=${new Date(expired)} `; //把 token 寫進瀏覽器的 cookie 裡面，名稱是 answerToken。expires=${new Date(expired)} 是設定這個 cookie 什麼時候會自動過期

      if (res.data.success) {
        axios.defaults.headers.common['Authorization'] = token;//token 設為 Axios 全域預設值讓其他元件也能取用
        navigate('/admin/products');
      }
    } catch (error) {
      setLoginState(error.response.data);//搭配錯誤訊息d-block的撰寫
    }

    //這整段是為了儲存token
  }



  return (<div className="container py-5">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2>登入帳號</h2>

        <div className={`alert alert-danger ${loginState.message ? 'd-block' : 'd-none'}`} role="alert">
          {/*loginState.message抓的是loerror.response.data也就是錯誤的訊息，所以三元運算子算的是當有這個錯誤訊息時，d-block錯誤訊息提示，沒有錯誤訊息時d-none，沒有錯誤訊息時d-none*/}
          {loginState.message}
        </div>

        <form onSubmit={submit}>
          <div className="mb-2">
            <label htmlFor="email" className="form-label w-100">
              Email
              <input id="email" className="form-control" name="username" type="email" placeholder="Email Address" onChange={handleChange} />
            </label>
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="form-label w-100">
              密碼
              <input type="password" className="form-control" name="password" id="password" placeholder="name@example.com" onChange={handleChange} />
            </label>
          </div>
          <button type="submit" className="btn btn-primary">登入</button>
        </form>

      </div>
    </div>
  </div>)
}

