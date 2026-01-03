import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/products"); 
    }, 5000); 

    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <div>
      <div className="payment-fail d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div class="check_mark">
                <div class="sa-icon sa-error animate">
                  <span class="sa-line sa-tip animateErrorTip"></span>
                  <span class="sa-line sa-long animateErrorLong"></span>
                  <div class="sa-placeholder"></div>
                  <div class="sa-fix"></div>
                </div>
              </div>
              <div className="text-center py-2">
                <p className="fs-2 fw-bold">Payment Failed</p>
                {/* <button className="px-5 py-2 fw-bold border rounded-pill bg-danger text-light">Try Again</button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailed
