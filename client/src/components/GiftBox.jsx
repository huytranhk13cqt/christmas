/**
 * GiftBox Component
 *
 * Hiển thị hộp quà với animation mở ra reveal ảnh bên trong
 */

import { useState, useEffect } from "react";
import "./GiftBox.css";

function GiftBox({ imageUrl, isOpen }) {
  const [animationPhase, setAnimationPhase] = useState("closed");

  useEffect(() => {
    if (isOpen) {
      // Phase 1: Shake (lắc hộp)
      setAnimationPhase("shaking");

      // Phase 2: Open lid (mở nắp)
      setTimeout(() => {
        setAnimationPhase("opening");
      }, 800);

      // Phase 3: Reveal (hiện ảnh)
      setTimeout(() => {
        setAnimationPhase("revealed");
      }, 1500);
    } else {
      setAnimationPhase("closed");
    }
  }, [isOpen]);

  return (
    <div className={`gift-box-container ${animationPhase}`}>
      {/* Hiệu ứng sparkle */}
      <div className="sparkles">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`sparkle sparkle-${i + 1}`}>
            ✨
          </div>
        ))}
      </div>

      {/* Hộp quà */}
      <div className="gift-box-3d">
        {/* Nắp hộp */}
        <div className="lid">
          <div className="lid-front"></div>
          <div className="lid-top"></div>
          <div className="lid-ribbon"></div>
          <div className="bow">
            <div className="bow-left"></div>
            <div className="bow-right"></div>
            <div className="bow-center"></div>
            <div className="bow-tail-left"></div>
            <div className="bow-tail-right"></div>
          </div>
        </div>

        {/* Thân hộp */}
        <div className="box">
          <div className="box-front">
            <div className="ribbon-v"></div>
          </div>
          <div className="box-back"></div>
          <div className="box-left"></div>
          <div className="box-right"></div>
          <div className="box-bottom"></div>

          {/* Ảnh bên trong */}
          <div className="box-content">
            <div className="photo-frame">
              <img src={imageUrl} alt="Your Gift" className="gift-image" />
            </div>
          </div>
        </div>
      </div>

      {/* Message khi revealed */}
      {animationPhase === "revealed" && (
        <div className="reveal-message">
          <h2>🎉 Surprise! 🎉</h2>
          <p>Đây là món quà dành cho bạn!</p>
        </div>
      )}
    </div>
  );
}

export default GiftBox;
