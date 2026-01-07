import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Home1 from "../../Assets/img/Home/Banner_One.png";
// Home inside the common
import ShopCategory from "./shopCategory";
import WhyChoose from "./whyChoose";
// Home components
import OurProducts from "./ourProducts";
import ProudlyCertified from "./proudlyCertified";
import Allproduct from "./allProduct";
import { getData } from "../../../services/apiService";
import { Bounce, toast } from "react-toastify";

// Services

const FALLBACK_BANNERS = [Home1];

const Home = () => {
  const [bannerUrls, setBannerUrls] = useState(FALLBACK_BANNERS);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH BANNERS (OPTIMIZED)
  ========================= */
  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getData("/home-banners-rajlaxmi");

      if (!res || typeof res !== "object") {
        throw new Error("Invalid banner response");
      }

      //  Direct array - NO object reference issues
      const urls = [];
      if (res?.banner1) urls.push(res.banner1);
      if (res?.banner2) urls.push(res.banner2);
      if (res?.banner3) urls.push(res.banner3);
      if (res?.banner4) urls.push(res.banner4);

      setBannerUrls(urls.length > 0 ? urls : FALLBACK_BANNERS);
    } catch (error) {
      console.error("Failed to fetch banners:", error);

      toast.error("Failed to load banners", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setBannerUrls(FALLBACK_BANNERS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  /* =========================
     SLIDES (STABLE)
  ========================= */
  const slides = useMemo(
    () =>
      bannerUrls.map((url, index) => ({
        desktop: url,
        mobile: url,
        alt: `Banner ${index + 1}`,
      })),
    [bannerUrls]
  );

  const hasSlides = slides.length > 0;

  /* =========================
     CUSTOM ARROWS (STABLE)
  ========================= */
  const renderPrevArrow = useCallback(
    (onClickHandler, hasPrev, label) =>
      hasPrev && (
        <button
          type="button"
          onClick={onClickHandler}
          title={label}
          className="custom-arrow prev-arrow"
          aria-label="Previous slide"
        >
          <BsChevronLeft />
        </button>
      ),
    []
  );

  const renderNextArrow = useCallback(
    (onClickHandler, hasNext, label) =>
      hasNext && (
        <button
          type="button"
          onClick={onClickHandler}
          title={label}
          className="custom-arrow next-arrow"
          aria-label="Next slide"
        >
          <BsChevronRight />
        </button>
      ),
    []
  );

  /* =========================
     CAROUSEL CONFIG (STABLE)
  ========================= */
  const carouselProps = useMemo(
    () => ({
      showArrows: false,
      showStatus: false,
      showThumbs: false,
      infiniteLoop: true,
      autoPlay: true,
      interval: 6500,
      transitionTime: 800,
      animationHandler: "fade",
      swipeable: false,
      emulateTouch: false,
      stopOnHover: false,
      renderArrowPrev: renderPrevArrow,
      renderArrowNext: renderNextArrow,
      className: "main-carousel fade-carousel",
    }),
    [renderPrevArrow, renderNextArrow]
  );

  /* =========================
     SKELETON LOADING
  ========================= */
  if (loading || !hasSlides) {
    return (
      <React.Fragment>
        <div className="home">
          <style jsx>{`
            @keyframes shimmer {
              0% {
                background-position: 100% 0;
              }
              100% {
                background-position: -100% 0;
              }
            }
            .shimmer-bg {
              background: linear-gradient(
                90deg,
                #eeeeee 25%,
                #f5f5f5 37%,
                #eeeeee 63%
              );
              background-size: 400% 100%;
              animation: shimmer 1.4s infinite;
              height: 400px;
              border-radius: 8px;
            }
          `}</style>
          <div className="row">
            <div className="shimmer-bg w-100" style={{ height: "400px" }} />
          </div>
        </div>
        <Allproduct />
        <ShopCategory />
        <WhyChoose />
        <OurProducts />
        <ProudlyCertified />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="home">
        <div className="row">
          <div className="carousel-container">
            <Carousel {...carouselProps}>
              {slides.map((item, index) => (
                <div key={item.alt} className="carousel-slide">
                  <picture>
                    <source media="(max-width: 768px)" srcSet={item.mobile} />
                    <img
                      src={item.desktop}
                      alt={item.alt}
                      className="d-block w-100 carousel-full-image"
                      loading={index === 0 ? "eager" : "lazy"}
                      onError={(e) => {
                        e.currentTarget.src = Home1;
                      }}
                      decoding="async"
                    />
                  </picture>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>

      <Allproduct />
      <ShopCategory />
      <WhyChoose />
      <OurProducts />
      <ProudlyCertified />
    </React.Fragment>
  );
};

export default Home;
