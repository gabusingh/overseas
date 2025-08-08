import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function SearchComponent({ fullWidth }) {
  const [searchKey, setSearchKey] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setSearchKey(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.error("Sorry, your browser does not support the Web Speech API.");
    }
  }, []);

  const handleSearchNavigate = () => {
    const formattedSearchKey = searchKey.trim().replace(/\s+/g, "-");
    if(formattedSearchKey.length>0){

      navigate("/jobs/" + formattedSearchKey);
    }
  };

  const handleMicClick = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
  };

  return (
    <div className="row col-12 justify-content-center justify-content-md-start ms-1">
      <div
        className={
          "col-lg-8  d-flex justify-content-between p-2 bg-light " 
          
        }
        style={{ borderRadius: "30px" }}
      >
        <input
          className="ms-2 bg-light"
          placeholder="Search jobs"
          style={{ width: "70%", border: "none", outline: "none" }}
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />

        <div className="d-flex align-items-center">
          <button
            className={"btn btn-primary bgBlue "+( searchKey.length==0 && " disabled")}
            style={{ border: "none" }}
            onClick={handleSearchNavigate}
          >
            Search
          </button>

          <div
            className="ms-2 shadow"
            style={{
              height: "45px",
              width: "45px",
              border: "1px solid #17487F",
              background: "#F6F6F6",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={handleMicClick}
          >
            <h2 className="mb-0">
              <i className={`fa fa-microphone${isListening ? " text-success" : ""}`}></i>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchComponent;
