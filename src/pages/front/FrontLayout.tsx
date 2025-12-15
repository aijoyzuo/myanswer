import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { WishListProvider } from "../../context/wishListContext";
import Swal from "sweetalert2";

type ApiErrorData = { message?: string; success?: boolean };

interface CartProduct {
  id: string;
  title?: string;
  price?: number;
  imageUrl?: string;
  description?: string;
  [key: string]: unknown;
}

interface CartItem {
  id: string;
  product_id: string;
  qty: number;
  total: number;
  product: CartProduct;
  [key: string]: unknown;
}

export interface CartData {
  carts: CartItem[];
  total: number;
  final_total: number;
  [key: string]: unknown;
}

type CartApiResponse = {
  data?: Partial<CartData>;
  success?: boolean;
  message?: string;
};

export default function FrontLayout(): JSX.Element {
  const [cartData, setCartData] = useState<CartData>({
    carts: [],
    total: 0,
    final_total: 0,
  });

  const Toast = useMemo(
    () =>
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      }),
    []
  );

  const getErrMsg = (err: unknown, fallback = "請稍後再試"): string => {
    const axErr = err as AxiosError<ApiErrorData>;
    return axErr.response?.data?.message || axErr.message || fallback;
  };

  const getCart = async (): Promise<void> => {
    try {
      const res = await axios.get<CartApiResponse>(
        `/v2/api/${process.env.REACT_APP_API_PATH}/cart`
      );

      const rawData = res.data?.data ?? {};

      const cleanedData: CartData = {
        carts: (rawData.carts as CartItem[]) ?? [],
        total: Number(rawData.total ?? 0),
        final_total: Math.ceil(Number(rawData.final_total ?? 0)),
        ...rawData,
      };

      setCartData(cleanedData);
    } catch (error: unknown) {
      await Toast.fire({
        icon: "error",
        title: "載入購物車失敗",
        text: getErrMsg(error),
      });
    }
  };

  useEffect(() => {
    void getCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <WishListProvider>
        <Navbar cartData={cartData} />
        <main className="flex-grow-1">
          <Outlet context={{ getCart, cartData }} />
        </main>

        <footer className="bg-dark">
          <div className="container">
            <div
              className="d-flex align-items-center justify-content-center text-white"
              style={{ height: "48px" }}
            >
              <p className="mb-0">© 2025 ANSWER All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      </WishListProvider>
    </div>
  );
}
