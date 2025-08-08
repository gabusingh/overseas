import React, { useState, useEffect } from "react";
import { getNewsFeedData } from "../services/info.service";
import moment from "moment";
function NewsSlider() {
  const [newsArr, setNewsArr] = useState([]);
  const getNewsDataFunc = async () => {
    try {
      let response = await getNewsFeedData();
      setNewsArr(response?.data?.newsData);
    } catch (error) {}
  };
  useEffect(() => {
    getNewsDataFunc();
  }, []);
  return (
    <div
      style={{ background: "#F4F2F6" }}
      className="vh-100 align-items-center d-flex"
    >
      <div className="container">
        <h1 className="subHeading text-center">
          Stay Updated With Migrants News
        </h1>
        <div className="row mx-lg-3 my-5 py-3">
          <div className="col-md-8 d-none d-md-block">
            <div
              id="carouselExampleCaptions"
              className="carousel slide  vh50"
              data-bs-ride="carousel "
              
            >
              <div className="carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to={0}
                  className="active"
                  aria-current="true"
                  aria-label="Slide 1"
                />
                <button
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to={1}
                  aria-label="Slide 2"
                />
                <button
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to={2}
                  aria-label="Slide 3"
                />
              </div>
              <div className="carousel-inner vh50">
                <div className="carousel-item active">
                  <img
                    src={newsArr[0]?.image}
                    className="d-block w-100 vh50"
                    alt="News Slider"
                  />
                 
                </div>
                <div className="carousel-item">
                  <img
                   src={newsArr[1]?.image}
                    className="d-block w-100 vh50"
                    alt="News Slider"
                  />
                  
                </div>
                <div className="carousel-item">
                  <img
                    src={newsArr[2]?.image}
                    className="d-block w-100 vh50"
                    alt="News Slider"
                  />
                  
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Next</span>
              </button>
            </div>
            <div className="d-flex justify-content-center mt-5">
              <button className="btn btn-primary" style={{ width: "200px" }}>
                View All
              </button>
            </div>
          </div>
          <div className="col-md-4 custom-scrollbar">
            {newsArr?.map((v, i) => (
              <div key={i}>
                <img src={v?.image} className="img-fluid" alt="Post" />
                <p className="text-secondary mb-1">
                  <b>{moment(v?.Date).format("DD MMMM YYYY")}</b>
                </p>
                <h5 className="mb-3">{v?.ArticleTitle}</h5>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsSlider;
