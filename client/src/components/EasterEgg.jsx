/**
 * EasterEgg Component
 *
 * Hiển thị Easter Egg khi click vào title nhiều lần
 */

import { useState, useCallback, useRef } from "react";
import "./EasterEgg.css";

function EasterEgg({ recipientName = "Em yêu" }) {
  const [clickCount, setClickCount] = useState(0);
  const [showEgg, setShowEgg] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const timeoutRef = useRef(null);

  const secretMessages = [
    `${recipientName} ơi, anh yêu em nhiều lắm! 💕`,
    "Em là món quà tuyệt vời nhất của đời anh 🎁",
    "Mỗi ngày bên em là một ngày hạnh phúc ✨",
    "Anh sẽ luôn ở bên em, mãi mãi 💖",
    `${recipientName} là người đặc biệt nhất 🌟`,
  ];

  const handleClick = useCallback(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Show hint after 3 clicks
    if (newCount >= 3 && newCount < 7) {
      setShowHint(true);
    }

    // Trigger Easter Egg at 7 clicks
    if (newCount >= 7) {
      setShowEgg(true);
      setShowHint(false);
      setClickCount(0);
    }

    // Reset click count after 2 seconds of no clicking
    timeoutRef.current = setTimeout(() => {
      setClickCount(0);
      setShowHint(false);
    }, 2000);
  }, [clickCount]);

  const closeEgg = useCallback(() => {
    setShowEgg(false);
  }, []);

  const randomMessage = secretMessages[Math.floor(Math.random() * secretMessages.length)];

  return (
    <>
      {/* Click detector - invisible overlay on title area */}
      <div className="easter-egg-detector" onClick={handleClick}>
        {showHint && (
          <span className="egg-hint">
            {7 - clickCount} lần nữa...
          </span>
        )}
      </div>

      {/* Easter Egg Modal */}
      {showEgg && (
        <div className="easter-egg-modal" onClick={closeEgg}>
          <div className="egg-backdrop"></div>
          <div className="egg-content" onClick={(e) => e.stopPropagation()}>
            {/* Sparkles */}
            <div className="egg-sparkles">
              {[...Array(20)].map((_, i) => (
                <span key={i} className="egg-sparkle">
                  {["✨", "💖", "🌟", "💕", "⭐"][i % 5]}
                </span>
              ))}
            </div>

            {/* Hearts animation */}
            <div className="egg-hearts">
              {[...Array(10)].map((_, i) => (
                <span key={i} className="egg-heart">❤️</span>
              ))}
            </div>

            {/* Main content */}
            <div className="egg-box">
              <div className="egg-emoji">🎄💝🎄</div>
              <h2 className="egg-title">Secret Message!</h2>
              <p className="egg-message">{randomMessage}</p>
              <div className="egg-signature">
                <span>With all my love</span>
                <span className="heart-beat">💗</span>
              </div>
              <button className="egg-close" onClick={closeEgg}>
                Close with 💕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EasterEgg;
