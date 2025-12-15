// src/pages/admin/AdminProducts.tsx
import { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import ProductModal from "../../components/ProductModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination, { type PaginationData } from "../../components/Pagination";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";

type ModalMode = "create" | "edit";

interface Product {
  id: string;
  category?: string;
  title?: string;
  price?: number;
  origin_price?: number;
  unit?: string;
  description?: string;
  content?: string;
   is_enabled?: 0 | 1
  imageUrl?: string;
  imagesUrl?: string[];
  [key: string]: unknown;
}

interface ProductsResponse {
  products?: Product[];
  pagination?: PaginationData;
  success?: boolean;
  message?: string;
}

interface ApiBaseResponse {
  success?: boolean;
  message?: string;
}

export default function AdminProducts(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [type, setType] = useState<ModalMode>("create");
  const [tempProduct, setTempProduct] = useState<Partial<Product>>({});

  const productModal = useRef<Modal | null>(null);
  const deleteModal = useRef<Modal | null>(null);

  useEffect(() => {
    const productEl = document.getElementById("productModal");
    const deleteEl = document.getElementById("deleteModal");

    if (productEl) {
      productModal.current = new Modal(productEl, {
        backdrop: "static",
        keyboard: false,
      });
    }
    if (deleteEl) {
      deleteModal.current = new Modal(deleteEl, {
        backdrop: "static",
        keyboard: false,
      });
    }

    void getProducts();

    return () => {
      productModal.current?.dispose();
      deleteModal.current?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProducts = async (page = 1): Promise<void> => {
    try {
      const productRes = await axios.get<ProductsResponse>(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/products?page=${page}`
      );
      setProducts(productRes.data.products ?? []);
      setPagination(productRes.data.pagination ?? null);
    } catch {
      void Swal.fire({
        title: "載入產品失敗",
        text: "請稍後再試或聯絡管理員。",
        icon: "error",
        confirmButtonText: "確定",
      });
    }
  };

  const openProductModal = (mode: ModalMode, product: Partial<Product> = {}): void => {
    setType(mode);
    setTempProduct(product);
    productModal.current?.show();
  };

  const closeProductModal = (): void => {
    productModal.current?.hide();
  };

  const openDeleteModal = (product: Partial<Product>): void => {
    setTempProduct(product);
    deleteModal.current?.show();
  };

  const closeDeleteModal = (): void => {
    deleteModal.current?.hide();
  };

  const deleteProduct = async (id?: string): Promise<void> => {
    if (!id) return;

    try {
      const res = await axios.delete<ApiBaseResponse>(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${id}`
      );

      if (res.data?.success) {
        await getProducts();
        deleteModal.current?.hide();
      } else {
        void Swal.fire({
          title: "刪除失敗",
          text: res.data?.message || "請稍後再試。",
          icon: "error",
          confirmButtonText: "確定",
        });
      }
    } catch (err: unknown) {
      const axErr = err as AxiosError<{ message?: string }>;
      const msg =
        axErr.response?.data?.message ||
        axErr.message ||
        "刪除過程發生錯誤，請稍後再試";

      void Swal.fire({
        title: msg,
        icon: "error",
        toast: true,
        position: "top",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="p-3">
      <ProductModal
        closeProductModal={closeProductModal}
        getProducts={getProducts}
        tempProduct={tempProduct}
        type={type}
      />

      <DeleteModal
        onClose={closeDeleteModal}
        text={tempProduct.title}
        handleDelete={deleteProduct}
        id={tempProduct.id}
      />

      <h3>產品列表</h3>
      <hr />

      <div className="text-end">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => openProductModal("create", {})}
        >
          建立新商品
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">分類</th>
            <th scope="col">名稱</th>
            <th scope="col">售價</th>
            <th scope="col">啟用狀態</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.category}</td>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td>{product.is_enabled === 1 ? "啟用" : "未啟用"}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => openProductModal("edit", product)}
                >
                  編輯
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm ms-2"
                  onClick={() => openDeleteModal(product)}
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination pagination={pagination} changePage={getProducts} />
    </div>
  );
}
