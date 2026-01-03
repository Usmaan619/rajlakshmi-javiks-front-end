import React, { useEffect } from "react";

// Home inside the common
// import About from "./about";
import ShopCategory from "./shopCategory";
import WhyChoose from "./whyChoose";

// Common
import Navbar from "../../Common/Navbar";

// Images
// import AboutImg from "../../Assets/img/About/about.png";
import Home1 from "../../Assets/img/Home/Banner_One.png";
import Home2 from "../../Assets/img/Home/Banner_Two.png";
import Home3 from "../../Assets/img/Home/Banner_Three.png";
import Home4 from "../../Assets/img/Home/Banner_Four.png";
// import Home5 from "../../Assets/img/Home/homeimg5.png";
// import Home6 from "../../Assets/img/Home/homeimg6.png";
import Imgeeres1 from "../../Assets/img/Home/Mobile_one.png";
import Imgeeres2 from "../../Assets/img/Home/Mobile_Two.png";
import Imgeeres3 from "../../Assets/img/Home/Mobile_three.png";
import Imgeeres4 from "../../Assets/img/Home/Mobile-four.png";

import OurProducts from "./ourProducts";
import ProudlyCertified from "./proudlyCertified";
import Footer from "../../Common/Footer";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Allproduct from "./allProduct";

const Home = () => {

  useEffect(() => {
    const carousel = document.querySelector("#carouselExampleControls");
    if (carousel) {
      new window.bootstrap.Carousel(carousel, {
        interval: 3000, // Adjust the interval if needed
        ride: "carousel",
      });
    }
  }, []);
  return (
    <React.Fragment>
      {/* Start Hero */}
      {/* <section>
        <div className="home bg-custom-gradient padding-bottom-60">
          <Navbar />

          <div className="container-fluid">
            <div className="row py-5 d-flex justify-content-center mx-lg-5 px-lg-3">
              <div className="col-lg-3 col-md-3 col-3 px-0 home-col1">
                <p className="home-para1 mb-0 josefin-sans-font-family-500">Organic Product</p>
                <div className="img1">
                  <img src={Home1} alt="Loading" />
                </div>
                <div className="img2">
                  <img src={Home2} alt="Loading" />
                </div>
              </div>
              <div className="col-lg-4 col-md-4 center-img px-0 col-4">
                <div className="img3">
                  <img src={Home3} alt="Loading" />
                </div>
              </div>
              <div className="col-lg-4 px-0 col-4">
                <div className="image45">
                  <div className="img4">
                    <img src={Home4} alt="Loading" />
                  </div>
                  <div className="img5">
                    <img src={Home5} alt="Loading" />
                  </div>
                </div>
                <div className="img6">
                  <p className="home-para2 josefin-sans-font-family-500">100% Vegeterian</p>
                  <img src={Home6} alt="Loading" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <div className="home">
        <Navbar />
        <div className="row">
          <div
            id="carouselExampleControls"
            className="carousel slide header-carousel"
            data-bs-ride="carousel"
            data-bs-interval="3000"
            data-bs-pause="hover" // Set this to false to avoid pausing
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <picture>
                  <source media="(max-width: 768px)" srcSet={Imgeeres1} />
                  <source media="(max-width: 1024px)" srcSet={Imgeeres1} />
                  <img src={Home1} className="d-block w-100" alt="Slide 1" />
                </picture>
              </div>
              <div className="carousel-item">
                <picture>
                  <source media="(max-width: 768px)" srcSet={Imgeeres2} />
                  <source media="(max-width: 1024px)" srcSet={Imgeeres2} />
                  <img src={Home2} className="d-block w-100" alt="Slide 1" />
                </picture>
              </div>
              <div className="carousel-item">
                <picture>
                  <source media="(max-width: 768px)" srcSet={Imgeeres3} />
                  <source media="(max-width: 1024px)" srcSet={Imgeeres3} />
                  <img src={Home3} className="d-block w-100" alt="Slide 1" />
                </picture>
              </div>
              <div className="carousel-item">
                <picture>
                  <source media="(max-width: 768px)" srcSet={Imgeeres4} />
                  <source media="(max-width: 1024px)" srcSet={Imgeeres4} />
                  <img src={Home4} className="d-block w-100" alt="Slide 1" />
                </picture>
              </div>
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
              {/* <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              >
              </span> */}
              <IoIosArrowBack className="text-dark fs-1" />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
              {/* <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span> */}
              <IoIosArrowForward className="text-dark fs-1" />
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>

      {/* End Hero */}

      <Allproduct/>

      {/* Start About */}
      {/* <About img={AboutImg} /> */}
      {/* End About */}

      {/*Start Shop By Category Card */}
      <ShopCategory />
      {/*End Shop By Category Card */}

      {/* Start Why Choose Us  */}
      <WhyChoose />
      {/* End Why Choose Us  */}

      {/*Start Explore Our Products */}
      <OurProducts />
      {/*End Explore Our Products */}

      {/* Start Proudly certified */}

      <ProudlyCertified />

      {/* End Proudly certified */}

      {/* Start Footer  */}
      <Footer/>
      {/* Start End */}
    </React.Fragment>
  );
};

export default Home;
