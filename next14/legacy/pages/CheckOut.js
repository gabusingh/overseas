import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation


function CheckOut() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      // Placeholder: Call payment gateway API (Razorpay, Stripe, etc.)
      const paymentSuccess = true; // Simulate a successful payment

      if (paymentSuccess) {
        // toast.success("Payment successful! 🎉");
        navigate("/success"); // Navigate to success page
      } else {
        // toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
    //   toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container marginNavTop">
      <div className="row justify-content-center mb-5">
      <div className="col-4">
          <div className="pageHeading mb-4">
            
            <div className="d-flex justify-content-center">
              <img src="/images/fullMobileNew.png" className="img-fluid" />
            </div>
          </div>
        </div>
        <div className="col-6 border rounded p-4 ">
          <h2 className="text-center textBlue mb-4">Checkout</h2>
          <p className="text-center">
            Unlock 10 job applications for just ₹99!
          </p>
          <p className="text-center">
            100% refund guarantee on rejected applications.
          </p>

          <div className="my-3">
            <h4>Order Summary</h4>
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between">
                <span>Job Application Package</span>
                <span>₹99</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Total</span>
                <strong>₹99</strong>
              </li>
            </ul>
          </div>

          <button
            className={`btn btn-primary bgBlue w-100 mt-4 ${isProcessing ? "disabled" : ""}`}
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Pay ₹99"}
          </button>

          <p className="text-center mt-3">
            <small>
              By proceeding, you agree to our <a href="/terms" target="blank" className="me-1">Terms & Conditions. </a>and
              <a href="/refund-policy" target="blank" className="ms-1"> Refund Policy</a>
            </small>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
