"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import car1 from "../../assets/1.jpg";
import car2 from "../../assets/2.jpg";
import car3 from "../../assets/3.jpg";
import car4 from "../../assets/4.jpg";
import car5 from "../../assets/5.jpg";
import car6 from "../../assets/6.jpg";
import car7 from "../../assets/7.jpg";
import car8 from "../../assets/8.jpg";
import { motion } from "framer-motion";
export default function HomeCarousel() {
  const cars = [
    { src: car1, alt: "Mustang" },
    { src: car2, alt: "Batman Car" },
    { src: car3, alt: "BMW 320I" },
    { src: car4, alt: "Porsche" },
    { src: car5, alt: "Challenger" },
    { src: car6, alt: "BMW 520D" },
    { src: car7, alt: "BMW 220E" },
    { src: car8, alt: "Mercedes CLS63" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-[350px]"
    >
      {" "}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full rounded-2xl shadow-xl overflow-hidden"
      >
        {cars.map((car, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-[350px]">
              <Image
                src={car.src}
                alt={car.alt}
                fill
                sizes="(max-width: 640px) 100vw, 
         (max-width: 1024px) 50vw, 
         33vw"
                className="object-cover"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-black/30" />
              {/* text on top */}
              <div className="absolute bottom-6 left-6 text-white text-2xl font-bold drop-shadow-lg">
                {car.alt}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Custom styles using normal css  */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white !important;
          font-weight: bold;
        }
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.6;
        }
        .swiper-pagination-bullet-active {
          background: white !important;
          opacity: 1;
        }
      `}</style>
    </motion.div>
  );
}
