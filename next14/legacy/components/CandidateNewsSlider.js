import React, { useEffect, useState } from "react";
import { getSuccessNotification } from "../services/info.service";
function CandidateNewsSlider() {
  const [notifications, setNotifications]=useState([])
  const getSuccessNotificationFunc = async () => {
    try {
      let response = await getSuccessNotification();
      setNotifications(response?.notifications)
    } catch (error) {}
  };
  useEffect(()=>{
    getSuccessNotificationFunc()
  },[])
  // Function to insert <br> tags after every 3 words
function insertBreaks(message) {
  if (!message) return ""; // Handle edge case if message is empty or undefined

  // Split the message into words
  const words = message.split(" ");

  // Initialize an array to hold parts of the message with breaks
  let messageWithBreaks = [];

  // Loop through words and add breaks after every 3 words
  for (let i = 0; i < words.length; i++) {
    messageWithBreaks.push(words[i]); // Push current word

    // If current word is the third word or a multiple of 3 (excluding the first word)
    if ((i + 1) % 4 === 0 && i !== 0) {
      messageWithBreaks.push(<br key={i} />); // Push a <br> tag with a unique key
    } else if (i !== words.length - 1) {
      messageWithBreaks.push(" "); // Add a space between words (excluding after last word)
    }
  }

  // Join the array into a string
  return messageWithBreaks;
}
  return (
    <div className="scroll-container  py-md-5">
      <div className="scroll-content d-flex py-5">
        {notifications.map((v, i) => (
          <div
            key={i}
            style={{ borderRadius: "40px", background: "white" }}
            className="d-flex align-items-center notification-item border shadow  px-4 py-3 mx-4"
          >
            <img
              style={{ height: "45px", width: "45px", borderRadius: "50%" }}
              src={v?.empPhoto=="https://overseas.ai/placeholder/person.jpg" ? "/images/person.jpg" : v?.empPhoto}
              alt="Profile"
            />
            <p
              className="mb-0 text-secondary ms-2"
              style={{fontSize:"13px", textAlign:"justify"}}
            >
              {insertBreaks(v?.fullMessage)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CandidateNewsSlider;
