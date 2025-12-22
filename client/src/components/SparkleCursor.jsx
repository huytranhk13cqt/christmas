/**
 * SparkleCursor Component
 *
 * Hiệu ứng sparkle theo con trỏ chuột
 */

import { useState, useEffect, useCallback } from "react";
import "./SparkleCursor.css";

function SparkleCursor() {
  const [sparkles, setSparkles] = useState([]);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const createSparkle = useCallback((x, y) => {
    const sparkle = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: Math.random() * 15 + 8,
      rotation: Math.random() * 360,
      emoji: ["✨", "⭐", "💫", "🌟", "✦", "★"][Math.floor(Math.random() * 6)],
    };

    setSparkles((prev) => [...prev.slice(-20), sparkle]); // Keep only last 20 sparkles

    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== sparkle.id));
    }, 1000);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only create sparkle if mouse moved enough
    if (distance > 30) {
      createSparkle(e.clientX, e.clientY);
      setLastPos({ x: e.clientX, y: e.clientY });
    }
  }, [lastPos, createSparkle]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="sparkle-cursor-container">
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="cursor-sparkle"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            fontSize: `${sparkle.size}px`,
            transform: `translate(-50%, -50%) rotate(${sparkle.rotation}deg)`,
          }}
        >
          {sparkle.emoji}
        </span>
      ))}
    </div>
  );
}

export default SparkleCursor;
