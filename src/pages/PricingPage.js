import React from "react";

function PricingPage() {
  const pricingArr = [
    {
      heading: "Free",
    },
    {
      heading: "Basic",
    },
    {
      heading: "Standard",
    },
  ];
  return (
    <div className="container marginNavTop">
      <div className="row">
        <div className="col-4">
          <div className="pageHeading mb-4">
            <h2 className="textBlue mb-4">
              Pricing - Apply for Jobs with a Premium Plan
            </h2>
            <h4 className="text-secondary " style={{ textAlign: "justify" }}>
              Welcome to our Job Portal Pricing Page! We’re committed to helping
              you find your dream job by giving you access to the best
              opportunities. To streamline your application process, we offer an
              affordable, transparent pricing model.
            </h4>
            <button className="btn btn-primary bgBlue w-100 mt-4">
              Payout
            </button>
            <div className="d-flex justify-content-center">
              <img src="/images/fullMobileNew.png" className="img-fluid" />
            </div>
          </div>
        </div>

        <div className="row col-8 m-0 p-0 d-flex justify-content-center">
          <div className=" col-12">
            <div className="my-2 border rounded p-4">
              <h5>Unlock Your Career with Just ₹99</h5>
              <p>
                For a one-time payment of ₹99, you gain access to premium job
                applications. With this plan, you can apply for up to 10 jobs of
                your choice across various industries.
              </p>
            </div>
          </div>
          <div className=" col-12">
            <div className="my-2 border rounded p-4">
              <h5>Plan Overview</h5>
              <p>
                Plan Name: Standard Job Application Package <br />
                Price: ₹99 <br />
                Validity: No expiration – use your applications anytime! <br />
                Job Application Limit: 10 applications per package <br />
                Additional Features: <br />
                Full access to all job listings and categories <br />
                Track your applications through your personal dashboard <br />
                Prioritized support for any application issues <br />
                100% Refund Guarantee – If rejected by an employer, your payment
                will be refunded <br />
              </p>
            </div>
          </div>
          <div className="col-12">
            <div className="my-2 border rounded p-4">
              <h5>Why Pay for Job Applications?</h5>
              <p>
                The ₹99 package ensures that only serious applicants apply,
                enhancing the quality of candidates and employer responses. This
                small fee helps us maintain a high-quality platform with
                verified job listings and genuine employers.
              </p>
            </div>
          </div>
          <div className=" col-12">
            <div className="my-2 border rounded p-4">
              <h5>100% Refund Guarantee – Apply Risk-Free</h5>
              <p>
                We understand that job hunting can be challenging. That’s why we
                offer a full refund for applications if you are rejected by the
                employer. Your payment will be credited back to your account
                without any hassle.
              </p>
              <p>
                Refund Process: <br />
                If your application is rejected, the refund will be initiated
                automatically. <br />
                Refunds will reflect in your original payment method within 15
                business days. <br />
                No questions asked!
              </p>
            </div>
          </div>
          <div className=" col-12">
            <div className="my-2 border rounded p-4">
              <h5>How It Works</h5>
              <p>
                Browse Jobs: Explore thousands of active job listings.
                <br />
                Purchase the Package: Pay ₹99 to unlock 10 applications.
                <br />
                Apply for Jobs: Use your package to apply for up to 10 jobs.
                
                <br />
                Monitor Your Progress: Track all your applications through your
                dashboard.
                <br />
              </p>
            </div>
          </div>
          <div className=" col-12">
            <div className="my-2 border rounded p-4">
              <h5>What Happens After Using 10 Applications?</h5>
              <p>
                If you’ve used all 10 applications, you can purchase another ₹99
                package to apply for more jobs. There is no limit to how many
                packages you can buy.
              </p>
            </div>
          </div>
          <div className=" col-12">
            <div className="my-2 border rounded p-4">
              <h5>Payment Methods</h5>
              <p>
                We accept the following payment options: <br />
                Credit/Debit Cards
                <br />
                UPI & Net Banking
                <br />
                Mobile Wallets (Paytm, Google Pay, PhonePe, etc.)
                <br />
              </p>
            </div>
          </div>
          <div className=" col-12">
            <div className="my-2 border rounded p-4">
              <h5>Why Choose Us?</h5>
              <p>
                Affordable Pricing: ₹99 for 10 applications <br />
                
                Verified Opportunities: Genuine job listings with real employers{" "}
                <br />
                Convenient Tracking: Easily monitor your applications through
                the dashboard <br />
              </p>
            </div>
          </div>
          <div className=" col-12">
            <div className="my-2 border rounded p-4">
              <h5>Need Help?</h5>
              <p>
                If you have any questions about the package or refund process,
                please contact our support team. We’re here to assist you at
                every step of the way.
              </p>
            </div>
          </div>
          <div className=" col-12">
            <div className="my-2 border rounded p-4">
              <h5>Get Started Today!</h5>
              <p>
                Don’t wait—purchase your Job Application Package now for ₹99 and
                unlock 10 job applications. With our refund policy, there’s zero
                risk in applying. Take the first step toward building your
                career today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
