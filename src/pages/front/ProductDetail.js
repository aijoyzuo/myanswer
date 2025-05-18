import { useEffect, useState } from 'react';
import axios from 'axios';
import { useOutletContext, useParams } from 'react-router-dom';
import ImageSwiper from '../../components/ImageSwiper';

export default function ProductDetail() {
    const [showFallback, setShowFallback] = useState(false);
    const [product, setProduct] = useState({});
    const [cartQuantity, setCartQuantity] = useState(1);
    const { id } = useParams();//使用useParams抓取網址上的參數，並從中解構出id這個參數，回傳一個物件{id: "-OPOSldtpZ6IAwfukmCw"}，我再將物件中的id變成變數
    const [isLoading, setIsLoading] = useState(false);
    const { getCart } = useOutletContext();//外層傳進來的功能

    const getProduct = async () => {
        const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/product/${id}`);
        //console.log(productRes);
        setProduct(productRes.data.product);
    };

    const addToCart = async () => {
        const data = {
            data: {
                product_id: product.id,
                qty: cartQuantity,
            },
        };
        setIsLoading(true);
        try {
            const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`,
                data
            );
            console.log('加入購物車', res);
            getCart();
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getProduct(id);
    }, [id])

    return (<>
        <div className="container">
            <div className="position-relative overflow-hidden  d-none d-md-block" style={{ height: "350px" }}>
                {/* 半透明白色遮罩 */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(255, 255, 255, 0.2)", // 半透明白色
                        zIndex: 1,
                    }}
                ></div>

                <div className="position-relative overflow-hidden" style={{ height: "350px", }}>
                    {!showFallback ? (
                        <video autoPlay muted loop playsInline className="w-100" style={{
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "bottom",
                            position: "relative",
                        }}
                            onError={() => setShowFallback(true)} // 關鍵：出錯時切換
                        >
                            <source src="/video.mp4" type="video/mp4" />
                        </video>

                    ) :
                        (<img
                            src="/fallback.png"
                            alt="影片無法播放，顯示替代圖片"
                            className="w-100"
                            style={{
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "bottom",
                                position: "relative",
                            }}
                        />)}
                </div>
            </div>
            <div className="container">
                <div className='row'>
                    <div className='col-md-6'>
                        <div style={{
                            height: '300px', backgroundImage: `url(${product.imageUrl})`, //用反引號帶入變數路徑
                            backgroundPosition: 'center center', backgroundSize: 'contain', backgroundRepeat: 'no-repeat',
                        }}>
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <div className="my-4">
                            {Array.isArray(product.imagesUrl) && product.imagesUrl.length > 0 && (
                                <ImageSwiper images={product.imagesUrl} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-between mt-4 mb-7">
                <div className="col-md-7">

                    <h2 className="mb-0">{product.title}</h2>
                    <p className="fw-bold">NT${product.price}</p>
                    <p>{product.description}</p>
                    <div className="accordion border border-bottom border-top-0 border-start-0 border-end-0 mb-3" id="accordionExample">
                        <div className="card border-0">
                            <div className="card-header py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0" id="headingOne" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                                <div className="d-flex justify-content-between align-items-center pe-1">
                                    <h4 className="mb-0">
                                        {product.title}的內容物
                                    </h4>
                                    <i className="fas fa-minus"></i>
                                </div>
                            </div>
                            <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div className="card-body pb-5">
                                    {product.content}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="col-md-4">
                    <div className="input-group mb-3 border mt-3">
                        <div className="input-group-prepend">
                            <button
                                className="btn btn-outline-dark rounded-0 border-0 py-3"
                                type="button"
                                id="button-addon1"
                                onClick={() => setCartQuantity((pre) => pre === 1 ? pre : pre - 1)}
                            >
                                <i className="bi bi-dash"></i>
                            </button>
                        </div>
                        <input
                            type="number"
                            className="form-control border-0 text-center my-auto shadow-none"
                            placeholder=""
                            aria-label="Example text with button addon"
                            aria-describedby="button-addon1"
                            value={cartQuantity}
                            readOnly />
                        <div className="input-group-append">
                            <button className="btn btn-outline-dark rounded-0 border-0 py-3"
                                type="button"
                                id="button-addon2"
                                onClick={() => setCartQuantity((pre) => pre + 1)}
                            >
                                <i className="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                    <button type="button" className="btn btn-primary text-white btn-block rounded-0 py-3 w-100"
                        onClick={() => addToCart()}
                        disabled={isLoading}
                    >加入購物車</button>
                </div>
            </div>
        </div >
    </>)
}