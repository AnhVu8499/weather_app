import React, { useEffect, useState } from "react";
import "./styles.css"; // Import the common styles for rain and snow

const Rain = ({ className = "" }) => {  // Accept className as a prop
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const generateElements = () => {
      let newElements = [];
      for (let i = 0; i < 100; i++) {
        const randomLeft = Math.floor(Math.random() * 100); // Random horizontal position
        const randomDelay = Math.random() * 5; // Random animation delay
        const randomDuration = Math.random() * 2 + 2; // Random animation duration (between 2s and 4s)
        newElements.push(
          <div
            className={className ? `${className} drop` : "drop"} // Add the custom class (snowing)
            style={{
              left: `${randomLeft}%`,
              animationDelay: `${randomDelay}s`,
              animationDuration: `${randomDuration}s`,
              opacity: Math.random(), // Random opacity for a more natural look
            }}
            key={i}
          >
            <div className="stem"></div>
            <div className="splat"></div>
          </div>
        );
      }
      setElements(newElements);
    };

    generateElements();
  }, [className]); // Re-generate the elements if className changes

  return <div className={className ? `${className} rain` : "rain"}>{elements}</div>;
};

export default Rain;
