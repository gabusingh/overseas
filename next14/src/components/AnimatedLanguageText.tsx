"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedLanguageTextProps {
  words: Array<{
    text: string;
    language: string;
  }>;
  interval?: number;
  className?: string;
}

const AnimatedLanguageText: React.FC<AnimatedLanguageTextProps> = ({ 
  words, 
  interval = 2500,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={currentIndex}
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.8 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut"
        }}
        className={`inline-block ${className}`}
        style={{
          background: "linear-gradient(45deg, #3B82F6, #8B5CF6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "none"
        }}
      >
        {words[currentIndex].text}
      </motion.span>
    </AnimatePresence>
  );
};

export default AnimatedLanguageText;
