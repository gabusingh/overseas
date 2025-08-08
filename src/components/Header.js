import React from "react";
import Navbar from "./Navbar";
import { useState } from "react";
import Slider from "react-slick";
function Header() {
  const[showLangPopup, setShowLangPopup]=useState(false);
  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 6500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear', 
    responsive: [
      {
        breakpoint: 1024, // screen width up to 1024px (tablet)
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600, // screen width up to 600px (mobile)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className=" fixed-top ">
      <div className="bgBlue w-100 d-md-flex d-sm-none d-none py-2 justify-content-between px-3" >
        <div className="d-flex align-items-center">
          <h6 className="mb-0 ">
           <a href="https://www.facebook.com/overseasdreamjobs" target="_blank"><i className="fa fa-facebook bg-light textBlue rounded py-1 px-2 me-3" /></a> 
          </h6>
          <h6 className="mb-0">
            <a href="https://www.linkedin.com/company/findoverseasjobs/?originalSubdomain=in"  target="_blank"><i className="fa fa-linkedin bg-light textBlue rounded py-1 px-2 me-3" /></a>
            
          </h6>
          <h6 className="mb-0">
            <a href="https://www.whatsapp.com/channel/0029Va4DQ0VBA1esJwF9Hi0s" target="_blank"><i className="fa fa-whatsapp bg-light textBlue rounded py-1 px-2 me-3" /></a>
            
          </h6>
          <h6 className="mb-0">
            <a href="https://www.youtube.com/channel/UCbmM6NPRf89yYh5AAy0kuVg" target="_blank"><i className="fa fa-youtube bg-light textBlue rounded py-1 px-2 me-3" /></a>
            
          </h6>
          <h6 className="mb-0">
            <a href="tel:18008904788" style={{textDecoration:"none"}}>
            <span className=" bg-light textBlue rounded py-1 px-2 me-3">
              1800 890 4788
            </span>
            </a>
            
          </h6>
        </div>
        <div className="d-flex align-items-center">
          <h6
            className=" mb-0"
          >
            <span className=" bg-light textBlue rounded py-1 px-2 ">
            <a
              className="textBlue text-decoration-none"
              href="https://play.google.com/store/apps/details?id=ai.overseas"
              target="blank"
            >
              Download App
            </a>
            </span>
            
          </h6>
          <h6 className="mb-0">
          {/* <i className="fa fa-language bg-light textBlue rounded py-1 px-2 ms-3" onClick={()=>setShowLangPopup(true)}/> */}
          </h6>
        </div>
      </div>
      <Navbar />
      {/* <div className="bgBlue w-100  py-2 text-dark justify-content-between px-3">
        <Slider {...settings}>
        {[1, 2, 3, 4, 5].map((v, i)=>{
          return(
            <span className="text-light">Hello world {v}</span>
          )
        })}
        </Slider>
      </div> */}
      {showLangPopup && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-between">
                  <h5 className="modal-title">Select Language</h5>
                  <button
                    type="button"
                    className="btn "
                    onClick={() => setShowLangPopup(false)}
                  >
                    <i className="fa fa-close"></i>
                  </button>
                </div>

                <div className="modal-body row">
                  
                  {["English", "Hindi", "Bengali"].map((v, i) => {
                    return (
                      <div className="col-12">
                        <div
                          className="dropDownItemHover mb-md-2 mb-1 p-3 d-flex align-items-center"
                          style={{ cursor: "pointer" }}
                        >
                          <p className="mb-0" style={{ fontSize: "13px" }}>
                            {v}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {showLangPopup && <div className="modal-backdrop fade show"></div>}
        </>
      )}
    </div>
    
  );
}

export default Header;
