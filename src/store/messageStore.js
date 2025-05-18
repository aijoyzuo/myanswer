/*這個頁面的功能：
設定「全域狀態管理邏輯」，包含：
1.Context（讓多個元件可以共享資料）
2.reducer（定義怎麼根據 action 改變狀態）
3.initialState（初始狀態） */

import { createContext } from "react";//引入 React 的 createContext 函數，用來創建 Context 物件

//useContext做跨元件傳遞
export const MessageContext = createContext({});//未來可以用 useContext(MessageContext) 在任意子元件中取用這個 context。
export const inistate = {
    type: '',
    title: '',
    text: ''
};


//Reducer
export const messageReducer = (state, action) => { //兩個參數：state（當前狀態）與 action（觸發的行為）。
    switch (action.type) {//action.type是我在Message.js中設定的
        case "POST_MESSAGE": //收到 "POST_MESSAGE" 的 action，回傳一個新的狀態物件
            return{
                ...action.payload, //寫在productModals
            };
        case "CLEAR_MESSAGE": //收到 "CLEAR_MESSAGE"，就回復為初始狀態
            return{
                ...inistate,
            }
        default:
            return state;  //如果 action type 沒有匹配的，就回傳原本的 state（不做任何變更）
            
    }
}

export function handleSuccessMessage(dispatch, res) { //這個函式本來在ProductModal寫好，因為太長所以封裝(右鍵重構)，封裝好後剪下貼上到Store中，再export出去使用
    dispatch({
        type: 'POST_MESSAGE', //顯示成功訊息
        payload: {
            type: 'success',
            title: '更新成功',
            text: res.data.message,
        },
    });
    setTimeout(()=>{
        dispatch({
            type:'CLEAR_MESSAGE',
        });
    },3000);
}

export function handleErrorMessage(dispatch, error) {
    dispatch({
        type: 'POST_MESSAGE', //顯示成功訊息
        payload: {
            type: 'danger',
            title: '失敗',
            text: Array.isArray(error?.response?.data?.message) ? error?.response?.data?.message.join('，') : error?.response?.data?.message,
            //isArray判斷是否為陣列，如果是就用join將陣列組合,不是就呈現message。?. (optional chaining) ：如果 error 或 response 或 data 其中一個不存在，這段程式不會直接報錯，而是變成 undefined。
        },
    });
    setTimeout(()=>{
        dispatch({
            type:'CLEAR_MESSAGE',
        });
    },3000);
}