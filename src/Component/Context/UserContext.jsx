import React, { createContext, useEffect, useState } from "react";
import { getData, postData, getWishListData } from "../../services/apiService";
import { Bounce, toast } from "react-toastify";
import { getItem } from "../../services/storage.service";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✅ ALL STATES PROPERLY INITIALIZED
  const [cartItems, setCartItems] = useState([]);
  const [WishListItems, setWishListItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLogin, setUserLogin] = useState(null);
  const [cartCount, setCartCount] = useState(0); // ✅ FIXED: Properly initialized
  const [showLoader, setShowLoader] = useState(false);
  const [getProductResponse, setGetProductResponse] = useState([]);

  const uid = getItem("uid");

  // ✅ CART FUNCTIONS
  const addToCart = (product, quantity = 1, weight) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.weight === weight
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.weight === weight
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, weight }];
    });
    setCartCount((prev) => prev + 1); // ✅ UPDATE COUNT
  };

  const removeFromCart = (productId, weight) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === productId && item.weight === weight))
    );
    setCartCount((prev) => Math.max(0, prev - 1)); // ✅ UPDATE COUNT
  };

  const updateQuantity = (productId, weight, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, weight);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId && item.weight === weight
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCartCount(0); // ✅ RESET COUNT
  };

  // ✅ WISHLIST FUNCTIONS
  const toggleWishlist = async (product) => {
    if (!uid) {
      toast.error("Please login first");
      return;
    }

    const payload = {
      uid,
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      product_quantity: 1,
      product_image: product.image,
    };

    try {
      const isInWishlist = WishListItems.some(
        (item) => item.product_id === product.id
      );

      if (isInWishlist) {
        await postData("removeWishlistItem", { uid, product_id: product.id });
        toast.success("Removed from wishlist");
      } else {
        await postData("addToWishlist", payload);
        toast.success("Added to wishlist");
      }

      // Refresh wishlist
      const response = await getWishListData();
      setWishListItems(response?.data || response?.wishlist || []);
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  // ✅ FETCH FUNCTIONS
  const fetchCart = async () => {
    if (!uid) return;
    try {
      setLoading(true);
      const response = await getData(`getAllCartById?uid=${uid}`);
      setCartItems(response?.cartItems || []);
      setCartCount(response?.cartItems?.length || 0); // ✅ UPDATE COUNT
      setGetProductResponse(response?.cartItems || []);
    } catch (error) {
      console.error("Fetch cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    if (!uid) return;
    try {
      const response = await getWishListData();
      setWishListItems(response?.data || response?.wishlist || []);
    } catch (error) {
      console.error("Fetch wishlist error:", error);
      setWishListItems([]);
    }
  };

  // ✅ INITIAL LOAD
  useEffect(() => {
    if (uid) {
      fetchCart();
      fetchWishlist();
    }
  }, [uid]);

  // ✅ FIXED: ALL SETTERS INCLUDED IN VALUE
  const value = {
    cartItems,
    setCartItems,
    WishListItems,
    setWishListItems,
    cartCount, // ✅ INCLUDED
    setCartCount, // ✅ INCLUDED - THIS WAS MISSING!
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    loading,
    uid,
    userLogin,
    setUserLogin,
    showLoader,
    setShowLoader,
    getProductResponse,
    setGetProductResponse,
    fetchCart,
    fetchWishlist,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// // import React, { createContext, useState } from "react";

// // // Create Context
// // export const CartContext = createContext();

// // // Provider Component
// // export const CartProvider = ({ children }) => {
// //   const [cartItems, setCartItems] = useState([]); // Cart state
// //   const [WishListItems, setWishListItems] = useState([]); // wishlist state

// //   // Add to Cart function
// //   const addToCart = (product, quantity, weight) => {
// //     setCartItems((prevCart) => {
// //       const existingItem = prevCart.find(
// //         (item) => item.id === product.id && item.weight === weight
// //       );

// //       if (existingItem) {
// //         return prevCart.map((item) =>
// //           item.id === product.id && item.weight === weight
// //             ? { ...item, quantity: item.quantity + quantity }
// //             : item
// //         );
// //       } else {
// //         return [...prevCart, { ...product, quantity, weight }];
// //       }
// //     });
// //   };

// //   // Remove from Cart function
// //   const removeFromCart = (productId, weight) => {
// //     setCartItems((prevCart) =>
// //       prevCart
// //         .map((item) =>
// //           item.id === productId && item.weight === weight
// //             ? { ...item, quantity: item.quantity - 1 }
// //             : item
// //         )
// //         .filter((item) => item.quantity > 0)
// //     );
// //   };

// //   // Add to WishList Functions
// //   const AddToWishList = (product) => {
// //     const isProductInWishList = WishListItems.some(item => item?.id === product?.id);
// //     if (!isProductInWishList) {
// //       setWishListItems([...WishListItems, product]);
// //     }
// //   };

// //   return (
// //     <CartContext.Provider
// //       value={{
// //         cartItems,
// //         WishListItems,
// //         addToCart,
// //         removeFromCart,
// //         AddToWishList,
// //       }}
// //     >
// //       {children}
// //     </CartContext.Provider>
// //   );
// // };

// import React, { createContext, useEffect, useState } from "react";
// import {
//   API_BASE_URL,
//   deleteData,
//   getData,
//   getWishListData,
//   postData,
// } from "../../services/apiService";
// import { Bounce, toast } from "react-toastify";
// import axios from "axios";

// // Create Context
// export const CartContext = createContext();

// // Provider Component
// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]); // Cart state
//   const [WishListItems, setWishListItems] = useState(); // Wishlist state
//   const [uid, setuid] = useState([]); // User Id
//   const getUid = sessionStorage.getItem("uid");

//   // Add to Cart function
//   const addToCart = (product, quantity, weight) => {
//     setCartItems((prevCart) => {
//       const existingItem = prevCart.find(
//         (item) => item.id === product.id && item.weight === weight
//       );

//       if (existingItem) {
//         return prevCart.map((item) =>
//           item.id === product.id && item.weight === weight
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       } else {
//         return [...prevCart, { ...product, quantity, weight }];
//       }
//     });
//   };

//   // Remove item from cart completely
//   const removeFromCart = (productId, weight) => {
//     setCartItems((prevCart) =>
//       prevCart.filter(
//         (item) => !(item.id === productId && item.weight === weight)
//       )
//     );
//   };

//   // Update quantity in cart
//   const updateQuantity = (productId, weight, newQuantity) => {
//     if (newQuantity <= 0) {
//       removeFromCart(productId, weight);
//     } else {
//       setCartItems((prevCart) =>
//         prevCart.map((item) =>
//           item.id === productId && item.weight === weight
//             ? { ...item, quantity: newQuantity }
//             : item
//         )
//       );
//     }
//   };

//   // Clear entire cart
//   const clearCart = () => {
//     setCartItems([]);
//   };

//   // Add to wishlist
//   const AddToWishList = async (product) => {
//     const payload = {
//       uid: getUid,
//       product_name: product?.name,
//       product_image: product?.image,
//       product_id: product?.id,
//       product_price: product?.price,
//       product_quantity: 1,
//     };
//     const isProductInWishList = WishListItems?.some(
//       (item) => Number(item?.product_id) === Number(product?.id)
//     );
//     try {
//       if (isProductInWishList) {
//         // Remove product from WishList
//         const updatedWishList = WishListItems.filter(
//           (item) => item?.id !== product?.id
//         );
//         const removePay = {
//           uid: getUid,
//           product_id: product?.id,
//         };

//         // Sending removePay as part of the config
//         const removeres = await axios.delete(
//           `${API_BASE_URL}/removeWishlistItem`,
//           { data: removePay } // This is crucial. Axios requires the data for DELETE requests to be included in an object.
//         );
//         // setWishListItems(updatedWishList);
//         toast.success(removeres?.data?.message, {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "light",
//           transition: Bounce,
//         });
//       } else {
//         // Add product to WishList
//         // setWishListItems([...WishListItems, product]);

//         const response = await postData("addToWishlist", payload);
//         toast.success(response?.message, {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "light",
//           transition: Bounce,
//         });
//       }

//       const responseWish = await getWishListData();
//       setWishListItems(responseWish);
//     } catch (error) {
//       toast.error(error?.message, {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//         transition: Bounce,
//       });
//     }
//   };

//   const FetchWishData = async () => {
//     try {
//       const resp = await getWishListData();
//       setWishListItems(resp);
//     } catch (error) {}
//   };

//   // ===========
//   // useeffect
//   // =========
//   const [userLogin, setUserLogin] = useState(null);
//   const [cartCount, setCartCount] = useState(0);
//   const [showLoader, setShowLoader] = useState(false);

//   const [getProductResponse, setGetProductResponse] = useState();

//   const getProductAPI = async () => {
//     try {
//       const response = await getData(`getAllCartById?uid=${getUid}`);
//       setCartItems(response?.cartItems || []);
//       setCartCount(response?.cartItems?.length || 0);
//       setGetProductResponse(response?.cartItems);
//     } catch (error) {}
//   };

//   useEffect(() => {
//     FetchWishData();
//     if (getUid) {
//       getProductAPI();
//     }
//   }, [getUid]);

//   return (
//     <CartContext.Provider
//       value={{
//         getProductResponse,
//         setGetProductResponse,
//         cartItems,
//         WishListItems,
//         addToCart,
//         removeFromCart,
//         clearCart,
//         updateQuantity,
//         AddToWishList,
//         uid,
//         setuid,
//         userLogin,
//         setUserLogin,
//         cartCount,
//         setCartCount,
//         showLoader,
//         setShowLoader,
//         getProductAPI,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };
