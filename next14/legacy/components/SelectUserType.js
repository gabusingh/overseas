import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
function SelectUserType() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  return (
    <div className="row col-md-6 col-12 order-md-1 order-2">
      <h1 className="text-light text-center mt-5 mt-md-0">
        <b>
          <u>You can also register as</u>
        </b>
      </h1>
      <div className="col-6 " >
        <div className="my-1 shadow bg-light p-1 rounded text-center" onClick={()=>navigate("/candidate-register")} style={{cursor:"pointer"}}> 
          <img
            src="https://backend.overseas.ai/newfrontend/image/employee-icon.png"
            className="img-fluid"
          />
          <p>
            {" "}
            <b
              className={
                location?.pathname == "/candidate-register" &&
                " text-light bg-dark px-2 rounded"
              }
            >
              Candidate
            </b>
          </p>
        </div>
      </div>
      <div className="col-6 " >
        <div className="my-1 shadow bg-light p-1 rounded text-center" onClick={()=>navigate("/employer-register")} style={{cursor:"pointer"}}>
          <img
            src="https://backend.overseas.ai/newfrontend/image/employer-icon.png"
            className="img-fluid"
          />
          <p>
            {" "}
            <b
              className={
                location?.pathname == "/employer-register" &&
                " text-light bg-dark px-2 rounded"
              }
            >
              Employer
            </b>
          </p>
        </div>
      </div>
      <div className="col-6 " >
        <div className="my-1 shadow bg-light p-1 rounded text-center" onClick={()=>navigate("/institute-register")} style={{cursor:"pointer"}}>
          <img
            src="https://backend.overseas.ai/newfrontend/image/training_home.png"
            className="img-fluid"
          />
          <p>
            {" "}
            <b
              className={
                location?.pathname == "/institute-register" &&
                " text-light bg-dark px-2 rounded"
              }
            >
              Institute
            </b>
          </p>
        </div>
      </div>
      <div className="col-6 " >
        <div className="my-1 shadow bg-light p-1 rounded text-center" onClick={()=>navigate("/partner-register")} style={{cursor:"pointer"}}>
          <img
            src="https://backend.overseas.ai/newfrontend/image/partner_home.png"
            className="img-fluid"
          />
          <p>
            {" "}
            <b
              className={
                location?.pathname == "/partner-register" &&
                " text-light bg-dark px-2 rounded"
              }
            >
              Join As Partner
            </b>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SelectUserType;
