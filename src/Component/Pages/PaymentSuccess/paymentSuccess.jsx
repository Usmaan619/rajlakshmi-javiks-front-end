import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/products"); 
    }, 5000); 

    return () => clearTimeout(timer); 
  }, [navigate]);
  return (
    <div>
      <div className=" bg-custom-gradient-footer payment border border-black d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div class="success-animation py-2">
                <svg
                  class="checkmark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle
                    class="checkmark__circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    class="checkmark__check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
              <div className="text-center py-2">
                <p className="fs-2 fw-bold">Payment Success full</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
