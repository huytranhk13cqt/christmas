/**
 * FloatingHearts Component
 *
 * Tạo hiệu ứng trái tim bay lên khi hover
 */

import { useState, useCallback } from "react";
import "./FloatingHearts.css";

function FloatingHearts() {
  const [hearts, setHearts] = useState([]);

  const createHeart = useCallback((e) => {
    const heart = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      emoji: ["💕", "💗", "💖", "💝", "❤️", "💘", "💓"][Math.floor(Math.random() * 7)],
      size: Math.random() * 20 + 15,
      duration: Math.random() * 2 + 2,
    };

    setHearts((prev) => [...prev, heart]);

    // Remove heart after animation
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== heart.id));
    }, heart.duration * 1000);
  }, []);

  return (
    <div className="floating-hearts-container" onMouseMove={createHeart}>
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="floating-heart"
          style={{
            left: heart.x,
            top: heart.y,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
          }}
        >
          {heart.emoji}
        </span>
      ))}
    </div>
  );
}

export default FloatingHearts;
