import { useContext, useEffect, useCallback, useMemo } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
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
import Navbar from "../Component/Common/Navbar/index.jsx";
import Footer from "../Component/Common/Footer/index.jsx";

// Route configuration constants
const ROUTE_CONFIG = {
  PUBLIC_ONLY: ["/login", "/registration", "/forgot"],
  PROTECTED: [
    /^\/productdescription\/.+/,
    "/wishlist",
    /^\/feedback\/.+/,
    "/refund",
    "/track",
    "/payment-success",
    "/payment-failed",
  ],
};

// Protected route wrapper component
const ProtectedRoute = ({ children, isAuthenticated, from }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from }} replace />;
  }
  return children;
};

// Public only route wrapper component
const PublicOnlyRoute = ({ children, isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AuthRoutesContent = () => {
  const { userLogin, setUserLogin, showLoader, setShowLoader } =
    useContext(CartContext);
  const location = useLocation();

  // Memoized authentication status
  const isAuthenticated = useMemo(() => Boolean(userLogin), [userLogin]);

  // Initialize app data and authentication
  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      setShowLoader(true);
      try {
        // Fetch products and check authentication in parallel
        await GetAllProductsAPI();

        if (isMounted) {
          const token = getItem("token");
          setUserLogin(token || null);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        // Optionally show error toast
      } finally {
        if (isMounted) {
          setShowLoader(false);
        }
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, [setUserLogin, setShowLoader]);

  // Check if current route is protected
  const isProtectedRoute = useCallback((pathname) => {
    return ROUTE_CONFIG.PROTECTED.some((pattern) =>
      pattern instanceof RegExp ? pattern.test(pathname) : pattern === pathname
    );
  }, []);

  // Check if current route is public only
  const isPublicOnlyRoute = useCallback((pathname) => {
    return ROUTE_CONFIG.PUBLIC_ONLY.includes(pathname);
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <ScrollToTop />
      <Navbar />

      <Loader active={showLoader}>
        <Routes>
          {/* PUBLIC-ONLY ROUTES (Redirect to home if authenticated) */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute isAuthenticated={isAuthenticated}>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/registration"
            element={
              <PublicOnlyRoute isAuthenticated={isAuthenticated}>
                <Registration />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/forgot"
            element={
              <PublicOnlyRoute isAuthenticated={isAuthenticated}>
                <Forgot />
              </PublicOnlyRoute>
            }
          />

          {/* PUBLIC ROUTES (Accessible to all) */}
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

          {/* PROTECTED ROUTES (Require authentication) */}
          <Route
            path="/productdescription/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} from={location}>
                <ProductDescription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} from={location}>
                <WishList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} from={location}>
                <Feedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/refund"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} from={location}>
                <Refund />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} from={location}>
                <TrackOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-success"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} from={location}>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-failed"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} from={location}>
                <PaymentFailed />
              </ProtectedRoute>
            }
          />

          {/* 404 ERROR PAGE */}
          <Route path="*" element={<Error />} />
        </Routes>
      </Loader>

      <Footer />
    </>
  );
};

const AuthRoutes = () => <AuthRoutesContent />;

export default AuthRoutes;
