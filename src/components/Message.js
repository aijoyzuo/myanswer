/* 這個元件的功能：建立畫面元件，使用這個跨元件的狀態（message）來顯示或觸發改變*/
/*建立一個 Message 元件，並透過 useContext 這個 React Hook，從 MessageContext（一個跨元件共享的 Context 物件）中取得：
message：目前的狀態資料（由 reducer 管理）
dispatch：一個可以發送 action、改變 message 狀態的函式
之後這個 message 的內容統一由 dispatch(action) 觸發對應的 reducer 邏輯來更新。*/



import { useContext } from "react";
import { MessageContext } from "../store/messageStore";

export default function Message() {
  const [message] = useContext(MessageContext);

  return (
    <>

      <div
        className='toast-container position-fixed'
        style={{ top: '20px', right: '15px' }}
      >
        {message.title && (
          <div
            className='toast show'
            role='alert'
            aria-live='assertive'
            aria-atomic='true'
            data-delay='3000'
          >
            <div className={`toast-header text-white bg-${message.type}`}>
              <strong className='me-auto'>{message.title}</strong>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='toast'
                aria-label='Close'
              />
            </div>
            <div className='toast-body'>{message.text}</div>
          </div>
        )}

      </div>
    </>
  );
}