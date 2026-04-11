import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  delay?: number;
  active?: boolean;
  className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  delay = 30, 
  active = false,
  className = "" 
}) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    if (active) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, delay);
      return () => clearInterval(interval);
    } else {
      setDisplayedText(""); // Reset
    }
  }, [active, text, delay]);

  return <span className={className}>{displayedText}</span>;
};
