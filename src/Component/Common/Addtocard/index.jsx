import React, { useState, useContext, useEffect } from "react";

import { CartContext } from "../../Context/UserContext"; // Import Cart Context

import { MdCurrencyRupee } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { PiShareFatBold } from "react-icons/pi";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { TiStarHalfOutline } from "react-icons/ti";
import { TiStarOutline } from "react-icons/ti";
import { TiStarFullOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

import FillHeart from "../../Assets/img/slickimg/fillheart.svg";
import { Bounce, toast } from "react-toastify";
import {
  deleteProductAPI,
  getData,
  postData,
} from "../../../services/apiService";

import { filterCartProduct } from "../../utils/helper";

// const filterCartProduct = (cartItems = [], product) => {
//   if (!Array.isArray(cartItems)) return [];

//   return cartItems?.filter(
//     (item) =>
//       // item.product_id === product.id?.toString() &&
//       item?.product_name === product?.name
//   );
// };

const AddtoCard = ({ product }) => {
  const {
    AddToWishList,
    WishListItems,
    cartCount,
    getProductAPI,
    getProductResponse,
  } = useContext(CartContext);

  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState("1");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const weightOptions = ["0.5", "1", "2"]; // Available sizes

  const navigate = useNavigate();

  const uid = sessionStorage.getItem("uid"); // Get UID for session
  const isAuthenticated = !!sessionStorage.getItem("token"); // Check if user is logged in

  useEffect(() => {
    const matchedItems = filterCartProduct(getProductResponse, product);

    if (matchedItems.length > 0) {
      setQuantity(matchedItems[0].product_quantity);
      setIsAdded(true);
    } else {
      setQuantity(0);
      setIsAdded(false);
    }
  }, [getProductResponse, product]);

  const increaseQuantity = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.warning("Please login to add items!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    let updatedQuantity = quantity + 1;

    try {
      const payload = {
        uid,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_quantity: updatedQuantity,
        product_weight: selectedWeight,
      };

      const endpoint = quantity === 0 ? "addtocart" : "updateCart";
      const response = await postData(endpoint, payload);

      toast.success(
        `${product.name} ${quantity === 0 ? "added to" : "updated in"} cart!`,
        {
          position: "top-right",
          autoClose: 2000,
        }
      );

      setQuantity(updatedQuantity);

      setIsAdded(true);

      getProductAPI();

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {}
  };

  const decreaseQuantity = async () => {
    if (quantity > 1) {
      const updatedQuantity = quantity - 1;

      try {
        const payload = {
          uid,
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_quantity: updatedQuantity,
          product_weight: selectedWeight,
        };

        const response = await postData("updateCart", payload);

        toast.info(`Decreased quantity of ${product.name}`, {
          position: "top-right",
          autoClose: 2000,
        });

        setQuantity(updatedQuantity);
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (error) {}
    } else {
      // Remove product
      // try {
      //   const payload = {
      //     uid,
      //     product_id: product.id,
      //     product_weight: selectedWeight,
      //   };
      //   const response = await deleteProductAPI("removecart", "", payload);
      //
      //   toast.error(`Removed ${product.name} from cart!`, {
      //     position: "top-right",
      //     autoClose: 2000,
      //   });
      //   setQuantity(0);
      //   setIsAdded(false);
      //   window.dispatchEvent(new Event("cartUpdated"));
      // } catch (error) {
      //
      // }
    }
  };

  //   Rating Change
  const renderStars = (rating) => {
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

  // const product_info = getProductResponse.filter(user => user.product_name);
  //

  return (
    <React.Fragment>
      <div className="shop-by-category background-color-white m-auto md:m-auto position-relative my-2 ">
        <div className="d-flex justify-content-center pt-2">
          <div>
            {/* Icons (Heart & Share) */}
            <div className="heart" onClick={() => AddToWishList(product)}>
              {!WishListItems?.some(
                (item) =>
                  Number(item?.product_id) === Number(product?.id) ||
                  Number(product?.product_id)
              ) ? (
                <FaRegHeart className="text-color-terracotta" />
              ) : (
                <img src={FillHeart} alt="" />
              )}
            </div>
            <div className="share">
              <PiShareFatBold className="text-color-terracotta" />
            </div>

            {/* Product Image & Qty Selector */}

            <div className="gm" onClick={() => setDropdownOpen(!dropdownOpen)}>
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
                  className="position-absolute bg-white border rounded mt-1"
                  style={{ width: "120px", zIndex: 1000 }}
                >
                  {weightOptions.map(
                    (weight) =>
                      weight !== selectedWeight && ( // Hide selected weight
                        <div
                          key={weight}
                          className="p-2 cursor-pointer hover-bg-light"
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
            <div>
              <img
                src={product.image || product?.product_image}
                alt="Loading"
                className="img-fluid"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/productdescription/${product.id}`, {
                    state: { product },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Product Name & Ratings */}

        <div className="d-flex justify-content-between shop-by-category-detail px-2 pt-2">
          <div className="inter-font-family-500 card-heading font-size-16 pt-2 text-color-dark-grayish-blue">
            {product.name || product?.product_name}
          </div>
          <div
            className="w-50 d-flex justify-content-center rating-height"
            style={{ height: "59px" }}
          >
            <div>
              <div className="pt-1">
                <span className="start-gleeful">
                  {renderStars(product.rating)}
                </span>
              </div>
              <div className="inter-font-family-500 font-size-10 font-sm-8 start-gleeful pt-2">
                {product.rating} ({product.reviews} Reviews)
              </div>
            </div>
          </div>
        </div>

        {/* Price & Add to Cart Button */}

        <div className="d-flex justify-content-between pt-2">
          <div className="ms-4 d-flex align-items-center">
            <MdCurrencyRupee className="" />
            <span className="inter-font-family-500 font-size-16 text-color-black">
              {product.price || product?.product_price}
            </span>
          </div>
          {/* Add to Cart / Quantity Controls */}

          {/* <div>
            <button className="background-color-terracotta button-addtocard inter-font-family-500 font-size-16">
              Comming Soon
            </button>
          </div> */}
          {!isAdded ? (
            <div>
              <button
                className="background-color-terracotta button-addtocard inter-font-family-500 font-size-16"
                onClick={() =>
                  increaseQuantity(product?.product_id || product.id)
                }
              >
                Add
              </button>
            </div>
          ) : (
            <div>
              <div className="background-color-gleeful button-addtocard d-flex justify-content-around align-items-center">
                <div>
                  <button
                    className="background-color-terracotta font-size-24 inter-font-family-500 d-flex justify-content-around align-items-center"
                    onClick={decreaseQuantity}
                  >
                    -
                  </button>
                </div>
                <div>
                  <span className="font-size-24">{quantity}</span>
                </div>
                <div>
                  <button
                    className="background-color-terracotta font-size-24 inter-font-family-500 d-flex justify-content-around align-items-center"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddtoCard;
