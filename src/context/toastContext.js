import { createContext, useContext, useMemo } from 'react';
import Swal from 'sweetalert2';


const toastContext = createContext(null);

export function ToastProvider({ children, options = {} }) {
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

  const api = useMemo(
    () => ({
      fire: (opts) => Toast.fire(opts),
      success: (title, opts = {}) => Toast.fire({ icon: 'success', title, ...opts }),
      error:   (title, opts = {}) => Toast.fire({ icon: 'error',   title, ...opts }),
      info:    (title, opts = {}) => Toast.fire({ icon: 'info',    title, ...opts }),
      warning: (title, opts = {}) => Toast.fire({ icon: 'warning', title, ...opts }),
      // 需要確認視窗時也能共用（非 toast）
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

export function useToast() {
  const ctx = useContext(toastContext);
  if (!ctx) throw new Error('useToast 必須在 <ToastProvider> 內使用');
  return ctx;
}
