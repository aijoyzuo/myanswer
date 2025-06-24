import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { useState, useEffect } from "react";
import axios from "axios";
import CarouselPart from "../../components/CarouselPart";
import { Carousel } from 'bootstrap';
import { motion } from "framer-motion";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  const authorItem = [
    {
      img: 'https://images.plurk.com/1shnZ9bIDDdZRmX9NF7FlC.png ',
      text: '我們專注於皮膚健康醫美、品牌管理工具、心靈成長冥想與閱讀寫作樂活，打造身心靈整合的美好生活提案。',
      author: '林玲安 皮膚專科醫師',
      alt: '林玲安肖像',
    },
    {
      img: 'https://images.plurk.com/27uRo9dvtz1eeept5BKDco.png',
      text: '我們結合臨床醫美技術、心智覺察訓練與敘事書寫，陪伴顧客共同探索外在美感與內在自信的整合式生活提案。',
      author: '黃憲傑 整形外科醫師',
      alt: '黃憲傑肖像',
    },
    {
      img: 'https://images.plurk.com/1IomxDHPrNnKBhljgLwOiP.png',
      text: '我們融合女性健康教育、品牌定位思維、身心平衡冥想以及療癒性書寫，打造支持女性全生命週期的整體性健康管理與生活美學系統。',
      author: '蔡芸薇 婦產科醫師',
      alt: '蔡芸薇肖像',
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
          <motion.img
            src="https://images.plurk.com/52b9CUh5PAv7UT3ScyjoTk.jpg"
            className="object-cover"
            alt="診所圖片"
            style={{ width: "100%" }}
            initial={{ y: 50, opacity: 0 }}         // 初始狀態：略下方 + 透明
            whileInView={{ y: 0, opacity: 1 }}      // 滑入時：上移到原位 + 顯示
            transition={{ duration: 1, ease: "easeOut" }} // 動畫時間與節奏
            viewport={{ once: true }}              // ✅ 只播放一次，不重複動畫
          />
        </div>
        <div className="col-md-5 d-flex flex-column justify-content-center mt-md-0 mt-3">
          <h2 className="fw-bold">ANSWER</h2>
          <p className="h6 font-weight-normal text-muted mt-2">
            提供安心專業的肌膚管理產品與肌管諮詢，在舒適放鬆的環境，享受最有效率的保養。
          </p>
        </div>
      </div>
    </div>
    <div className="mt-7">
      <div className="container">
        <div className="row">
          <div className="col-md-5">
            <motion.img
              src="https://images.plurk.com/40qerbg5Oa6tDpZGTfO7zb.png"
              alt="診所圖片"
              className="object-cover"
              style={{ width: "100%" }}
              initial={{ y: 50, opacity: 0 }}         // 初始狀態：略下方 + 透明
              whileInView={{ y: 0, opacity: 1 }}      // 滑入時：上移到原位 + 顯示
              transition={{ duration: 1, ease: "easeOut" }} // 動畫時間與節奏
              viewport={{ once: true }}              // ✅ 只播放一次，不重複動畫
            />
          </div>
          <div className="col-md-7">
            <h2 className="fw-bold py-3">經營理念</h2>
            <p> 成立於2017年，致力於打造專業、安心且有效的肌膚保養體驗。中心以「回應肌膚真正需求」為宗旨，結合皮膚科知識與美容科技，提供客製化的肌膚管理方案。
            </p>
            <p>服務團隊由專業醫師以及具美容背景的肌膚管理師組成，皆通過專業訓練並定期進修，確保服務品質與技術同步國際標準。中心亦設有嚴格的品質控管流程，從產品來源、操作流程到顧客回饋，每一環節皆以高規格標準執行，確保每位顧客都能安心享有高效、舒適的肌膚護理體驗。
            </p>
          </div>
        </div>
      </div>


    </div>
    <div className="bg-light mt-7">
      <div className="container">
        <h2 className="fw-bold py-3">醫師團隊</h2>
        <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel" data-bs-interval="1500" data-bs-wrap="true">
          <div className="carousel-inner">
            {authorItem.map((item, index) => (
              <CarouselPart
                key={index}
                img={item.img}
                text={item.text}
                author={item.author}
                isActive={index === 0}
                alt={item.alt}
              />
            ))}
          </div>
        </div>
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
            <h3>ANSWER肌膚管理中心</h3>
            <p className="text-muted">貴賓諮詢專線：02-78099330</p>
            <p className="text-muted">地址：台北市小安區民和路一段113號2樓之一<br />（近捷運小安站1號出口）</p>
            <ul className="list-unstyled d-flex justify-content-center h4">
              <li className="me-3">
                <a href="https://www.facebook.com/MMedicalGroup/?ref=embed_page#"><i className="bi bi-facebook"></i></a>
              </li>
              <li>
                <a href="https://www.instagram.com/answer_skincare/"><i className="bi bi-instagram"></i></a>
              </li>
              <li className="ms-3">
                <a href="https://line.me/R/ti/p/%40vwp1840p"><i className="bi bi-line"></i></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </>)
}