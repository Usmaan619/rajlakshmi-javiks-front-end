import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../../Context/UserContext";
import { MdCurrencyRupee } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { PiShareFatBold } from "react-icons/pi";
import { MdOutlineArrowDropDown } from "react-icons/md";
import {
  TiStarHalfOutline,
  TiStarOutline,
  TiStarFullOutline,
} from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import FillHeart from "../../Assets/img/slickimg/fillheart.svg";
import { toast } from "react-toastify";
import { postData } from "../../../services/apiService";
import { filterCartProduct } from "../../utils/helper";

const AddtoCard = ({ product, showRemoveButton = false, onRemove }) => {
  // ✅ FIXED: Added ALL required context values
  const {
    AddToWishList,
    WishListItems = [], // ✅ ADDED: Default empty array
    cartCount,
    getProductAPI,
    getProductResponse = [], // ✅ ADDED: Default empty array
  } = useContext(CartContext);

  // Local state
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState("1");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const weightOptions = ["0.5", "1", "2"];

  const navigate = useNavigate();
  const uid = sessionStorage.getItem("uid");
  const isAuthenticated = !!sessionStorage.getItem("token");

  // ✅ FIXED: Safe product data access
  const getProductData = () => ({
    id: product.id || product.product_id,
    name: product.name || product.product_name,
    price: product.price || product.product_price,
    image: product.image || product.product_image,
  });

  const productData = getProductData();

  // Check if product is in cart
  useEffect(() => {
    if (!getProductResponse || !Array.isArray(getProductResponse)) return;

    const matchedItems = filterCartProduct(getProductResponse, productData);

    if (matchedItems.length > 0) {
      setQuantity(matchedItems[0].product_quantity || 1);
      setIsAdded(true);
    } else {
      setQuantity(0);
      setIsAdded(false);
    }
  }, [getProductResponse, productData]);

  // ✅ FIXED: Safe wishlist check
  const isInWishlist = WishListItems.some(
    (item) => Number(item?.product_id) === Number(productData.id)
  );

  // Increase quantity
  const increaseQuantity = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.warning("Please login to add items!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const updatedQuantity = quantity + 1;
    const payload = {
      uid,
      product_id: productData.id,
      product_name: productData.name,
      product_price: productData.price,
      product_quantity: updatedQuantity,
      product_weight: selectedWeight,
    };

    try {
      const endpoint = quantity === 0 ? "addtocart" : "updateCart";
      await postData(endpoint, payload);

      toast.success(
        `${productData.name} ${
          quantity === 0 ? "added to" : "updated in"
        } cart!`,
        { position: "top-right", autoClose: 2000 }
      );

      setQuantity(updatedQuantity);
      setIsAdded(true);

      if (getProductAPI) {
        getProductAPI();
      }

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  // Decrease quantity
  const decreaseQuantity = async () => {
    if (quantity > 1) {
      const updatedQuantity = quantity - 1;
      const payload = {
        uid,
        product_id: productData.id,
        product_name: productData.name,
        product_price: productData.price,
        product_quantity: updatedQuantity,
        product_weight: selectedWeight,
      };

      try {
        await postData("updateCart", payload);
        toast.info(`Decreased quantity of ${productData.name}`, {
          position: "top-right",
          autoClose: 2000,
        });
        setQuantity(updatedQuantity);
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (error) {
        toast.error("Failed to update cart");
      }
    }
  };

  // Stars rating
  const renderStars = (rating = 4.5) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <TiStarFullOutline key={i} className="start-gleeful" fontSize={15} />
        );
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(
          <TiStarHalfOutline key={i} className="start-gleeful" fontSize={15} />
        );
      } else {
        stars.push(
          <TiStarOutline key={i} className="start-gleeful" fontSize={15} />
        );
      }
    }
    return stars;
  };

  // Handle wishlist toggle
  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (AddToWishList) {
      AddToWishList(productData);
    }
  };

  // Handle remove from wishlist
  const handleRemove = () => {
    if (onRemove) {
      onRemove(productData.id);
    }
  };

  return (
    <div className="shop-by-category background-color-white m-auto position-relative my-2">
      <div className="d-flex justify-content-center pt-2">
        <div>
          {/* Heart Icon */}
          <div
            className="heart position-relative cursor-pointer"
            onClick={handleWishlistClick}
            style={{ cursor: isAuthenticated ? "pointer" : "not-allowed" }}
          >
            {!isInWishlist ? (
              <FaRegHeart className="text-color-terracotta" />
            ) : (
              <img src={FillHeart} alt="Filled Heart" />
            )}

            {/* Remove button for wishlist */}
            {showRemoveButton && (
              <button
                className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle"
                style={{ width: "20px", height: "20px", fontSize: "12px" }}
                onClick={handleRemove}
              >
                ×
              </button>
            )}
          </div>

          {/* Share Icon */}
          <div className="share cursor-pointer">
            <PiShareFatBold className="text-color-terracotta" />
          </div>

          {/* Weight Selector */}
          <div
            className="gm position-relative"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div>
              <span className="inter-font-family-500 font-size-14 text-color-dark-grayish-blue ml-3">
                Qty
              </span>
              <span className="inter-font-family-500 font-size-14 ms-2 text-color-dark-grayish-blue">
                {selectedWeight}kg
              </span>
              <MdOutlineArrowDropDown className="text-color-terracotta" />
            </div>

            {dropdownOpen && (
              <div
                className="position-absolute bg-white border rounded mt-1 shadow"
                style={{ width: "120px", zIndex: 1000 }}
              >
                {weightOptions.map(
                  (weight) =>
                    weight !== selectedWeight && (
                      <div
                        key={weight}
                        className="p-2 cursor-pointer hover-bg-light border-bottom"
                        onClick={() => {
                          setSelectedWeight(weight);
                          setDropdownOpen(false);
                        }}
                      >
                        {weight}kg
                      </div>
                    )
                )}
              </div>
            )}
          </div>

          {/* Product Image */}
          <div>
            <img
              src={productData.image}
              alt={productData.name}
              className="img-fluid cursor-pointer"
              onClick={() =>
                navigate(`/productdescription/${productData.id}`, {
                  state: { product: productData },
                })
              }
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Product Name & Rating */}
      <div className="d-flex justify-content-between shop-by-category-detail px-2 pt-2">
        <div className="inter-font-family-500 card-heading font-size-16 pt-2 text-color-dark-grayish-blue">
          {productData.name}
        </div>
        <div
          className="w-50 d-flex justify-content-center rating-height"
          style={{ height: "59px" }}
        >
          <div>
            <div className="pt-1">
              <span className="start-gleeful">{renderStars()}</span>
            </div>
            <div className="inter-font-family-500 font-size-10 font-sm-8 start-gleeful pt-2">
              4.5 (120 Reviews)
            </div>
          </div>
        </div>
      </div>

      {/* Price & Cart Controls */}
      <div className="d-flex justify-content-between pt-2 px-2">
        <div className="d-flex align-items-center">
          <MdCurrencyRupee />
          <span className="inter-font-family-500 font-size-16 text-color-black ms-1">
            {productData.price}
          </span>
        </div>

        {!isAdded ? (
          <button
            className="background-color-terracotta button-addtocard inter-font-family-500 font-size-16 px-3 py-1 rounded"
            onClick={increaseQuantity}
          >
            Add
          </button>
        ) : (
          <div className="background-color-gleeful button-addtocard d-flex justify-content-around align-items-center p-1 rounded">
            <button
              className="background-color-terracotta rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "30px", height: "30px", border: "none" }}
              onClick={decreaseQuantity}
            >
              -
            </button>
            <span className="font-size-20 mx-2 font-weight-bold">
              {quantity}
            </span>
            <button
              className="background-color-terracotta rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "30px", height: "30px", border: "none" }}
              onClick={increaseQuantity}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddtoCard;
