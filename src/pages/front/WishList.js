// WishList.jsx
import useWishList from '../../hook/useWishList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import Breadcrumbs from "../../components/Breadcrumbs";
import { useToast } from '../../context/toastContext';



export default function WishList() {
    const { wishList, handleToggleWish } = useWishList();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);//加入購物車
    const { getCart } = useOutletContext();//外層傳進來的功能//加入購物車

    const toast = useToast(); // ✅ 取得全站 Toast API

    useEffect(() => {

        const getAllProducts = async () => {
            setIsLoading(true);
            const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
            const allProducts = res.data.products;
            const filtered = Object.values(allProducts).filter((item) => wishList.includes(item.id));
            setProducts(filtered);
            setIsLoading(false);
        };
        getAllProducts();
    }, [wishList]);

    const handleAddToCart = async (product, qty = 1) => {
        const data = { data: { product_id: product.id, qty } };
        setIsLoading(true);
        try {
            await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`, data);
            await getCart(); // 更新購物車
            // 成功吐司：帶產品名更友善
            toast.success(`已加入購物車：${product.title}`);
        } catch (error) {
            const msg = error?.response?.data?.message || '加入購物車失敗';
            toast.error(msg); // 失敗吐司      
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="container my-5">
            <Loading isLoading={isLoading} />
            <Breadcrumbs />
            <h2>心動清單</h2>
            <div>
                {wishList.length === 0 ? (
                    <div className="text-center">
                        <p>目前沒有心動商品。</p>
                        <Link to="/products" className="btn btn-primary rounded-0">
                            前往產品列表
                        </Link>
                    </div>) : (
                    <div className="row">
                        {products.map((product) => (
                            <div className="col-md-3" key={product.id}>
                                <div className="card border-0 h-100 position-relative">
                                    <img src={product.imageUrl} alt="" className="card-img-top wishlist-img" />
                                    <div className="card-body d-flex flex-column text-center">
                                        <h5>{product.title}</h5>
                                        <p className="text-muted">{product.category}</p>
                                        <p>NT${product.price}</p>
                                        <button className="btn btn-outline-primary mt-auto rounded-0" onClick={() => handleToggleWish(product.id)}>取消收藏</button>
                                        <button className="btn btn-primary mt-2 rounded-0"
                                            onClick={() => handleAddToCart(product, 1)}   // <-- 重要
                                            disabled={isLoading || !product?.id}>加入購物車</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}</div>
        </div>
    );
}
