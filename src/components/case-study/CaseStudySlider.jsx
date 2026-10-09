"use client";

import { useId } from "react";
import { A11y, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ZoomableImage from "./ZoomableImage";

/**
 * Props:
 *  - images:  [{ src, alt }]
 *  - caption: optional text under the slider: what the screens show, and whose work they are
 */
export default function CaseStudySlider({ images, caption }) {
  const paginationId = useId().replace(/:/g, "");

  return (
    <section className="flex flex-col gap-6">
      <div className="w-full rounded-[8px] bg-[#e2e6e7] p-5 md:p-10">
        <Swiper
          slidesPerView={"auto"}
          centeredSlides={true}
          spaceBetween={20}
          slideToClickedSlide={true}
          watchSlidesProgress={true}
          // No autoplay: dense product screens need as long as the reader wants, so
          // slides only move when they click, swipe, tab to a dot or use the arrow keys.
          modules={[A11y, Keyboard, Pagination]}
          keyboard={{ enabled: true, onlyInViewport: true }}
          a11y={{ paginationBulletMessage: "Show screen {{index}}" }}
          pagination={{
            clickable: true,
            el: `.case-study-pagination-${paginationId}`,
          }}
          className="case-study-swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={`${image.src}-${index}`}>
              {/* Only the slide in front opens full size; clicking a side slide still
                  just brings it forward. */}
              {({ isActive }) => (
                <div className="flex h-[auto] w-full items-end justify-center overflow-hidden rounded-[8px]">
                  {isActive ? (
                    <ZoomableImage
                      src={image.src}
                      alt={image.alt}
                      linkClassName="max-w-full"
                      className="h-full w-auto max-w-full object-contain rounded-[8px]"
                    />
                  ) : (
                    <img
                      alt={image.alt}
                      className="h-full w-auto max-w-full object-contain rounded-[8px]"
                      src={image.src}
                    />
                  )}
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mt-10 flex justify-center">
          <div className={`case-study-pagination case-study-pagination-${paginationId}`} />
        </div>
        {caption && (
          <p className="mt-6 text-[13px] font-medium leading-[1.5] text-[#636363]">{caption}</p>
        )}
      </div>
      <style jsx global>{`
        .case-study-swiper .swiper-slide {
          @media (min-width: 768px) {
            width: calc(100% - 160px);
          }
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
