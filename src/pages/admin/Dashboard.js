import { Outlet, useNavigate,Link} from "react-router-dom";
import axios from "axios";
import { useEffect, useReducer } from "react"; //useReducer要加在有Provider元件的這頁
import Message from "../../components/Message";
import { MessageContext,messageReducer,inistate } from "../../store/messageStore";

export default function Dashboard() {
  const navigate = useNavigate();//轉址回登入畫面
  const reducer = useReducer(messageReducer,inistate);

  const logout = () => {
    document.cookie = 'answerToken=;';//登出清除 token，並將 logout 加到按鈕上
    navigate('/login');
  };

  //↓這整段是為了取出token
  const token = document.cookie //取得cookie字串
    .split("; ")//將整個 cookie 字串依照 分號 分開，做成字串的陣列
    .find((row) => row.startsWith("answerToken="))//陣列中有好幾個row，從中找到第一個以answerToken=開頭的字串，如果沒找到就回傳undefined
    ?.split("=")[1];//?.代表optional chaining，如果前面不是 undefined 才會執行。用=將前面得到的"answerToken=123"拆成陣列["answerToken","123"]，並取得第[1]筆的值(也就是123)
  axios.defaults.headers.common['Authorization'] = token;//這行的功能是讓接下來所有的 axios 請求都自動帶上這個 token

  useEffect(() => { 
    if (!token) {//如果沒 token，導回登入頁，避免未授權者進入
      return navigate('/login');//用return讓它不再往下運行
    }
    (async () => {//如果有 token，驗證 token是否正確，否則導回登入頁
      try {
        await axios.post('/v2/api/user/check');
      } catch (error) {
        console.log(error);
        if(error.response.data.success){
          navigate('/login');
        }
      }
    })();
    
  }, [navigate, token]);

  return (
    <MessageContext.Provider value={reducer}>
    <Message />
      <nav className="navbar navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <p className="text-white mb-0">
            ANSWER 後台管理系統
          </p>
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
                <button type="button" className="btn btn-sm btn-light" onClick={logout}>
                  登出
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="d-flex" style={{ minHeight: 'calc(100vh - 56px)' }}>
        <div className="bg-light" style={{ width: '200px' }}>
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
          {/* Products */}
          {token && <Outlet />}
          {/* 只有在有 token 的情況下，才會渲染 <Outlet />  */}
        </div>
      </div>
    </MessageContext.Provider>
  )
}

