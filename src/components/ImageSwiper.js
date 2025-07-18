import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';

export default function ImageSwiper({ images = [] }) {
  return (
    <Swiper
      modules={[Pagination]}
      slidesPerView={1}
      pagination={{ clickable: true }}
      grabCursor={true}
      spaceBetween={10}
      style={{ width: '100%', height: '100%' }}
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
