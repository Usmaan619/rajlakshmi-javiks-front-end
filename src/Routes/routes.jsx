import { useContext, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "../Component/Common/Scroll-to-Top/index.jsx";
import Login from "../Component/Common/Auth/Login/index.jsx";
import Registration from "../Component/Common/Auth/Registration";
import Home from "../Component/Pages/Home";
import Product from "../Component/Pages/Products/index.jsx";
import About from "../Component/Pages/Home/about.jsx";
import ProductInner from "../Component/Pages/Products/productinner.jsx";
import ProductDescription from "../Component/Pages/ProductDescription/productdescription.jsx";
import WishList from "../Component/Pages/Wishlist/wishlist.jsx";
import Feedback from "../Component/Pages/Feedback/feedback.jsx";
import ContactUs from "../Component/Pages/ContactUs/contactUs.jsx";
import Refund from "../Component/Pages/Refund/Refund.jsx";
import PrivacyPolicy from "../Component/Pages/PrivacyPolicy/PrivacyPolicy.jsx";
import ShippingPolicy from "../Component/Pages/ShippingPolicy/ShippingPolicy.jsx";
import TermsAndConditionsPolicy from "../Component/Pages/TermsAndConditionsPolicy/TermsAndConditions.jsx";
import Forgot from "../Component/Common/Auth/ForgotPass/forgot.jsx";
import Error from "../Component/Pages/Error/error.jsx";
import TrackOrder from "../Component/Pages/TrackOrder/trackorder.jsx";
import Faq from "../Component/Pages/Faq/faq.jsx";
import PaymentSuccess from "../Component/Pages/PaymentSuccess/paymentSuccess.jsx";
import PaymentFailed from "../Component/Pages/PaymentFailed/paymentFailed.jsx";
import { GetAllProductsAPI } from "../Component/Assets/Json/AllProducts.jsx";
import AboutImg from "../Component/Assets/img/About/aboutnew.png";
import { getItem } from "../services/storage.service.js";
import { CartContext } from "../Component/Context/UserContext.jsx";
import Loader from "../Component/Pages/Loader/loader.jsx";

const AuthRoutes = () => {
  const { userLogin, setUserLogin, showLoader, setShowLoader } =
    useContext(CartContext);

  useEffect(() => {
    const init = async () => {
      setShowLoader(true);
      try {
        await GetAllProductsAPI();
        const token = getItem("token");
        setUserLogin(token ?? null);
      } catch (err) {
        console.error("Error in init:", err);
      } finally {
        setShowLoader(false);
      }
    };
    init();
  }, [setUserLogin, setShowLoader]);

  const isAuthenticated = Boolean(userLogin);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <ScrollToTop />

      <Loader active={showLoader}>
        <Routes>
          {/* Public-only routes (redirect to home if already logged in) */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/registration"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Registration />
              )
            }
          />
          <Route
            path="/forgot"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Forgot />}
          />

          {/* Public routes (accessible to everyone) */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/products-inner" element={<ProductInner />} />
          <Route path="/about" element={<About img={AboutImg} />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditionsPolicy />}
          />
          <Route path="/faq" element={<Faq />} />

          {/* Protected routes (only when logged in) */}
          <Route
            path="/productdescription/:id"
            element={
              isAuthenticated ? (
                <ProductDescription />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/wishlist"
            element={
              isAuthenticated ? <WishList /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/feedback/:id"
            element={
              isAuthenticated ? <Feedback /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/refund"
            element={
              isAuthenticated ? <Refund /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/track"
            element={
              isAuthenticated ? (
                <TrackOrder />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/payment-success"
            element={
              isAuthenticated ? (
                <PaymentSuccess />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/payment-failed"
            element={
              isAuthenticated ? (
                <PaymentFailed />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 404 */}
          <Route path="*" element={<Error />} />
        </Routes>
      </Loader>
    </>
  );
};

export default AuthRoutes;
