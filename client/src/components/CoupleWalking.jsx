/**
 * CoupleWalking Component
 *
 * Mini animation của cặp đôi đang đi bộ
 * Hiển thị ở góc màn hình, tự động chạy như một mini game
 */

import { useState, useEffect, useCallback } from "react";
import "./CoupleWalking.css";

function CoupleWalking() {
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [isMinimized, setIsMinimized] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

  // Auto walking animation
  useEffect(() => {
    if (isMinimized) return;

    const walkInterval = setInterval(() => {
      setPosition((prev) => {
        const newPos = prev + direction * 2;

        // Change direction at boundaries
        if (newPos >= 200) {
          setDirection(-1);
          return 200;
        }
        if (newPos <= 0) {
          setDirection(1);
          return 0;
        }

        return newPos;
      });
    }, 50);

    return () => clearInterval(walkInterval);
  }, [direction, isMinimized]);

  // Generate floating hearts periodically
  useEffect(() => {
    if (isMinimized) return;

    const heartInterval = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        x: Math.random() * 60 + 20,
      };
      setHearts((prev) => [...prev.slice(-5), newHeart]);

      // Remove heart after animation
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 2000);
    }, 3000);

    return () => clearInterval(heartInterval);
  }, [isMinimized]);

  // Toggle message periodically
  useEffect(() => {
    if (isMinimized) return;

    const messageInterval = setInterval(() => {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }, 8000);

    // Show first message after 2 seconds
    const initialTimeout = setTimeout(() => {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }, 2000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(initialTimeout);
    };
  }, [isMinimized]);

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  // Cute messages
  const messages = [
    "Anh yêu em! 💕",
    "Merry Christmas! 🎄",
    "Em là số 1! ⭐",
    "Mãi bên nhau! 💑",
  ];

  const randomMessage = messages[Math.floor(Date.now() / 8000) % messages.length];

  if (isMinimized) {
    return (
      <div className="couple-minimized" onClick={toggleMinimize}>
        <span className="couple-icon">💑</span>
        <span className="couple-hint">Couple</span>
      </div>
    );
  }

  return (
    <div className="couple-walking-container">
      {/* Header */}
      <div className="couple-header">
        <span className="couple-title">💑 Chúng mình</span>
        <button className="couple-minimize-btn" onClick={toggleMinimize}>
          −
        </button>
      </div>

      {/* Scene */}
      <div className="walking-scene">
        {/* Background elements */}
        <div className="scene-bg">
          <div className="bg-tree tree-1">🎄</div>
          <div className="bg-tree tree-2">🌲</div>
          <div className="bg-star">⭐</div>
          <div className="bg-moon">🌙</div>
        </div>

        {/* Snow */}
        <div className="scene-snow">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="mini-snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 3}s`,
              }}
            />
          ))}
        </div>

        {/* Couple */}
        <div
          className="couple-characters"
          style={{
            transform: `translateX(${position}px) scaleX(${direction})`,
          }}
        >
          {/* Boy */}
          <div className="character boy">
            <div className="santa-hat">🎅</div>
            <div className="char-body">👦</div>
          </div>

          {/* Heart between */}
          <div className="heart-link">💕</div>

          {/* Girl */}
          <div className="character girl">
            <div className="santa-hat">🤶</div>
            <div className="char-body">👧</div>
          </div>

          {/* Message bubble */}
          {showMessage && (
            <div
              className="message-bubble"
              style={{ transform: `scaleX(${direction})` }}
            >
              {randomMessage}
            </div>
          )}
        </div>

        {/* Floating hearts */}
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="floating-heart"
            style={{ left: `${heart.x}%` }}
          >
            ❤️
          </div>
        ))}

        {/* Ground */}
        <div className="snow-ground-walk"></div>

        {/* Footprints */}
        <div className="footprints">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="footprint"
              style={{
                left: `${(position - i * 30 + 280) % 280}px`,
                opacity: 1 - i * 0.2,
              }}
            >
              👣
            </div>
          ))}
        </div>
      </div>

      {/* Footer hint */}
      <div className="couple-footer">
        <span>✨ Đang đi dạo cùng nhau ✨</span>
      </div>
    </div>
  );
}

export default CoupleWalking;
