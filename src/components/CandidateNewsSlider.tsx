"use client";

import React, { useEffect, useState } from "react";
import { getSuccessNotification } from "../services/info.service";

interface Notification {
  id: number;
  empPhoto: string;
  fullMessage: string;
}

function CandidateNewsSlider() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getSuccessNotificationFunc = async () => {
    try {
      const response = await getSuccessNotification();
      setNotifications(response?.notifications || []);
    } catch (error) {
    }
  };

  useEffect(() => {
    getSuccessNotificationFunc();
  }, []);

  // Function to insert <br> tags after every 3 words
  function insertBreaks(message: string): (string | React.ReactElement)[] {
    if (!message) return []; // Handle edge case if message is empty or undefined

    // Split the message into words
    const words = message.split(" ");

    // Initialize an array to hold parts of the message with breaks
    const messageWithBreaks: (string | React.ReactElement)[] = [];

    // Loop through words and add breaks after every 3 words
    for (let i = 0; i < words.length; i++) {
      messageWithBreaks.push(words[i]); // Push current word

      // If current word is the third word or a multiple of 4 (excluding the first word)
      if ((i + 1) % 4 === 0 && i !== 0) {
        messageWithBreaks.push(<br key={i} />); // Push a <br> tag with a unique key
      } else if (i !== words.length - 1) {
        messageWithBreaks.push(" "); // Add a space between words (excluding after last word)
      }
    }

    return messageWithBreaks;
  }

  return (
    <div className="relative overflow-hidden py-8">
      <div className="animate-marquee flex space-x-6 py-5">
        {notifications.map((v, i) => (
          <div
            key={i}
            className="flex items-center bg-white border shadow-md rounded-full px-6 py-4 whitespace-nowrap min-w-max"
          >
            <img
              className="h-12 w-12 rounded-full object-cover flex-shrink-0"
              src={
                v?.empPhoto === "https://overseas.ai/placeholder/person.jpg"
                  ? "/images/person.jpg"
                  : v?.empPhoto
              }
              alt="Profile"
              onError={(e) => {
                e.currentTarget.src = "/images/person.jpg";
              }}
            />
            <p className="text-sm text-gray-600 ml-3 text-justify max-w-xs">
              {insertBreaks(v?.fullMessage)}
            </p>
          </div>
        ))}
        {/* Duplicate for continuous scroll effect */}
        {notifications.map((v, i) => (
          <div
            key={`duplicate-${i}`}
            className="flex items-center bg-white border shadow-md rounded-full px-6 py-4 whitespace-nowrap min-w-max"
          >
            <img
              className="h-12 w-12 rounded-full object-cover flex-shrink-0"
              src={
                v?.empPhoto === "https://overseas.ai/placeholder/person.jpg"
                  ? "/images/person.jpg"
                  : v?.empPhoto
              }
              alt="Profile"
              onError={(e) => {
                e.currentTarget.src = "/images/person.jpg";
              }}
            />
            <p className="text-sm text-gray-600 ml-3 text-justify max-w-xs">
              {insertBreaks(v?.fullMessage)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CandidateNewsSlider;
