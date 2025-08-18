import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { useState, useEffect } from "react";
import axios from "axios";
import CarouselPart from "../../components/CarouselPart";
import { Carousel } from 'bootstrap';
import { motion } from "framer-motion";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form"; // ⬅️ 訂閱區塊用

const authorItem = [//authorItem 是一個 不會變動的靜態資料（常數）。每次 Home 元件重新 render，它就會重新建立一次 authorItem 陣列，這是 沒必要的浪費資源。所以可以移到元件外面。
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

const categoryLogos = {
  "CREEKHEAL": "https://images.plurk.com/3qToDwfCJ5tKRJmdKVoxAd.png ",
  "CW": "https://images.plurk.com/3ePDBpCbbFGMCSZaXpaaj8.png ",
  "安若淨": "https://images.plurk.com/1veIPKryoFI4q7hdnsf805.png ",
  "TEOXANE": "https://images.plurk.com/3iFHQAPGHVDd6QiuR7GjPs.png ",
  "未分類": "https://dummyimage.com/240x240/eeeeee/444444&text=分類"
};

// 清理分類字串（去除多餘空白/換行）
const normalizeCategory = (s) => (s ?? "")
  .replace(/\s+/g, " ")
  .trim();

// 想固定顯示順序就用這個（找不到的放到後面）
const categoryOrder = ["CREEKHEAL", "CW", "安若淨", "TEOXANE"];
const sortByPreset = (arr, order) => {
  const index = new Map(order.map((k, i) => [k, i]));
  return [...arr].sort((a, b) => (index.has(a.name) ? index.get(a.name) : 999) - (index.has(b.name) ? index.get(b.name) : 999));
};
// 產品分類 Grid（從 products 自動彙總 category）
function CategoryGrid({ categories }) {
  return (
    <section className="container my-7">
      <h2 className="fw-bold mb-3">探索分類</h2>
      <div className="row g-3">
        {categories.map((c) => (
          <div key={c.name} className="col-6 col-md-3 text-center">
            <Link
              to={`/products?category=${encodeURIComponent(c.name)}`}
              className="text-decoration-none d-block category-pill"
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center bg-light mb-2"
                style={{
                  width: "120px",
                  height: "120px",
                  margin: "0 auto",
                  overflow: "hidden",
                  boxShadow: "0 0 0 1px rgba(0,0,0,.06)",
                  transition: "transform .15s ease"
                }}
              >
                {c.logoUrl ? (
                  <img
                    src={c.logoUrl}
                    alt={c.name}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span className="fw-bold">{c.name}</span>
                )}
              </div>
              <div className="d-flex flex-column align-items-center">
                <span className="fw-semibold text-dark">{c.name}</span>               
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}


// 訂閱電子報（頁面內 + 簡易驗證 + 蜜罐）
function NewsletterInline() {
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm({ mode: 'onTouched' });

  const onSubmit = async ({ email, hp }) => {
    if (hp) return; // 蜜罐（機器人常會填）
    // TODO: 呼叫你的訂閱 API（或表單服務，如 Mailchimp, Brevo, Klaviyo 等）
    await new Promise(r => setTimeout(r, 400)); // demo：模擬 API 延遲
  };
  return (
    <section className="bg-primary py-3 ">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h2 className="fw-bold mb-2 text-center text-md-start">訂閱最新消息與專屬優惠</h2>
            <p className="text-light text-center text-md-start mb-2 mb-md-0">收到ANSWER新品、活動與保養知識</p>
          </div>
          <div className="col-md-6">
            {isSubmitSuccessful ? (
              <p className="text-center">感謝訂閱！請到信箱點擊確認連結</p>
            ) : (
              <form className="row g-2 justify-content-center justify-content-md-start" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="col-9">
                  <input
                    type="email"
                    placeholder="Answer@email.com"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    aria-invalid={!!errors.email}
                    {...register('email', {
                      required: 'Email 為必填',
                      pattern: { value: /^\S+@\S+$/i, message: 'Email 格式不正確' },
                    })}
                  />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                </div>
                {/* 蜜罐（隱藏於視覺） */}
                <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <input tabIndex={-1} autoComplete="off" {...register('hp')} />
                </div>
                <div className="col-auto">
                  <button className="btn btn-dark w-100" disabled={isSubmitting} type="submit">訂閱</button>
                </div>
                <div className="col-12 text-center text-md-start">
                  <small className="text-muted">訂閱即代表同意 <a href="/privacy" className="text-muted">隱私權政策</a>。</small>
                </div>
              </form>
            )}
          </div>
        </div>



      </div>
    </section>
  );
}


export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const carouselEl = document.querySelector('#carouselExampleControls');
    if (carouselEl) {
      new Carousel(carouselEl, {
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
    setIsLoading(false);
  }

  useEffect(() => {
    getProducts(1)
  }, []);
  // 由 products 動態彙總分類（改為使用品牌 LOGO）
  let categories = Array.from(
    products.reduce((map, p) => {
      const raw = p.category || '未分類';
      const key = normalizeCategory(raw);
      if (!map.has(key)) {
        map.set(key, {
          name: key,
          count: 0,
          logoUrl: categoryLogos[key] || categoryLogos['未分類'],
        });
      }
      map.get(key).count += 1;
      return map;
    }, new Map()).values()
  );

  // 可選：依預設順序排列（CREEKHEAL → CW → 安若淨 → TEOXANE → 其他）
  categories = sortByPreset(categories, categoryOrder);




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
          <div className="d-grid d-md-block text-end">
            <button
              className="btn btn-outline-primary mt-3"
              onClick={() => setIsModalOpen(true)}
            >
              LINE 預約諮詢
            </button>
          </div>
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
        <h2 className="fw-bold pt-3 pb-2">醫師團隊</h2>
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

      {/* 2) 產品分類（新的） */}
      {categories.length > 0 && <CategoryGrid categories={categories} />}

      <h2 className="fw-bold pt-3 pb-2">熱門商品</h2>
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
    <div className="bg-light pt-7 pb-5">
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
    {/*訂閱電子報*/}
    <NewsletterInline />


    <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} backdrop="static" centered>
      <Modal.Header closeButton className="bg-primary">
        <Modal.Title className="text-white">LINE 預約諮詢</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p>掃描下方 QR Code 加入 LINE 好友，由專人為您服務</p>
        <img src="https://images.plurk.com/79bOdl5KL7nxzsyrLvan8N.jpg" alt="LINE QR Code" style={{ maxWidth: '100%' }} />
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center  border-0">
        <Button variant="primary" className="w-100" onClick={() => setIsModalOpen(false)}>
          已成為好友
        </Button>
      </Modal.Footer>
    </Modal>


  </>)
}