"use client";

import { useId } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function CaseStudySlider({ images }) {
  const paginationId = useId().replace(/:/g, "");

  return (
    <section className="flex flex-col gap-6">
      <div className="w-full rounded-[8px] bg-[#ededed] px-10 pb-10 pt-10">
        <Swiper
          slidesPerView={"auto"}
          centeredSlides={true}
          spaceBetween={20}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: `.case-study-pagination-${paginationId}`,
          }}
          className="case-study-swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={`${image.src}-${index}`}>
              <div className="flex h-[800px] w-full items-end justify-center overflow-hidden rounded-[8px]">
                <img
                  alt={image.alt}
                  className="h-full w-auto max-w-full object-contain"
                  src={image.src}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mt-10 flex justify-center">
          <div className={`case-study-pagination case-study-pagination-${paginationId}`} />
        </div>
      </div>
      <style jsx global>{`
        .case-study-swiper .swiper-slide {
          width: calc(100% - 160px);
          box-sizing: border-box;
        }
        .case-study-pagination {
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: center;
        }
        .case-study-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #bfbfbf;
          opacity: 1;
          transition:
            background 150ms ease-in-out,
            transform 150ms ease-in-out;
        }
        .case-study-pagination .swiper-pagination-bullet-active {
          background: #484848;
          transform: scale(1.15);
        }
      `}</style>
    </section>
  );
}
