import React, { useContext, useEffect, useState } from "react";

// images
import rightTick from "../../Assets/img/ourProducts/rightTick.svg";
import trash from "../../Assets/img/ourProducts/TrashSimple.svg";
import cross from "../../Assets/img/Product/cross.svg";
import { Modal } from "react-bootstrap";
import { CartContext } from "../../Context/UserContext";
import CardEmpty from "../../Assets/img/Product/cart.png";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import axios from "axios";
import { useForm } from "react-hook-form";
import { deleteData, getData, postData } from "../../../services/apiService";
import {
  clearCache,
  getItem,
  removeItem,
} from "../../../services/storage.service";
import { City, Country, State } from "country-state-city";
import Select from "react-select";

const AddToCartProccess = ({ showModal, handleClose, product }) => {
  const { register, handleSubmit, setValue, trigger, reset } = useForm();

  const navigate = useNavigate();
  // const {  clearCart } = useContext(CartContext);

  const [cartItems, setCartItems] = useState([]);

  // const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState("1kg");
  const weightOptions = ["500gm", "1kg", "2kg"]; // Available sizes

  const uid = getItem("uid");
  const isAuthenticated = !!sessionStorage.getItem("token");
  // const AddToCartPayload = JSON?.parse(sessionStorage.getItem(`cart_${uid}`)||{});

  // States
  const [step, setStep] = useState(0);
  const [Paymode, setPaymode] = useState(false);
  const [mobView, setmobView] = useState(false);
  const [IsShowAddForm, setIsShowAddForm] = useState(false);

  // Functions
  const handleTapSteps = async () => {
    setStep(step + 1);
    if (step >= 2) {
      return setPaymode(!Paymode);
    }

    const uid = sessionStorage.getItem("uid");

    const storedCart = JSON.parse(sessionStorage.getItem(`cart_${uid}`)) || {};

    if (Object.keys(storedCart).length === 0) {
      // toast.warning("Your cart is empty!", { position: "top-right" });
      return;
    }

    const payload = {
      uid: uid,
      cartItems: Object.keys(storedCart).map((productId) => ({
        productId,
        items: Object.entries(storedCart[productId]).map(([weight, data]) => ({
          weight,
          quantity: data.quantity,
        })),
      })),
    };
    

    // try {
    //   const response = await postData("checkout", payload);

    //   if (response.status === 200) {
    //     toast.success("Order placed successfully!", { position: "top-right" });
    //     clearCart(); // Clear cart after order
    //   }
    // } catch (error) {
    //   toast.error("Failed to place order. Try again.", {
    //     position: "top-right",
    //   });
    //   
    // }
  };

  const fetchCartItems = () => {
    const storedCart = JSON.parse(sessionStorage.getItem(`cart_${uid}`)) || {};
    const itemsArray = [];

    Object.keys(storedCart).forEach((productId) => {
      Object.keys(storedCart[productId]).forEach((weight) => {
        itemsArray.push({
          id: productId,
          weight,
          quantity: storedCart[productId][weight].quantity,
          productDetails: storedCart[productId][weight].productDetails,
        });
      });
    });

    setCartItems(itemsArray);
  };

  useEffect(() => {
    fetchCartItems(); // Fetch on initial render

    // 🔥 Listen for cart updates
    window.addEventListener("cartUpdated", fetchCartItems);

    return () => {
      window.removeEventListener("cartUpdated", fetchCartItems);
    };
  }, [uid]);

  // const updateQuantity = (productId, weight, newQuantity) => {
  //   if (newQuantity < 1) {
  //     // removeFromCart(productId, weight);
  //     return;
  //   }

  //   const storedCart = JSON.parse(sessionStorage.getItem(`cart_${uid}`)) || {};
  //   if (storedCart[productId] && storedCart[productId][weight]) {
  //     storedCart[productId][weight].quantity = newQuantity;
  //     sessionStorage.setItem(`cart_${uid}`, JSON.stringify(storedCart));
  //     fetchCartItems(); // 🔄 Update UI immediately
  //     window.dispatchEvent(new Event("cartUpdated")); // Notify all components
  //   }
  // };

  const increaseQuantity = async (i) => {
    

    let updatedQuantity = i.product_quantity + 1;

    try {
      const payload = {
        uid,
        product_id: i.product_id,
        product_name: i.product_name,
        product_price: i.product_price,
        product_quantity: updatedQuantity,
        product_weight: i.product_weight,
      };

      const endpoint = "updateCart";
      const response = await postData(endpoint, payload);

      
      toast.success(`${i.product_name} updated in cart!`, {
        position: "top-right",
        autoClose: 2000,
      });

      setQuantity(updatedQuantity);

      // setIsAdded(true);

      getProductAPI();

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      
    }
  };

  const decreaseQuantity = async (i) => {
    if (quantity > 1) {
      const updatedQuantity = i.product_quantity - 1;

      try {
        const payload = {
          uid,
          product_id: i.product_id,
          product_name: i.product_name,
          product_price: i.product_price,
          product_quantity: updatedQuantity,
          product_weight: i.product_weight,
        };

        const response = await postData("updateCart", payload);
        

        toast.info(`Decreased quantity of ${i.product_name}`, {
          position: "top-right",
          autoClose: 2000,
        });

        setQuantity(updatedQuantity);
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (error) {
        
      }
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

  const handleDeleteProduct = async (i) => {
    
    try {
      const payload = {
        uid: i?.uid,
        product_id: i?.product_id,
      };

      const response = await postData("removecart", payload);
      
      if (response?.message == "Product removed from cart") {
        getProductAPI();
        // setGetProductResponse(response?.cartItems);
        // removeItem(`cart_${uid}`);
        toast?.success(response?.message, {
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
      }
    } catch (error) {}
  };

  

  const clearCart = () => {
    const uid = sessionStorage.getItem("uid");
    sessionStorage.removeItem(`cart_${uid}`);

    fetchCartItems(); // 🔄 Update UI immediately
    window.dispatchEvent(new Event("cartUpdated"));
  };

  
  const totalPrice = cartItems?.reduce((total, product) => {
    

    console.log(
      "total + Number(product?.productDetails?.price): ",
      total + Number(product?.product_price)
    );
    
    return total + Number(product?.product_price * product?.product_quantity * product?.product_weight);
  }, 0);

  // Add to Cart API
  const handleAddToCartApi = async () => {
    try {
      // const payload = cartItems?.map((product) => ({
      //   uid,
      //   product_id: product?.id,
      //   product_name: product?.productDetails?.name,
      //   product_price: product?.productDetails?.price,
      //   product_quantity: product?.quantity,
      //   product_weight: product?.weight,
      // }));

      // const response = await postData("addtocart", payload);
      // 
      setStep(1);
      if (step >= 2) {
        return setPaymode(!Paymode);
      }
    } catch (error) {}
  };

  const [allAdress, setAllAdress] = useState([]);

  const { cartCount, setCartCount, setShowLoader, setGetProductResponse } =
    useContext(CartContext);

  useEffect(() => {
    getAddressAPI();
    const getProductAPI = async () => {
      try {
        const response = await getData(`getAllCartById?uid=${uid}`);
        setIsProduct(response?.cartItems || []);
        setCartCount(response?.cartItems?.length);
        setCartItems(response?.cartItems);
        setGetProductResponse(response?.cartItems);
      } catch (error) {
        
      }
    };

    // Call on load + when custom event fires
    getProductAPI();

    const handleRefresh = () => {
      getProductAPI();
    };

    window.addEventListener("refreshCart", handleRefresh);

    return () => {
      window.removeEventListener("refreshCart", handleRefresh);
    };
  }, [cartCount]);

  const getAddressAPI = async () => {
    try {
      const response = await getData("getAllAddressRajlaxmi");

      setAllAdress(response?.addresses || []);
    } catch (error) {}
  };
  

  // =====================================

  const [isProduct, setIsProduct] = useState([]);

  const getUid = getItem("uid");
  

  const getProductAPI = async () => {
    try {
      const response = await getData(`getAllCartById?uid=${getUid}`);

      setIsProduct(response?.cartItems || []);
      setCartItems(response?.cartItems || []);
      setCartCount(response?.cartItems?.length);
    } catch (error) {}
  };
  

  // ====================================================
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [pinOptions, setPinOptions] = useState();
  const user_country = selectedCountry?.name;
  const user_state = selectedState?.name;
  const user_city = selectedCity?.name;
  const user_pincode = selectedPin?.Pincode;

  const onSubmit = async (data) => {
    // handleTapSteps()
    try {
      
      const payload = {
        fullName: data?.fullName,
        email: data?.email,
        address: data?.address,
        houseNo: data?.houseNo,
        country: data?.country,
        contactNo: data?.contactNo,
        state: data?.state,
        city: data?.city,
        pincode: data?.pincode?.Pincode,
        userId: sessionStorage.getItem("id"),
      };
      const response = await postData("createAddressRajlaxmi", payload);

      if (response?.success) {
        reset();
        setSelectedCountry(null);
        setSelectedState(null);
        setSelectedCity(null);
        setSelectedPin(null);
        setValue(null);
        await getAddressAPI();
        toast.success(`${response?.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
      if (response?.length <= 0) {
        setIsShowAddForm(true);
      }
    } catch (error) {
      
    }
  };

  const handleAddressDelete = async (id) => {
    
    try {
      // deleteAddressByIdRajlaxmi/:id
      const response = await deleteData("deleteAddressByIdRajlaxmi", id);
      
      if (response?.success) {
        await getAddressAPI();
        toast.success(`${response?.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      
    }
  };
  const [setectedAddress, SetSetectedAddress] = useState(null);
  const onSelectAddress = (a) => {
    try {
      SetSetectedAddress(a);
      handleTapSteps();
    } catch (error) {
      
    }
  };
  

  const handleCheckOut = async () => {
    try {
      setShowLoader(true);
      // 1. Prepare cart payload
      const payload = cartItems?.map((product) => {
        

        return {
          uid,
          product_id: product?.product_id,
          product_name: product?.product_name,
          product_price: product?.product_price,
          product_quantity: product?.product_quantity,
          product_weight: product?.product_weight,
          product_total_amount: product?.product_total_amount,
          address_id: setectedAddress?.id,
        };
      });
      

      const finalPayload = { payload, address: setectedAddress };
      

      // 2. Create Order
      const response = await postData("create-order", finalPayload);
      

      // if (!response || response.status !== 200 || !response.data.success) {
      //   throw new Error("Order creation failed");
      // }

      
      if (response?.success) {
        
        const { razorpay_order_id, amount, currency, name, id } =
          response.razorpayOrder; // safe destructure

        console.log(
          "response.data.razorpayOrder.notes.user_mobile_num: ",
          response.razorpayOrder.notes.user_mobile_num
        );
        //  Razorpay Checkout Setup
        const options = {
          key: "rzp_test_qcl3EzwXvpMnwS", // Replace with your Razorpay Key
          amount, // in paise
          currency,
          name: name || "Gauswarn",
          description: "Test Transaction",
          // image: Rajlaxmi,
          order_id: id,

          prefill: {
            name: response?.razorpayOrder?.notes?.user_name,
            email: response?.razorpayOrder?.notes?.user_email,
            contact: response?.razorpayOrder?.notes?.user_mobile_num,
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },

          modal: {
            ondismiss: async function (d) {
              setShowLoader(false);
            },
          },

          handler: async function (rzpResponse) {
            

            try {
              const payload = {
                rzpResponse,
                ...response.razorpayOrder,
              };

              const validateRes = await postData("status", payload);

              const result = validateRes;
              

              if (result.success) {
                navigate("/payment-success");
                removeItem(`cart_${uid}`);
              } else {
                navigate("/payment-failed");
              }
            } catch (error) {
              
              navigate("/payment-failed");
            } finally {
              setShowLoader(false);
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          alert(`Payment Failed: ${response.error.description}`);
          
          setShowLoader(false);
        });

        rzp.open();
      } else {
        throw Error("payment error");
      }

      // await processPayment(razorpayOrder, response.data);

      // await postShippingOrder(razorpayOrder, cart, data);
    } catch (error) {
      
      setShowLoader(false);
    }
  };

  // Helper function to process payment via Razorpay
  const processPayment = async (razorpayOrder, orderResponseData) => {
    
    
  };

  const handlePaymentSuccess = async (rzpResponse, orderData) => {
    try {
      setShowLoader(true);
      const payload = { rzpResponse, ...orderData.razorpayOrder };
      const validateRes = await postData(`status`, payload);

      if (validateRes.data.success) {
        navigate("/payment-success");
        // setCart([]);
        // reset();
      } else {
        navigate("/payment-failed");
        // setCart([]);
        // reset();
      }
    } catch (error) {
      
      navigate("/payment-failed");
    } finally {
      setShowLoader(false);
    }
  };

  // const postShippingOrder = async (razorpayOrder, cartItems, userData) => {
  //   try {
  //     const shippingPayload = {
  //       order_id: razorpayOrder.id,
  //       order_date: new Date().toISOString().split("T")[0],
  //       order_type: "ESSENTIALS",
  //       consignee_name: userData?.user_name,
  //       consignee_phone: Number(userData?.user_mobile_num),
  //       consignee_alternate_phone: Number(userData?.user_mobile_num),
  //       consignee_email: userData?.user_email,
  //       consignee_address_line_one: userData?.user_house_number,
  //       consignee_address_line_two: userData?.user_landmark,
  //       consignee_pin_code: userData?.user_pincode,
  //       consignee_city: userData?.user_city,
  //       consignee_state: userData?.user_state,
  //       product_detail: cartItems.map((item) => ({
  //         name: item?.productDetails?.name || "Product",
  //         sku_number: "22",
  //         quantity: item?.product_quantity,
  //         discount: "",
  //         hsn: "#123",
  //         unit_price: item?.productDetails?.price,
  //         product_category: "Other",
  //       })),
  //       payment_type: "PREPAID",
  //       // Other fields as needed...
  //       weight: 200,
  //       length: 10,
  //       width: 20,
  //       height: 15,
  //     };

  //     const shippingRes = await axios.post(
  //       `${environment?.SHIPPING_API_URL}/app/api/v1/push-order`,
  //       shippingPayload,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "private-key": "G0K1PQYBq3Xlph6y48gw",
  //           "public-key": "LBYfQgGFRljv1A249H87",
  //         },
  //       }
  //     );
  //     sessionStorage.setItem("orderId", shippingRes?.data?.data?.order_id);
  //     
  //   } catch (error) {
  //     
  //   }
  // };

  const RequiredStar = () => <span className="text-danger">*</span>;

  const getAllCodesByCity = async (city) => {
    const response = await axios.get(
      `https://api.postalpincode.in/postoffice/${city}`
    );

    if (response?.data[0]?.Status === "Success")
      setPinOptions(
        response?.data[0]?.PostOffice ? response?.data[0]?.PostOffice : "na"
      );
  };

  return (
    <>
      <div>
        {isProduct.length > 0 ? (
          <Modal
            show={showModal}
            onHide={handleClose}
            centered
            className="AddToCartModal modal-fullscreen modal-dialog-centered modal-dialog-box"
          >
            <div className="modal-content AddToCartModal-modal bg-transparent">
              <div className="d-flex justify-content-center ">
                <div className="background-color-add-modal rounded-top-4 me-4">
                  <img
                    type="button"
                    onClick={() => handleClose()}
                    className="mx-4 mt-3 mb-2 "
                    src={cross}
                    alt="Loading"
                  />
                </div>
              </div>
              <Modal.Header className="modal-header AddToCartModal-header justify-content-center">
                <div className="d-flex justify-content-center">
                  <div>
                    <div
                      className={`tick-box${
                        step >= 1 ? "-active" : ""
                      } d-flex justify-content-center align-items-center`}
                    >
                      {step >= 1 && <img src={rightTick} alt="Loading" />}
                    </div>
                    <span className="josefin-sans-font-family-500 font-size-18">
                      Cart
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="d-flex">
                      <hr
                        className={`tick-progress-bar${
                          step >= 1 ? "-active" : ""
                        }`}
                      />
                      <div
                        className={`tick-box${
                          step >= 1 ? "-active" : ""
                        } d-flex justify-content-center align-items-center`}
                      >
                        {step >= 2 && <img src={rightTick} alt="Loading" />}
                      </div>
                      <hr
                        className={`tick-progress-bar${
                          step >= 2 ? "-active" : ""
                        }`}
                      />
                    </div>
                    <span className="josefin-sans-font-family-500 font-size-18">
                      Address
                    </span>
                  </div>

                  <div className="text-center">
                    <div
                      className={`tick-box${
                        step >= 2 ? "-active" : ""
                      } d-flex justify-content-center align-items-center`}
                    >
                      {step >= 4 && <img src={rightTick} alt="Loading" />}
                    </div>
                    <span className="josefin-sans-font-family-500 font-size-18">
                      Payment
                    </span>
                  </div>
                </div>
              </Modal.Header>
              <Modal.Body className=" background-color-light-grayish-yellow pt-0 AddToCartModal-body">
                <div className="container-fluid">
                  <div
                    className={`payment-process-modal row ${
                      Paymode ? "" : "justify-content-evenly"
                    }`}
                  >
                    {/* items Add */}
                    <div
                      className={`col-4 AddToCartModal-modal-grid-1 pt-3 ${
                        mobView ? "pay-mob-view" : ""
                      } `}
                    >
                      <div className="d-flex justify-content-between">
                        <span className="text-color-terracotta font-size-16 inter-font-family-500">
                          {isProduct.length} Products
                        </span>
                        {/* <span onClick={clearCart} style={{ cursor: "pointer" }}>
                          Clear all
                        </span> */}
                      </div>
                      <hr />

                      <div className="row payment-process-card-height overflow-auto">
                        {isProduct?.map((i, index) => (
                          <div className="d-flex col-md-6 col-lg-12 mx-md-1 mx-lg-0 px-0  align-items-center product-cards my-3">
                            <div className=" p-0">
                              <img
                                // src={i.productDetails.image}
                                className="rounded m-2"
                                alt=""
                              />
                            </div>
                            <div className="ms-2 product-cards-center p-0">
                              <div className="text-color-dark-grayish-blue inter-font-family-500 font-size-16 pt-1">
                                {i.product_name}
                              </div>
                              <div className="text-color-dark-grayish-blue inter-font-family-400 font-size-14 pt-1">
                                Qty: {i.product_weight}kg
                              </div>
                              <div className="text-color-dark-grayish-blue inter-font-family-500 font-size-24 pt-2">
                                ₹ {i.product_price}/Kg
                              </div>
                            </div>
                            <div className=" product-cards-end p-0 background-color-gleeful d-flex justify-content-center align-items-center">
                              <div>
                                <div className=" button-addtocard d-grid justify-content-center">
                                  <div>
                                    <button
                                      className="background-color-terracotta font-size-24 inter-font-family-500 d-flex justify-content-around align-items-center"
                                      onClick={() => decreaseQuantity(i)}
                                    >
                                      -
                                    </button>
                                  </div>
                                  <div className="text-center">
                                    <span className="font-size-24">
                                      {i.product_quantity}
                                    </span>
                                  </div>
                                  <div>
                                    <button
                                      className="background-color-terracotta font-size-24 inter-font-family-500 d-flex justify-content-around align-items-center"
                                      onClick={() => increaseQuantity(i)}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className=" product-cards-end p-0 background-color-terracotta AddToCartModal-delete-button d-flex justify-content-center align-items-center"
                              style={{ cursor: "pointer" }}
                            >
                              <span
                                className="text-white inter-font-family-600 font-size-16"
                                onClick={
                                  () => handleDeleteProduct(i)
                                  // removeFromCart(i.product_id, i.product_weight)
                                }
                              >
                                Delete
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="d-flex justify-content-between mt-5">
                        <Link to="/products">
                          <button
                            className={`addToCartModalButton font-size-16 px-5 inter-font-family-500 rounded`}
                          >
                            Add more item
                          </button>
                        </Link>

                        <button
                          onClick={() => {
                            handleTapSteps();
                            handleAddToCartApi();
                          }}
                          className={`addToCartModalButton font-size-16 px-5 inter-font-family-500 rounded`}
                        >
                          Proceed
                        </button>
                      </div>
                    </div>
                    {/* <hr
                    className={` vertical-hr vertical-hr-tab ${
                      Paymode ? "d-none" : ""
                    }`}
                  /> */}
                    {/* Detail Form */}
                    <div
                      className={`col-lg-4 AddToCartModal-modal-grid-2 pt-3 ${
                        Paymode ? "payModeBlackScreenActive" : ""
                      } ${mobView ? "pay-mob-view" : ""}`}
                    >
                      {/* {allAdress?.length > 0 && (
                        <div className="">
                          <span className="address-heading font-size-14 inter-font-family-500">
                            Address Details
                          </span>
                          <hr />
                        </div>
                      )} */}
                      <div className="">
                        <span className="address-heading font-size-14 inter-font-family-500">
                          Address Details
                        </span>
                        <hr />
                      </div>

                      <div className="payment-process-card-height overflow-x-class">
                        <div className={`row ${step >= 1 ? "" : "d-none"}`}>
                          {allAdress?.map((a, i) => (
                            <div
                              onClick={() => {
                                onSelectAddress(a);
                              }}
                              className="col-lg-3 ps-2 ms-3 me-4 mb-3 address-section p-0 rounded-3 pointer"
                              role="button"
                            >
                              <div className="d-flex justify-content-end align-items-center">
                                <div
                                  onClick={() => {
                                    handleAddressDelete(a?.id);
                                  }}
                                  className="address-box-section background-color-gleeful-opacity rounded-circle d-flex justify-content-center align-items-center mt-2 mx-2"
                                >
                                  <img className="" src={trash} alt="" />
                                </div>
                              </div>
                              <div className="font-size-14 inter-font-family-500">
                                {a?.fullName}
                              </div>
                              <div className="font-size-12 inter-font-family-300 text-trunc-class">
                                {a?.address}
                              </div>
                              <div className="font-size-12 inter-font-family-300">
                                {a?.contactNo}
                              </div>
                            </div>
                          ))}
                        </div>
                        {allAdress?.length > 0 && (
                          <hr
                            className={`address-sect-hr ${
                              step >= 1 ? "" : "d-none"
                            }`}
                          />
                        )}
                        {allAdress?.length < 3 && (
                          <>
                            <div
                              className={`login-text font-size-14 inter-font-family-500 ${
                                step >= 1 ? "" : "d-none"
                              }`}
                            >
                              <button
                                onClick={() => {
                                  setIsShowAddForm(!IsShowAddForm);
                                }}
                                className={`addToCartModalButton font-size-16 px-4 inter-font-family-500 rounded`}
                              >
                                Add New Address
                              </button>
                            </div>

                            <form
                              onSubmit={handleSubmit(onSubmit)}
                              className={`row ${
                                step >= 1 && IsShowAddForm ? "" : "d-none"
                              }`}
                            >
                              <div className="col-lg-6 address-section-form form-group pt-3">
                                <label
                                  className="font-size-12 inter-font-family-400"
                                  htmlFor="fullName"
                                >
                                  Full Name <RequiredStar />
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  {...register("fullName", {
                                    required: true,
                                  })}
                                />
                              </div>
                              <div className="col-lg-6 address-section-form form-group pt-3">
                                <label
                                  className="font-size-12 inter-font-family-400"
                                  htmlFor="email"
                                >
                                  Email <RequiredStar />
                                </label>
                                <input
                                  type="email"
                                  className="form-control"
                                  {...register("email", { required: true })}
                                />
                              </div>
                              <div className="col-lg-6 address-section-form form-group pt-3">
                                <label
                                  className="font-size-12 inter-font-family-400"
                                  htmlFor="address"
                                >
                                  Address <RequiredStar />
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  {...register("address", { required: true })}
                                />
                              </div>
                              <div className="col-lg-6 address-section-form form-group pt-3">
                                <label
                                  className="font-size-12 inter-font-family-400"
                                  htmlFor="apartment"
                                >
                                  House No. <RequiredStar />
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  {...register("houseNo", { required: true })}
                                />
                              </div>
                              <div className="col-lg-4  form-group pt-3">
                                <label
                                  className="font-size-12 inter-font-family-400"
                                  htmlFor="country"
                                >
                                  Country <RequiredStar />
                                </label>
                                <Select
                                  options={Country?.getAllCountries()}
                                  getOptionLabel={(options) => {
                                    return options["name"];
                                  }}
                                  getOptionValue={(options) => {
                                    return options["name"];
                                  }}
                                  onChange={(item) => {
                                    setSelectedCountry(item);
                                    setValue("country", item?.name || "");
                                    trigger("country");
                                  }}
                                  name="country"
                                  // placeholder="COUNTRY"
                                  className="country-input py-1 "
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                />
                                <input
                                  type="hidden"
                                  {...register("country", { required: true })}
                                />
                              </div>
                              <div className="col-lg-8 form-group pt-3">
                                <label
                                  className="font-size-12 inter-font-family-400"
                                  htmlFor="state"
                                >
                                  State <RequiredStar />
                                </label>
                                <Select
                                  options={State?.getStatesOfCountry(
                                    selectedCountry?.isoCode
                                  )}
                                  getOptionLabel={(options) => {
                                    return options["name"];
                                  }}
                                  getOptionValue={(options) => {
                                    return options["name"];
                                  }}
                                  onChange={(item) => {
                                    setSelectedState(item);
                                    setValue("state", item?.name || "");
                                    trigger("state");
                                  }}
                                  name="state"
                                  // placeholder="STATE"
                                  className="state-input py-1 w-100"
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }), // Ensure dropdown shows above everything
                                  }}
                                />
                                <input
                                  type="hidden"
                                  {...register("state", { required: true })}
                                />
                              </div>
                              <div className="col-lg-4 form-group pt-3">
                                <label
                                  className="font-size-12 inter-font-family-400"
                                  htmlFor="city"
                                >
                                  City <RequiredStar />
                                </label>
                                <Select
                                  options={City.getCitiesOfState(
                                    selectedState?.countryCode,
                                    selectedState?.isoCode
                                  )}
                                  getOptionLabel={(options) => {
                                    return options["name"];
                                  }}
                                  getOptionValue={(options) => {
                                    return options["name"];
                                  }}
                                  onChange={(item) => {
                                    setSelectedCity(item);
                                    getAllCodesByCity(item.name);
                                    setValue("city", item?.name || "");
                                    trigger("city");
                                  }}
                                  name="city"
                                  // placeholder="CITY"
                                  className="city-input py-1"
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }), // Ensure dropdown shows above everything
                                  }}
                                />
                                <input
                                  type="hidden"
                                  {...register("city", { required: true })}
                                />
                              </div>
                              <div className="col-lg-4 form-group pt-3">
                                <label
                                  className="font-size-12 inter-font-family-400"
                                  htmlFor="pincode"
                                >
                                  Pincode <RequiredStar />
                                </label>
                                <Select
                                  options={pinOptions}
                                  isDisabled={!pinOptions}
                                  getOptionLabel={(option) => {
                                    return option.Pincode;
                                  }}
                                  getOptionValue={(option) => option.value}
                                  value={selectedPin}
                                  onChange={(item) => {
                                    setSelectedPin(item);
                                    setValue("pincode", item); // Update form state
                                  }}
                                  // placeholder="PIN"
                                  className="pin-input py-1"
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }), // Ensure dropdown shows above everything
                                  }}
                                />
                              </div>
                              <div className="col-lg-4 address-section-form form-group pt-3">
                                <label
                                  className="font-size-12 inter-font-family-400"
                                  htmlFor="contactNo"
                                >
                                  Contact No <RequiredStar />
                                </label>
                                <input
                                  type="tel"
                                  inputMode="numeric"
                                  maxLength={10}
                                  className="form-control py-2"
                                  {...register("contactNo", {
                                    required: true,
                                    pattern: {
                                      value: /^[0-9]{10}$/,
                                      message:
                                        "Mobile number must be exactly 10 digits",
                                    },
                                  })}
                                  onKeyPress={(e) => {
                                    // Allow only digits
                                    if (!/[0-9]/.test(e.key)) {
                                      e.preventDefault();
                                    }
                                  }}
                                />
                              </div>
                            </form>
                          </>
                        )}
                      </div>
                      <div
                        className={`mt-5 ${
                          step >= 1 && IsShowAddForm ? "" : "d-none"
                        }`}
                      >
                        <button
                          type="submit"
                          onClick={
                            IsShowAddForm
                              ? handleSubmit(onSubmit)
                              : () => onSubmit()
                          }
                          className={`addToCartModalButton font-size-16 px-5 inter-font-family-500 rounded ${
                            step >= 3 ? "btn disabled" : ""
                          }`}
                        >
                          Proceed with this address
                        </button>
                      </div>

                      {/* <div className={`mt-5 ${step >= 1 ? "" : "d-none"}`}>
                      <button
                        type="submit"
                        className={`addToCartModalButton font-size-16 px-5 inter-font-family-500 rounded`}
                      >
                        Proceed with this address
                      </button>
                    </div> */}
                    </div>
                    {/* <hr
                    className={`vertical-hr vertical-hr-tab ${
                      Paymode ? "payModeBlackScreenLineActive" : ""
                    }`}
                  /> */}
                    {/* payment details */}
                    <div
                      className={`col-lg-4 payment-section AddToCartModal-modal-grid-1 pt-3 ${
                        Paymode ? "payModeBlackScreenActive" : ""
                      } ${mobView ? "pay-mob-view" : ""}`}
                    >
                      <div className="">
                        <span className="address-heading font-size-14 inter-font-family-500">
                          Bill Summary
                        </span>
                        <hr />
                      </div>
                      <div className={`${step >= 2 ? "" : "d-none"}`}>
                        <ul className="pay-process-bill-summary">
                          {cartItems?.map((i, index) => (
                            <li className="d-flex justify-content-between py-2">
                              <span className="login-text font-size-14 inter-font-family-500">
                                {i?.product_name} 
                              </span>
                              <span className="font-size-16 inter-font-family-500">
                                {i.product_price} x Qty {i.product_quantity} x {i.product_weight}kg = ₹ {i.product_price * i.product_quantity * i.product_weight}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <hr className="address-sect-hr" />
                        <ul>
                          <li className="d-flex justify-content-between">
                            <span className="login-text font-size-14 inter-font-family-500">
                              Deliver To:
                            </span>
                            <span
                              data-toggle="tooltip"
                              role="button"
                              title={`${setectedAddress?.address} ${setectedAddress?.houseNo} ${setectedAddress?.pincode} ${setectedAddress?.country} ${setectedAddress?.state} ${setectedAddress?.city} ${setectedAddress?.contactNo}`}
                              className="font-size-16 inter-font-family-500 text-truncate w-75 "
                            >
                              {`${setectedAddress?.address} ${setectedAddress?.houseNo} ${setectedAddress?.pincode} ${setectedAddress?.country} ${setectedAddress?.state} ${setectedAddress?.city} ${setectedAddress?.contactNo}`}
                            </span>
                          </li>
                          {/* <li className="d-flex justify-content-between  py-3">
                          <span className="login-text font-size-14 inter-font-family-500 d-flex align-items-center">
                            Coupon Code
                          </span>
                          <div className="background-color-add-modal apply-coupon p-2  rounded">
                            <input
                              className="coupon-input"
                              type="text"
                              name=""
                              id=""
                            />{" "}
                            <button className=" background-color-terracotta text-white border-0 rounded py-1 font-size-12 inter-font-family-500 px-3">
                              Apply
                            </button>
                          </div>
                        </li> */}
                          <li className="d-flex justify-content-between py-2">
                            <span className="login-text font-size-14 inter-font-family-500">
                              Sub Total:
                            </span>
                            <span className="font-size-16 inter-font-family-500">
                              ₹ {totalPrice}
                            </span>
                          </li>
                          <li className="d-flex justify-content-between py-2">
                            <span className="login-text font-size-14 inter-font-family-500">
                              Tax:
                            </span>
                            <span className="font-size-16 inter-font-family-500">
                              ₹ 00.00
                            </span>
                          </li>
                        </ul>
                        <hr />
                        <div className=" d-flex justify-content-around align-item-center">
                          <span className="font-size-24 inter-font-family-500 d-flex justify-content-around align-items-center">
                            ₹ {totalPrice}
                          </span>
                          <button
                            onClick={handleCheckOut}
                            className="btn payment-section-button-active text-white font-size-16 inter-font-family-500 px-5"
                          >
                            Paynow
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* <hr
                    className={`vertical-hr-tab vertical-hr ${
                      Paymode ? "" : "d-none"
                    }`}
                  /> */}
                    {/* Paymode section */}
                    
                  </div>
                </div>
              </Modal.Body>
            </div>
          </Modal>
        ) : (
          <Modal
            show={showModal}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            dialogClassName="custom-modal-width "
          >
            <Modal.Header
              closeButton
              className="background-color-light-grayish-yellow border-0 text-center"
            >
              <Modal.Title>Your cart is empty !</Modal.Title>
            </Modal.Header>
            <Modal.Body className="background-color-light-grayish-yellow">
              <div className="background-color-light-grayish-yellow">
                <img src={CardEmpty} alt="Loading" className="img-fluid" />
              </div>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </>
  );
};

export default AddToCartProccess;
