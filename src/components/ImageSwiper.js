import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation'; 

import { Pagination, Navigation  } from 'swiper/modules';

export default function ImageSwiper({ images = [] }) {
  return (
    <Swiper
      modules={[Pagination, Navigation]}
      slidesPerView={1}
      pagination={{ clickable: true }}
      grabCursor={true}
      spaceBetween={10}
      style={{ width: '100%', height: '100%' }}
       // 左右箭頭（用 breakpoints 讓手機關閉、桌面開啟）
      navigation={{ enabled: true }}
      breakpoints={{
        0: {
          navigation: { enabled: false }, // 手機隱藏箭頭
        },
        768: {
          navigation: { enabled: true },  // ≥768px 顯示箭頭
        },
      }}
    >
      {images.map((img, i) => (
        <SwiperSlide key={i}>
          <img
            src={img}
            alt={`image-${i}`}
            className="w-100"
            style={{
              objectFit: 'contain',
              maxHeight: '500px',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
