import React, { createContext, useContext, useMemo } from 'react';
import Swal, {
  SweetAlertOptions,
  SweetAlertResult,
} from 'sweetalert2';

/** ---- 型別定義 ---- */
export type ToastAPI = {
  /** 直接使用原生 fire */
  fire: (opts?: SweetAlertOptions) => Promise<SweetAlertResult>;
  /** 常用捷徑 */
  success: (title: string, opts?: SweetAlertOptions) => Promise<SweetAlertResult>;
  error:   (title: string, opts?: SweetAlertOptions) => Promise<SweetAlertResult>;
  info:    (title: string, opts?: SweetAlertOptions) => Promise<SweetAlertResult>;
  warning: (title: string, opts?: SweetAlertOptions) => Promise<SweetAlertResult>;
  /** 需要確認的對話框（非 toast） */
  confirm: (title: string, text?: string, opts?: SweetAlertOptions) => Promise<SweetAlertResult>;
};

export type ToastProviderProps = {
  children: React.ReactNode;
  /** 可覆寫 mixin 的預設行為 */
  options?: SweetAlertOptions;
};

/** 用 undefined 當預設值，忘記包 Provider 時 useToast 會拋錯 */
const toastContext = createContext<ToastAPI | undefined>(undefined);

export function ToastProvider({ children, options = {} }: ToastProviderProps) {
  const Toast = useMemo(
    () =>
      Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2200,
        timerProgressBar: true,
        ...options,
      }),
    [options]
  );

  const api: ToastAPI = useMemo(
    () => ({
      fire: (opts) => Toast.fire(opts),

      success: (title, opts = {}) =>
        Toast.fire({ icon: 'success', title, ...opts }),

      error: (title, opts = {}) =>
        Toast.fire({ icon: 'error', title, ...opts }),

      info: (title, opts = {}) =>
        Toast.fire({ icon: 'info', title, ...opts }),

      warning: (title, opts = {}) =>
        Toast.fire({ icon: 'warning', title, ...opts }),

      // 確認視窗（非 toast）：用原生 Swal.fire
      confirm: (title, text, opts = {}) =>
        Swal.fire({
          title,
          text,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          ...opts,
        }),
    }),
    [Toast]
  );

  return <toastContext.Provider value={api}>{children}</toastContext.Provider>;
}

/** 方便的 Hook：忘記包 Provider 會拋錯，避免靜默失敗 */
export function useToast(): ToastAPI {
  const ctx = useContext(toastContext);
  if (!ctx) throw new Error('useToast 必須在 <ToastProvider> 內使用');
  return ctx;
}
