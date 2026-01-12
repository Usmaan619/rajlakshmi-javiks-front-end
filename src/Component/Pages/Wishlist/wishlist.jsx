import { useContext, useEffect, useState } from "react";
import AddtoCard from "../../Common/Addtocard";
import empty from "../../Assets/img/slickimg/emplywish-removebg-preview.png";
import { CartContext } from "../../Context/UserContext";
import { getData, postData } from "../../../services/apiService";

const WishList = () => {
  const { WishListItems, toggleWishlist, loading, uid, clearCart } =
    useContext(CartContext);
  const [localLoading, setLocalLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transform data for AddtoCard
  const wishlistProducts =
    WishListItems?.map((item) => ({
      backId: item.id,
      uid: item.uid,
      name: item.product_name,
      price: parseFloat(item.product_price),
      quantity: item.product_quantity,
      id: item.product_id,
      image: item.product_image,
    })) || [];

  const isEmpty = wishlistProducts.length === 0;
  const showContent = !localLoading && !error && !loading;

  // Remove item handler
  const handleRemoveItem = async (productId) => {
    if (!uid) {
      setError("Please login first");
      return;
    }

    try {
      await getData("/removeWishlistItem", {
        method: "POST",
        body: { uid, product_id: productId },
      });
    } catch (err) {
      setError("Failed to remove item");
    }
  };

  const clearWishlist = async () => {
    if (!uid) {
      setError("Please login first");
      return;
    }

    try {
      const response = await postData(`/clearWishlist`, { uid });

      if (response) clearCart();
    } catch (err) {
      setError("Failed to clear wishlist");
    }
  };

  useEffect(() => {
    if (WishListItems !== undefined) {
      setLocalLoading(false);
    }
  }, [WishListItems]);

  return (
    <>
      <section className="wishlist-section">
        <div className="bg-custom-gradient-product"></div>
        <div className="background-color-light-grayish-yellow padding-bottom-60">
          <div className="container">
            {/* Loading */}
            {(localLoading || loading) && (
              <div className="row justify-content-center py-5">
                <div className="col-12 text-center">
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Loading your wishlist...</p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="row justify-content-center py-5">
                <div className="col-md-6">
                  <div className="alert alert-danger">
                    {error}
                    <button
                      className="btn btn-sm btn-outline-light ms-2"
                      onClick={() => setError(null)}
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {showContent && isEmpty && (
              <div className="row justify-content-center py-5">
                <div className="col-md-6 text-center">
                  <img className="w-50 mw-100 mb-4" src={empty} alt="Empty" />
                  <h4>Your wishlist is empty</h4>
                  <p className="text-muted">Start shopping to save items!</p>
                </div>
              </div>
            )}

            {/* Products */}
            {showContent && !isEmpty && (
              <div className="wishlist-grid">
                <div className="row g-4">
                  {wishlistProducts.map((product, index) => (
                    <div
                      key={`${product.id}-${index}`}
                      className="col-lg-3 col-md-6 col-12"
                    >
                      <AddtoCard
                        product={product}
                        showRemoveButton={true}
                        onRemove={() => handleRemoveItem(product.id)}
                        isWishlist={true}
                      />
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="row mt-4">
                  <div className="col">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5>
                        Total: <strong>{wishlistProducts.length} items</strong>
                      </h5>
                      <button
                        className="btn btn-outline-danger"
                        onClick={clearWishlist}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default WishList;

// import React, { useContext, useEffect, useState, useCallback } from "react";
// import Navbar from "../../Common/Navbar";
// import AddtoCard from "../../Common/Addtocard";
// import Footer from "../../Common/Footer";
// import empty from "../../Assets/img/slickimg/emplywish-removebg-preview.png";
// import { CartContext } from "../../Context/UserContext";
// import { getData, getWishListData } from "../../../services/apiService";
// import { getItem } from "../../../services/storage.service";
// const WishList = () => {
//   // Context & State
//   const { WishListItems, setWishListItems, user } = useContext(CartContext);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [uid, setUid] = useState(null);

//   // Transform wishlist data for AddtoCard component
//   const transformWishlistData = useCallback((items) => {
//     if (!items?.length) return [];

//     return items.map((item) => ({
//       backId: item.id,
//       uid: item.uid,
//       name: item.product_name,
//       price: parseFloat(item.product_price),
//       quantity: item.product_quantity,
//       id: item.product_id,
//       image: item.product_image,
//     }));
//   }, []);

//   // Fetch wishlist data
//   const fetchWishlist = useCallback(async () => {
//     if (!uid) {
//       setError("User not logged in");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       // Pass uid to API service
//       const response = await getWishListData({ uid });
//       console.log("Wishlist response:", response);

//       if (response?.success) {
//         setWishListItems(response.data || []);
//       } else {
//         setWishListItems([]);
//         setError("No wishlist items found");
//       }
//     } catch (err) {
//       console.error("Fetch wishlist error:", err);
//       setError("Failed to load wishlist");
//       setWishListItems([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [uid, setWishListItems]);

//   // Get user ID on mount
//   useEffect(() => {
//     const userId = getItem("uid");
//     // or user?.uid from context
//     setUid(userId || user?.uid);
//   }, [user]);

//   // Fetch wishlist when uid changes
//   useEffect(() => {
//     if (uid) {
//       fetchWishlist();
//     }
//   }, [fetchWishlist, uid]);

//   // Transform data for rendering
//   const wishlistProducts = transformWishlistData(WishListItems);
//   const isEmpty = wishlistProducts.length === 0;
//   const showContent = !loading && !error;

//   // Remove item from wishlist
//   const handleRemoveItem = async (productId) => {
//     try {
//       await getData(`/removeWishlistItem`, {
//         method: "POST",
//         body: { uid, product_id: productId },
//       });
//       // Re-fetch wishlist
//       fetchWishlist();
//     } catch (err) {
//       console.error("Remove item error:", err);
//     }
//   };

//   return (
//     <React.Fragment>
//       <section className="wishlist-section">
//         <div className="bg-custom-gradient-product"></div>

//         <div className="background-color-light-grayish-yellow padding-bottom-60">
//           <div className="container">
//             {/* Loading State */}
//             {loading && (
//               <div className="row justify-content-center">
//                 <div className="col-12 text-center py-5">
//                   <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                   </div>
//                   <p className="mt-3 mb-0">Loading your wishlist...</p>
//                 </div>
//               </div>
//             )}

//             {/* Error State */}
//             {error && !loading && (
//               <div className="row justify-content-center">
//                 <div className="col-md-6 text-center py-5">
//                   <div className="alert alert-warning">
//                     <i className="fas fa-exclamation-triangle me-2"></i>
//                     {error}
//                   </div>
//                   <button
//                     className="btn btn-primary mt-3"
//                     onClick={fetchWishlist}
//                   >
//                     Try Again
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Empty State */}
//             {showContent && isEmpty && (
//               <div className="row justify-content-center">
//                 <div className="col-md-6 text-center py-5">
//                   <img
//                     className="w-50 mw-100 mb-4"
//                     src={empty}
//                     alt="Empty wishlist"
//                   />
//                   <h4>Your wishlist is empty</h4>
//                   <p className="text-muted">
//                     Start shopping to add items to your wishlist!
//                   </p>
//                   <button className="btn btn-outline-primary">
//                     Continue Shopping
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Products Grid */}
//             {showContent && !isEmpty && (
//               <div className="wishlist-products">
//                 <div className="row g-4">
//                   {wishlistProducts.map((product, index) => (
//                     <div
//                       key={`${product.id}-${index}`}
//                       className="col-lg-3 col-md-6 col-sm-12"
//                     >
//                       <div className="wishlist-item">
//                         <AddtoCard
//                           product={product}
//                           showRemoveButton={true}
//                           onRemove={() => handleRemoveItem(product.id)}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Wishlist Summary */}
//                 {wishlistProducts.length > 0 && (
//                   <div className="wishlist-summary mt-4">
//                     <div className="row justify-content-between align-items-center">
//                       <div className="col-md-6">
//                         <h5>
//                           Total Items:{" "}
//                           <span className="text-primary">
//                             {wishlistProducts.length}
//                           </span>
//                         </h5>
//                       </div>
//                       <div className="col-md-6 text-md-end">
//                         <button className="btn btn-outline-danger">
//                           Clear All Wishlist
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </section>
//     </React.Fragment>
//   );
// };

// export default WishList;
