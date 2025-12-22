/**
 * ChristmasLetter Component
 *
 * Lá thư chúc mừng Giáng sinh - Personalized cho người yêu
 * Flow: Phong bì đóng -> Click mở -> Phong bì biến mất -> Thư hiện ra giữa màn hình
 */

import { useState, useEffect } from "react";
import "./ChristmasLetter.css";

function ChristmasLetter({ onClose, recipientName = "Em yêu" }) {
  // States: closed -> opening -> opened (envelope gone, letter visible)
  const [phase, setPhase] = useState("closed");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleEnvelopeClick = () => {
    if (phase === "closed") {
      setPhase("opening");

      // Sau animation mở, chuyển sang hiện thư
      setTimeout(() => {
        setPhase("opened");
      }, 1200);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className={`letter-overlay ${isVisible ? "visible" : ""}`}>
      {/* PHASE 1 & 2: Phong bì (closed & opening) */}
      {phase !== "opened" && (
        <div className="envelope-scene" onClick={handleEnvelopeClick}>
          <div className={`envelope-3d ${phase}`}>
            {/* Phần sau phong bì */}
            <div className="envelope-back"></div>

            {/* Thân phong bì phía trước */}
            <div className="envelope-front">
              <div className="envelope-decoration">🎄</div>
              <div className="envelope-hearts">
                <span>💕</span>
              </div>
            </div>

            {/* Nắp phong bì */}
            <div className="envelope-flap"></div>

            {/* Con dấu trái tim */}
            <div className="envelope-seal">💝</div>
          </div>

          {/* Hint */}
          {phase === "closed" && (
            <div className="envelope-hint">💌 Nhấn để mở thư tình</div>
          )}
        </div>
      )}

      {/* PHASE 3: Lá thư (sau khi phong bì biến mất) */}
      {phase === "opened" && (
        <div className="letter-scene">
          <div className="letter-scroll-container">
            <div className="letter-paper-full">
              {/* Header trang trí */}
              <div className="letter-header-deco">
                <span>💕</span>
                <span>🎄</span>
                <span>⭐</span>
                <span>🎄</span>
                <span>💕</span>
              </div>

              {/* Tiêu đề */}
              <h1 className="letter-main-title">
                Merry Christmas, {recipientName}!
              </h1>

              {/* Nội dung thư - Personalized */}
              <div className="letter-body-content">
                <p className="letter-greeting">
                  Gửi {recipientName} thương yêu,
                </p>

                <p>
                  Lại một Giáng sinh nữa anh và em xa nhau, nhưng với anh em vẫn
                  là món quà tuyệt vời nhất mà anh từng được nhận, không chỉ
                  trong mùa Giáng sinh này mà còn trong cả cuộc đời.
                </p>

                <p>
                  Cảm ơn em vì những nụ cười, những khoảnh khắc hạnh phúc, và cả
                  những lúc bên nhau đơn giản nhưng ấm áp. Em khiến mỗi ngày của
                  anh trở nên ý nghĩa hơn (dậy đúng giờ, ăn đủ bữa, giữ sức
                  khỏe, làm việc hiệu quả ...)
                </p>

                <p>
                  Trong đêm Giáng sinh lung linh này, anh muốn nói với em rằng:
                  <span className="highlight-text">
                    {" "}
                    Anh yêu em nhiều lắm bé múp địt của anh!{" "}
                  </span>
                  Chúc em luôn vui vẻ, bình an và hạnh phúc và một mùa Giáng
                  sinh ấm áp.
                </p>

                <p>
                  Hãy cùng nhau tạo thêm nhiều kỷ niệm đẹp trong năm mới nhé!
                </p>

                <div className="letter-love-quote">
                  <span className="quote-icon">💫</span>
                  <em>"Yêu bé múp địt nách thơm trắng nõn nà nhiều nước..."</em>
                  <span className="quote-icon">💫</span>
                </div>

                <div className="letter-signature-block">
                  <p>Love you so much my baby girl 💕</p>
                  <p className="signature-name">❤️ Coffee Trần ☕❤️</p>
                  <p className="signature-date">Christmas 2025</p>
                </div>
              </div>

              {/* Footer trang trí */}
              <div className="letter-footer-deco">
                <span>🎁</span>
                <span>💝</span>
                <span>🦌</span>
                <span>💝</span>
                <span>🎁</span>
              </div>

              {/* P.S. */}
              <div className="letter-ps">
                <p>P.S: Hãy mở món quà nha, anh chọn riêng cho em đó! 🎀</p>
              </div>
            </div>
          </div>

          {/* Nút đóng */}
          <button className="letter-close-btn" onClick={handleClose}>
            🔄 Chơi Lại
          </button>
        </div>
      )}
    </div>
  );
}

export default ChristmasLetter;
