import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { useState, useEffect } from "react";
import axios from "axios";
import CarouselPart from "../../components/CarouselPart";
import { Carousel } from 'bootstrap';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    const authorItem = [
        {
            img: 'https://images.plurk.com/2q6n4tT7dJluO9ZuWzTiX3.png',
            text: '我們專注於皮膚健康醫美、品牌管理工具、心靈成長冥想與閱讀寫作樂活，打造身心靈整合的美好生活提案。',
            author: '鄭惠文 皮膚專科醫師',
        },
        {
            img: 'https://images.plurk.com/27uRo9dvtz1eeept5BKDco.png',
            text: '我們結合臨床醫美技術、心智覺察訓練與敘事書寫，陪伴顧客共同探索外在美感與內在自信的整合式生活提案。',
            author: '吳明倫 整形外科醫師',
        },
        {
            img: 'https://images.plurk.com/1IomxDHPrNnKBhljgLwOiP.png',
            text: '我們融合女性健康教育、品牌定位思維、身心平衡冥想以及療癒性書寫，打造支持女性全生命週期的整體性健康管理與生活美學系統。',
            author: '蘇瀅伶 婦產科醫師',
        }
    ]

    useEffect(() => {
        const carouselEl = document.querySelector('#carouselExampleControls');
        if (carouselEl) {
            const carouselInstance = new Carousel(carouselEl, {
                interval: 2000,
                ride: 'carousel',
                wrap: true,
            });
        }
    }, []);

    const getProducts = async (page = 1) => { //如果沒有帶入參數page，預設值為1
        setIsLoading(true);
        const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products?page=${page}`);//問號用來查詢參數
        console.log("前台產品資料", productRes);
        setProducts(productRes.data.products);
        setPagination(productRes.data.pagination);
        setIsLoading(false);
    }

    useEffect(() => {
        getProducts(1)
    }, [])



    return (<>
        <div className="container">
            <Loading isLoading={isLoading} />
            <div className="row flex-md-row-reverse flex-column">
                <div className="col-md-7">
                    <img
                        src="https://images.plurk.com/52b9CUh5PAv7UT3ScyjoTk.jpg" className="object-cover" style={{ width: "100%", }} />
                </div>
                <div className="col-md-5 d-flex flex-column justify-content-center mt-md-0 mt-3">
                    <h2 className="fw-bold">ANSWER</h2>
                    <p className="h6 font-weight-normal text-muted mt-2">
                        提供安心專業的肌膚管理產品與肌管諮詢，在舒適放鬆的環境，享受最有效率的保養。
                    </p>
                </div>
            </div>
        </div>
        <div className="bg-light mt-7">
            <div className="container">
                <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel" data-bs-interval="1500" data-bs-wrap="true">
                    <div className="carousel-inner">
                        {authorItem.map((item, index) => (
                            <CarouselPart
                                key={index}
                                img={item.img}
                                text={item.text}
                                author={item.author}
                                isActive={index === 0}
                            />
                        ))}
                    </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        </div >
        <div className="container my-7">
            <div className="row">
                {products.slice(0, 3).map((product) => (

                    <div className="col-md-4" key={product.id}>
                        <Link to={`/product/${product.id}`} className="text-decoration-none">
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            />
                            <h4 className="mt-1 text-center">{product.title}</h4>
                            <p className="text-muted mt-1 h6 text-center">{product.category}</p>
                            <p className="text-muted">{product.description}</p>
                        </Link>
                    </div>
                ))}
            </div>

        </div >
        <div className="bg-light py-7">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-4 text-center">
                        <Link to="/products" className="btn btn-primary rounded-0 mb-4 text-white">
                            前往產品列表
                        </Link>
                        <h3>安瑟肌膚管理中心</h3>
                        <p className="text-muted">貴賓諮詢專線：02-77099399</p>
                        <p className="text-muted">地址：台北市大安區安和路一段113號2樓之一<br />（近捷運信義安和站1號出口）</p>
                        <ul className="list-unstyled d-flex justify-content-center h4">
                            <li className="me-3">
                                <a href="https://www.facebook.com/MMedicalGroup/?ref=embed_page#"><i class="bi bi-facebook"></i></a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/answer_skincare/"><i class="bi bi-instagram"></i></a>
                            </li>
                            <li className="ms-3">
                                <a href="https://line.me/R/ti/p/%40vwp1840p"><i class="bi bi-line"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </>)
}