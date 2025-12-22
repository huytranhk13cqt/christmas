/**
 * CountdownTimer Component
 *
 * Đếm ngược đến ngày Giáng sinh với flip animation
 */

import { useState, useEffect, useRef } from "react";
import "./CountdownTimer.css";

// FlipCard component cho hiệu ứng flip
function FlipCard({ value, label, decoration }) {
  const [flip, setFlip] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setFlip(true);
      const timer = setTimeout(() => setFlip(false), 600);
      prevValue.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  const displayValue = String(value).padStart(2, '0');

  return (
    <div className="time-box">
      <div className={`flip-card ${flip ? 'flipping' : ''}`}>
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <span className="time-value">{displayValue}</span>
          </div>
          <div className="flip-card-back">
            <span className="time-value">{displayValue}</span>
          </div>
        </div>
      </div>
      <div className="time-label">{label}</div>
      <div className="box-decoration">{decoration}</div>
      <div className="card-shine"></div>
    </div>
  );
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isChristmas, setIsChristmas] = useState(false);

  function calculateTimeLeft() {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Giáng sinh năm nay hoặc năm sau nếu đã qua
    let christmas = new Date(currentYear, 11, 25, 0, 0, 0); // 25/12

    // Nếu đã qua Giáng sinh, đếm ngược đến năm sau
    if (now > christmas) {
      christmas = new Date(currentYear + 1, 11, 25, 0, 0, 0);
    }

    const difference = christmas - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Kiểm tra nếu đã đến Giáng sinh
      const now = new Date();
      const isChristmasDay = now.getMonth() === 11 && now.getDate() === 25;
      setIsChristmas(isChristmasDay);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Nếu là ngày Giáng sinh
  if (isChristmas) {
    return (
      <div className="countdown-container christmas-day">
        <div className="christmas-celebration">
          <span className="celebration-emoji">🎄</span>
          <h2>Merry Christmas!</h2>
          <span className="celebration-emoji">🎁</span>
        </div>
        <p className="christmas-message">Chúc mừng Giáng sinh an lành!</p>
      </div>
    );
  }

  return (
    <div className="countdown-container">
      <h3 className="countdown-title">
        <span className="title-icon">⏰</span>
        <span className="title-text">Đếm ngược đến Giáng sinh</span>
        <span className="title-icon">🎄</span>
      </h3>

      <div className="countdown-boxes">
        <FlipCard value={timeLeft.days} label="Ngày" decoration="❄️" />
        <div className="time-separator">:</div>
        <FlipCard value={timeLeft.hours} label="Giờ" decoration="🌟" />
        <div className="time-separator">:</div>
        <FlipCard value={timeLeft.minutes} label="Phút" decoration="🎀" />
        <div className="time-separator">:</div>
        <FlipCard value={timeLeft.seconds} label="Giây" decoration="✨" />
      </div>

      <div className="countdown-footer">
        <span className="footer-santa">🎅</span>
        <span className="footer-text">Santa đang trên đường đến!</span>
        <span className="footer-reindeer">🦌</span>
      </div>
    </div>
  );
}

export default CountdownTimer;
