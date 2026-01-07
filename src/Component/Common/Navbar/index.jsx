import { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../../Assets/img/Logo/RAJLAXMI-JAVIK-PNG.png";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { FaBarsStaggered } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { NavLink, useLocation } from "react-router-dom";
import AddToCartProccess from "../AddToCartProccess/AddToCartProccess";
import { CartContext } from "../../Context/UserContext";
import { clearCache } from "../../../services/storage.service";
import "./navbar.css";

const DataNavbar = [
  { title: "Home", url: "/" },
  { title: "About", url: "/about" },
  { title: "Products", url: "/products" },
  { title: "Wishlist", url: "/wishlist" },
  { title: "Track", url: "/track" },
  { title: "Contact Us", url: "/contact" },
];

const Navbar = () => {
  const { cartCount, setCartCount, setUserLogin } = useContext(CartContext);
  const uid = sessionStorage.getItem("uid");
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const updateCartCount = () => {
    const storedCart = JSON.parse(sessionStorage.getItem(`cart_${uid}`)) || {};
    let total = 0;

    Object.values(storedCart).forEach((product) => {
      Object.values(product).forEach((w) => {
        total += w.quantity;
      });
    });

    setCartCount(total);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, [uid]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={`navbar navbar-expand-lg navbar-background ${
          scrolled ? "scrolled" : ""
        }`}
      >
        <div className="container-fluid px-3 px-lg-4">
          {/* Logo - Left Side */}
          <a className="navbar-brand" href="/">
            <img src={Logo} alt="logo" className="navbar-logo" />
          </a>

          {/* Mobile Icons - Right Side */}
          <div className="d-flex d-lg-none align-items-center gap-2">
            <button className="cart-btn mobile-cart" onClick={handleShow}>
              <PiShoppingCartSimpleFill className="cart-icon" size={22} />
              {cartCount > 0 && (
                <span className="cart-quantity">{cartCount}</span>
              )}
            </button>

            <button className="navbar-toggler" onClick={() => setIsOpen(true)}>
              <FaBarsStaggered size={22} />
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="collapse navbar-collapse d-none d-lg-flex">
            <ul className="navbar-nav ms-auto gap-3 gap-xl-4">
              {DataNavbar.map((item, i) => (
                <li key={i} className="nav-item">
                  <NavLink className="nav-link" to={item.url}>
                    {item.title}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="d-flex align-items-center gap-3 ms-4">
              {uid ? (
                <button
                  className="login-btn"
                  onClick={() => {
                    clearCache();
                    setUserLogin(null);
                  }}
                >
                  Logout
                </button>
              ) : (
                <NavLink to="/login">
                  <button className="login-btn">Login</button>
                </NavLink>
              )}

              <button className="cart-btn desktop-cart" onClick={handleShow}>
                <PiShoppingCartSimpleFill className="cart-icon" size={24} />
                {cartCount > 0 && (
                  <span className="cart-quantity">{cartCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE LEFT SIDEBAR ================= */}
      <div
        className={`mobile-sidebar ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
      >
        <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
          <div className="sidebar-header">
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <RxCross2 size={26} />
            </button>
            <img src={Logo} alt="logo" className="sidebar-logo" />
          </div>

          <ul className="sidebar-menu">
            {DataNavbar.map((item, i) => (
              <li key={i} className="sidebar-menu-item">
                <NavLink
                  to={item.url}
                  className="sidebar-link"
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="sidebar-footer">
            {uid ? (
              <button
                className="login-btn w-100"
                onClick={() => {
                  clearCache();
                  setUserLogin(null);
                  setIsOpen(false);
                }}
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-100"
              >
                <button className="login-btn w-100">Login</button>
              </NavLink>
            )}
          </div>
        </div>
      </div>

      <AddToCartProccess showModal={showModal} handleClose={handleClose} />
    </>
  );
};

export default Navbar;

// import { useState, useEffect, useContext } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Logo from "../../Assets/img/Logo/RAJLAXMI JAVIK PNG.png";
// import { PiShoppingCartSimpleFill } from "react-icons/pi";
// import { RiSearch2Line } from "react-icons/ri";
// import { FaBarsStaggered } from "react-icons/fa6";
// import { RxCross2 } from "react-icons/rx";
// import { NavLink, useLocation } from "react-router-dom";
// import AddToCartProccess from "../AddToCartProccess/AddToCartProccess";
// import AutoSuggestSearch from "../AutoSuggestSearchBar/AutoSuggestSearchBar";
// import { CartContext } from "../../Context/UserContext";

// import { clearCache } from "../../../services/storage.service";

// const DataNavbar = [
//   {
//     title: "Home",
//     url: "/",
//   },
//   {
//     title: "About",
//     url: "/about",
//   },
//   {
//     title: "Products",
//     url: "/products",
//   },
//   {
//     title: "Wishlist",
//     url: "/wishlist",
//   },
//   {
//     title: "Track",
//     url: "/track",
//   },
//   {
//     title: "Contact Us",
//     url: "/contact",
//   },
// ];

// const Navbar = () => {
//   // const [cartCount, setCartCount] = useState(0);
//   const { cartCount, setCartCount } = useContext(CartContext);
//   const uid = sessionStorage.getItem("uid");
//   const location = useLocation();

//   const [scrolled, setScrolled] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [autoSearchFillValue, setautoSearchFillValue] = useState();
//   const [inputBar, setInputBar] = useState(false);
//   const { setUserLogin } = useContext(CartContext);
//   // Functions

//   const handleShow = () => setShowModal(true);
//   const handleClose = () => setShowModal(false);

//   const HandleAutoSearchInp = (e) => {
//     setautoSearchFillValue(e.target.value);
//   };

//   const handleOpenSearchBar = () => {
//     return setInputBar(true);
//   };
//   const handleCloseSearchBar = () => {
//     setInputBar(false);
//   };

//   const mobNav = window?.screen?.width;

//   // useEffect

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (event?.target?.closest(".automodal")) {
//         return true;
//       }
//       if (!event?.target?.closest(".autosuggest-nav")) {
//         handleCloseSearchBar();
//         setautoSearchFillValue();
//       }
//     };
//     if (inputBar) {
//       document?.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document?.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [inputBar]);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 100);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   const updateCartCount = () => {
//     const storedCart = JSON.parse(sessionStorage.getItem(`cart_${uid}`)) || {};
//     let totalItems = 0;

//     Object.values(storedCart).forEach((product) => {
//       Object.values(product).forEach((weight) => {
//         totalItems += weight.quantity;
//       });
//     });

//     setCartCount(totalItems);
//   };

//   useEffect(() => {
//     updateCartCount(); // Initial load

//     // 🔥 Listen for the "cartUpdated" event
//     window.addEventListener("cartUpdated", updateCartCount);

//     return () => {
//       window.removeEventListener("cartUpdated", updateCartCount);
//     };
//   }, [uid]);

//   // ==================
//   // to prevent background scrolling
//   // ==================
//   useEffect(() => {
//     if (inputBar) {
//       document.body.classList.add("position-fixed");
//     } else {
//       document.body.classList.remove("position-fixed");
//     }
//     return () => {
//       document.body.classList.remove("position-fixed");
//     };
//   }, [inputBar]);

//   return (
//     <>
//       <nav
//         className={`navbar navbar-expand-lg navbar-background ${
//           scrolled ? "scrolled" : ""
//         }`}
//       >
//         <div className="container">
//           <a className="navbar-brand d-lg-block d-none" href="/">
//             <img
//               src={Logo}
//               alt="Logo"
//               style={{ height: "42px", width: "44px" }}
//             />
//           </a>

//           {/* Toggle Button */}
//           <button
//             className="navbar-toggler"
//             type="button"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             {/* <span className="navbar-toggler-icon"></span> */}
//             {!isOpen ? <FaBarsStaggered /> : <RxCross2 />}
//           </button>

//           {/* Navbar Menu */}
//           <div
//             className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
//             id="navbarNav"
//           >
//             <ul
//               className={`navbar-nav nav-section ms-auto mb-2 mb-lg-0 ${
//                 mobNav < 992
//                   ? "d-flex justify-content-center align-items-center text-center gap-0"
//                   : "gap-4"
//               }`}
//             >
//               {DataNavbar.map((link, i) => (
//                 <li
//                   className={`nav-item py-0 inter-font-family ${
//                     inputBar ? "d-none" : ""
//                   }`}
//                   key={i}
//                 >
//                   <NavLink
//                     className={({ isActive }) =>
//                       `nav-link py-0 nav-text text-center ${
//                         isActive ? "active" : ""
//                       }`
//                     }
//                     to={link.url}
//                   >
//                     {link.title}
//                   </NavLink>
//                 </li>
//               ))}
//             </ul>
//             <div
//               className={`d-flex nav-section align-items-center gap-4 ${
//                 mobNav < 992
//                   ? "d-flex justify-content-center align-items-center gap-0"
//                   : ""
//               }`}
//             >
//               {uid ? (
//                 <NavLink to={"/"}>
//                   <button
//                     className={`login-btn rounded-pill mx-3 inter-font-family-500 ${
//                       inputBar ? "d-none" : ""
//                     }`}
//                     type="button"
//                     onClick={() => {
//                       clearCache();
//                       setUserLogin(null);
//                     }}
//                   >
//                     Log Out
//                   </button>
//                 </NavLink>
//               ) : (
//                 <NavLink to={"/login"}>
//                   <button
//                     className={`login-btn rounded-pill mx-3 inter-font-family-500 ${
//                       inputBar ? "d-none" : ""
//                     }`}
//                     type="button"
//                   >
//                     Login
//                   </button>
//                 </NavLink>
//               )}

//               {/* -------- nav search section ---------- */}
//               <div
//                 onClick={() => handleOpenSearchBar()} // Set focus on click
//                 className={`d-flex align-items-center  autosuggest-nav background-color-gleeful  p-2 ${
//                   inputBar
//                     ? "autosuggest-nav-active rounded-3"
//                     : "rounded-circle justify-content-center"
//                 } ${mobNav < 992 ? "d-none" : ""}`}
//               >
//                 <RiSearch2Line
//                   className={`nav-search-icon autosuggest-icon ${
//                     inputBar ? "me-3 ms-2" : ""
//                   }`}
//                 />
//                 {inputBar ? (
//                   <>
//                     <div className="autosuggest-input w-100">
//                       <input
//                         type="text"
//                         placeholder="Search for Oil, Ghee and other products  "
//                         onChange={HandleAutoSearchInp}
//                         className={`  h-100  ${autoSearchFillValue ? "" : ""}`}
//                       />
//                     </div>
//                   </>
//                 ) : null}
//               </div>
//               {/* ----------------- */}

//               <button
//                 onClick={() => handleShow()}
//                 className={`cart-btn rounded-circle border-0 px-2 ${
//                   mobNav < 992 ? "d-none" : ""
//                 }`}
//               >
//                 <PiShoppingCartSimpleFill className="mt-2 cart-icon" />
//                 <span className="cart-quantity translate-middle rounded-pill">
//                   {cartCount}
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>
//       {/* -------- nav search on mobile screen section ---------- */}
//       <div className="d-flex justify-content-around">
//         <div
//           onClick={() => handleOpenSearchBar()} // Set focus on click
//           className={`d-flex align-items-center autosuggest-nav-active rounded-5 bg-white  p-2 ${
//             inputBar ? "autosuggest-nav-active rounded-3" : ""
//           } ${mobNav < 992 ? "" : "d-none"}`}
//         >
//           <RiSearch2Line
//             className={`nav-search-icon autosuggest-icon bg-white ${
//               inputBar ? "me-3 ms-2" : "me-3 ms-2"
//             }`}
//           />
//           {/* {inputBar ? ( */}
//           <>
//             <div className="autosuggest-input w-100">
//               <input
//                 type="text"
//                 placeholder="Search for Oil, Ghee and other products  "
//                 onChange={HandleAutoSearchInp}
//                 className={`  h-100  ${autoSearchFillValue ? "" : ""}`}
//               />
//             </div>
//           </>
//           {/* // ) : null} */}
//         </div>
//         <button
//           onClick={() => handleShow()}
//           className={`cart-btn rounded-circle border-0 px-2 bg-white ${
//             mobNav < 992 ? "" : "d-none"
//           }`}
//         >
//           <PiShoppingCartSimpleFill className="mt-2 cart-icon" />
//           <span className="cart-quantity translate-middle rounded-pill">
//             {cartCount}
//           </span>
//         </button>
//       </div>
//       {/* ----------------- */}
//       {inputBar && (
//         <AutoSuggestSearch
//           modalClass={"automodal"}
//           inputValue={autoSearchFillValue}
//           handleClose={handleCloseSearchBar}
//         />
//       )}
//       <AddToCartProccess showModal={showModal} handleClose={handleClose} />
//     </>
//   );
// };

// export default Navbar;

// import { useState, useEffect, useContext } from "react";
// import { Link, NavLink } from "react-router-dom";
// import { PiShoppingCartSimpleFill } from "react-icons/pi";
// import { RiSearch2Line } from "react-icons/ri";

// import AddToCartProccess from "../AddToCartProccess/AddToCartProccess";
// import { CartContext } from "../../Context/UserContext";
// import { clearCache } from "../../../services/storage.service";

// import "./navbar.css";

// const navLinks = [
//   { title: "Home", url: "/" },
//   { title: "About", url: "/about" },
//   { title: "Products", url: "/products" },
//   { title: "Wishlist", url: "/wishlist" },
//   { title: "Track", url: "/track" },
//   { title: "Contact Us", url: "/contact" },
// ];

// export default function Navbar() {
//   const { cartCount, setCartCount, setUserLogin } = useContext(CartContext);

//   const uid = sessionStorage.getItem("uid");

//   const [isOpen, setIsOpen] = useState(false);
//   const [showCartModal, setShowCartModal] = useState(false);

//   /* =========================
//      CART COUNT LOGIC (OLD)
//   ========================= */
//   const updateCartCount = () => {
//     if (!uid) {
//       setCartCount(0);
//       return;
//     }

//     const storedCart = JSON.parse(sessionStorage.getItem(`cart_${uid}`)) || {};

//     let total = 0;
//     Object.values(storedCart).forEach((product) => {
//       Object.values(product).forEach((weight) => {
//         total += weight.quantity;
//       });
//     });

//     setCartCount(total);
//   };

//   useEffect(() => {
//     updateCartCount();
//     window.addEventListener("cartUpdated", updateCartCount);
//     return () => {
//       window.removeEventListener("cartUpdated", updateCartCount);
//     };
//   }, [uid]);

//   /* ========================= */

//   return (
//     <>
//       {/* ================= NAVBAR ================= */}
//       <nav className="navbar-container">
//         {/* Logo */}
//         <Link to="/" className="logo">
//           <img src={logo} alt="Logo" className="logo-img" />
//         </Link>

//         {/* Desktop Nav */}
//         <div className="desktop-nav">
//           {navLinks.map((link) => (
//             <NavLink
//               key={link.url}
//               to={link.url}
//               className={({ isActive }) =>
//                 `nav-link ${isActive ? "active" : ""}`
//               }
//             >
//               {link.title}
//             </NavLink>
//           ))}
//         </div>

//         {/* Actions */}
//         <div className="nav-actions">
//           <button className="icon-btn">
//             <RiSearch2Line size={20} />
//           </button>

//           {/* CART BUTTON */}
//           <button className="icon-btn" onClick={() => setShowCartModal(true)}>
//             <PiShoppingCartSimpleFill size={22} />
//             {cartCount > 0 && (
//               <span className="cart-quantity">{cartCount}</span>
//             )}
//           </button>

//           {/* LOGIN / LOGOUT */}
//           {uid ? (
//             <button
//               className="login-btn"
//               onClick={() => {
//                 clearCache();
//                 setUserLogin(null);
//                 setCartCount(0);
//               }}
//             >
//               Logout
//             </button>
//           ) : (
//             <Link to="/login">
//               <button className="login-btn">Login</button>
//             </Link>
//           )}
//         </div>

//         {/* Hamburger */}
//         <div
//           className={`hamburger ${isOpen ? "open" : ""}`}
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           <span></span>
//           <span></span>
//           <span></span>
//         </div>
//       </nav>

//       {/* ================= MOBILE MENU ================= */}
//       <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
//         {navLinks.map((link) => (
//           <NavLink
//             key={link.url}
//             to={link.url}
//             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
//             onClick={() => setIsOpen(false)}
//           >
//             {link.title}
//           </NavLink>
//         ))}

//         {uid ? (
//           <button
//             className="login-btn"
//             onClick={() => {
//               clearCache();
//               setUserLogin(null);
//               setCartCount(0);
//               setIsOpen(false);
//             }}
//           >
//             Logout
//           </button>
//         ) : (
//           <Link to="/login">
//             <button className="login-btn">Login</button>
//           </Link>
//         )}
//       </div>

//       {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}

//       {/* ================= CART MODAL ================= */}
//       <AddToCartProccess
//         showModal={showCartModal}
//         handleClose={() => setShowCartModal(false)}
//       />
//     </>
//   );
// }
