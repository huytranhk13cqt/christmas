/**
 * WelcomeGuide Component
 *
 * Màn hình chào mừng và hướng dẫn sử dụng
 * Hiển thị ngay khi mở web để giới thiệu các tính năng
 */

import { useState, useEffect } from "react";
import "./WelcomeGuide.css";

const FEATURES = [
  {
    icon: "🎵",
    title: "Nhạc Giáng sinh",
    description: "Nhấn vào nút 🎵 góc phải trên để bật nhạc nền lãng mạn",
    tip: "Có thể chuyển bài và điều chỉnh âm lượng",
  },
  {
    icon: "🔮",
    title: "Snow Globe",
    description: "Quả cầu tuyết tương tác ở góc trái dưới màn hình",
    tip: "Click để lắc • Double-click để đổi scene • Kéo để xoay",
  },
  {
    icon: "💑",
    title: "Couple Walking",
    description: "Cặp đôi dễ thương đang đi dạo ở góc phải dưới",
    tip: "Xem tin nhắn tình yêu xuất hiện ngẫu nhiên",
  },
  {
    icon: "⏰",
    title: "Đếm ngược",
    description: "Xem còn bao lâu nữa đến Giáng sinh!",
    tip: "Đặc biệt khi đến ngày 25/12",
  },
  {
    icon: "🎁",
    title: "Mở quà",
    description: "Chọn một hộp quà và khám phá điều bất ngờ",
    tip: "Có 2 chế độ: Thẻ cào hoặc Hộp quà 3D",
  },
  {
    icon: "💌",
    title: "Thư tình",
    description: "Sau khi mở quà sẽ có thư tình đặc biệt dành riêng cho em",
    tip: "Nhấn vào phong bì để mở thư",
  },
];

function WelcomeGuide({ recipientName = "Em yêu", onComplete }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Fade in sau một chút
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleNext = () => {
    if (currentStep < FEATURES.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  return (
    <div className={`welcome-overlay ${isVisible ? "visible" : ""} ${isExiting ? "exiting" : ""}`}>
      {/* Decorative snowflakes */}
      <div className="welcome-snow">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="snow-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 4}s`,
            }}
          >
            ❄
          </span>
        ))}
      </div>

      <div className="welcome-container">
        {/* Header */}
        <div className="welcome-header">
          <div className="welcome-decoration">
            <span>🎄</span>
            <span>⭐</span>
            <span>🎄</span>
          </div>
          <h1 className="welcome-title">Merry Christmas!</h1>
          <p className="welcome-subtitle">
            Xin chào <span className="recipient-name">{recipientName}</span>
          </p>
          <p className="welcome-intro">
            Đây là món quà đặc biệt anh dành riêng cho em.
            Hãy khám phá những điều thú vị nhé!
          </p>
        </div>

        {/* Feature Cards - Carousel */}
        <div className="features-carousel">
          <div className="carousel-container">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className={`feature-card ${index === currentStep ? "active" : ""} ${
                  index < currentStep ? "passed" : ""
                } ${index > currentStep ? "upcoming" : ""}`}
                style={{
                  transform: `translateX(${(index - currentStep) * 110}%)`,
                  opacity: index === currentStep ? 1 : 0.3,
                  scale: index === currentStep ? "1" : "0.85",
                }}
              >
                <div className="card-icon">{feature.icon}</div>
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-description">{feature.description}</p>
                <div className="card-tip">
                  <span className="tip-icon">💡</span>
                  <span>{feature.tip}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Navigation */}
          <div className="carousel-nav">
            <button
              className="nav-btn prev"
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              ◀
            </button>

            <div className="carousel-dots">
              {FEATURES.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentStep ? "active" : ""}`}
                  onClick={() => setCurrentStep(index)}
                />
              ))}
            </div>

            <button
              className="nav-btn next"
              onClick={handleNext}
              disabled={currentStep === FEATURES.length - 1}
            >
              ▶
            </button>
          </div>
        </div>

        {/* Quick Overview - All features */}
        <div className="quick-overview">
          <p className="overview-label">Tất cả tính năng:</p>
          <div className="overview-icons">
            {FEATURES.map((feature, index) => (
              <span
                key={index}
                className={`overview-icon ${index === currentStep ? "active" : ""}`}
                onClick={() => setCurrentStep(index)}
                title={feature.title}
              >
                {feature.icon}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="welcome-actions">
          <button className="skip-btn" onClick={handleSkip}>
            Bỏ qua
          </button>
          <button className="start-btn" onClick={handleStart}>
            <span className="btn-sparkle">✨</span>
            Bắt đầu khám phá
            <span className="btn-sparkle">✨</span>
          </button>
        </div>

        {/* Footer note */}
        <div className="welcome-footer">
          <p>
            <span>❤️</span> Made with love for {recipientName} <span>❤️</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeGuide;
