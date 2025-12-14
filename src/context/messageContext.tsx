import React, { createContext, useReducer, useContext } from 'react';

/** ---- Types ---- */

export type MessageKind = '' | 'success' | 'danger' | 'info' | 'warning';

export interface MessageState {
  type: MessageKind;
  title: string;
  text: string;
}

export type PostMessageAction = {
  type: 'POST_MESSAGE';
  payload: MessageState;
};

export type ClearMessageAction = {
  type: 'CLEAR_MESSAGE';
};

export type MessageAction = PostMessageAction | ClearMessageAction;

/** ---- Initial State ---- */

export const initialState: MessageState = {
  type: '',
  title: '',
  text: '',
};

/** ---- Reducer ---- */
export function messageReducer(state: MessageState, action: MessageAction): MessageState {
  switch (action.type) {
    case 'POST_MESSAGE':
      return {
        ...action.payload,
      };
    case 'CLEAR_MESSAGE':
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

/** ---- Context ----
 *  建議用 undefined 當預設值，若忘記包 Provider，useContext 會拋錯更安全
 */
export type MessageContextValue = {
  state: MessageState;
  dispatch: React.Dispatch<MessageAction>;
};

export const MessageContext = createContext<MessageContextValue | undefined>(undefined);

/** ---- Optional: Provider（如果你想在同檔提供） ---- */
export const MessageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, initialState);
  return (
    <MessageContext.Provider value={{ state, dispatch }}>
      {children}
    </MessageContext.Provider>
  );
};

/** ---- Helper Hooks ---- */
export function useMessage(): MessageContextValue {
  const ctx = useContext(MessageContext);
  if (!ctx) throw new Error('useMessage 必須在 <MessageProvider> 內使用');
  return ctx;
}

/** ---- Helpers (和你原本的 API 介面相容) ---- */

type SuccessRes = { data?: { message?: string } };

export function handleSuccessMessage(dispatch: React.Dispatch<MessageAction>, res: SuccessRes): void {
  dispatch({
    type: 'POST_MESSAGE',
    payload: {
      type: 'success',
      title: '更新成功',
      text: res?.data?.message ?? '',
    },
  });

  // 3 秒後清空
  setTimeout(() => {
    dispatch({ type: 'CLEAR_MESSAGE' });
  }, 3000);
}

type ErrorLike = unknown;

export function handleErrorMessage(dispatch: React.Dispatch<MessageAction>, error: ErrorLike): void {
  // 嘗試讀取常見的 Axios error 結構
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const msgSource = (error as any)?.response?.data?.message;
  const text =
    Array.isArray(msgSource) ? msgSource.join('，') : typeof msgSource === 'string' ? msgSource : '發生未知錯誤';

  dispatch({
    type: 'POST_MESSAGE',
    payload: {
      type: 'danger',
      title: '失敗',
      text,
    },
  });

  setTimeout(() => {
    dispatch({ type: 'CLEAR_MESSAGE' });
  }, 3000);
}
