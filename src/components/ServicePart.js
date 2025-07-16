import { motion } from "framer-motion";

export default function ServicePart({ img, alt, name, description, suitableFor, onReserveClick }) {
  return (
    <div className="col-md-3 mb-4 py-1">
      <motion.div
        style={{ height: "100%" }}
        initial={{ y: 50, opacity: 0 }}         // 初始狀態：略下方 + 透明
        whileInView={{ y: 0, opacity: 1 }}      // 滑入時：上移到原位 + 顯示
        transition={{ duration: 0.8, ease: "easeOut" }} // 動畫時間與節奏
        viewport={{ once: true }}>
        <div
          className="card h-100 border-0 bg-light hover-shadow cursor-pointer"
          onClick={onReserveClick}
          role="button"           // 🔍 無障礙：讓螢幕閱讀器知道它是可互動的
          tabIndex={0}            // 🔍 支援鍵盤聚焦
          onKeyDown={(e) => {
            if (e.key === "Enter") onReserveClick(); // 🔍 按下 Enter 可觸發
          }}
        >
          <div className="card-body h-100 d-flex flex-column justify-content-between">
            <img
              src={img}
              alt={alt}
              className="rounded-circle mx-auto mb-2"
              style={{ width: '90px', height: '90px', objectFit: 'cover', }} />
            <h5 className="card-title text-center mb-3 py-2 fw-bold">{name}</h5>
            <p className="card-text"> {description}</p>
            <p className="card-text"> 適用對象：{suitableFor}</p>
            <button className="btn btn-primary rounded-0 fw-bold text-white" >LINE 預約諮詢</button>
          </div>
        </div>
      </motion.div>
    </div>)
}
