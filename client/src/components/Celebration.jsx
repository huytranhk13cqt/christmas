/**
 * Celebration Component
 *
 * Hiệu ứng confetti và pháo hoa khi mở quà xong
 * Prop hideMessage để ẩn message khi cần (ví dụ khi đang xem ảnh quà)
 */

import { useState, useEffect, useCallback } from "react";
import "./Celebration.css";

function Celebration({ isActive, hideMessage = false, recipientName = "Em yêu" }) {
  const [confetti, setConfetti] = useState([]);
  const [fireworks, setFireworks] = useState([]);

  // Generate confetti
  const generateConfetti = useCallback(() => {
    const pieces = [];
    const colors = [
      "#ff0000",
      "#00ff00",
      "#ffd700",
      "#ff69b4",
      "#00bfff",
      "#ff6347",
      "#9370db",
      "#ffa500",
    ];
    const shapes = ["square", "circle", "triangle", "star"];

    for (let i = 0; i < 100; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
        delay: Math.random() * 3,
        duration: Math.random() * 3 + 4,
        swayAmount: Math.random() * 100 - 50,
      });
    }
    setConfetti(pieces);
  }, []);

  // Generate fireworks
  const generateFireworks = useCallback(() => {
    const rockets = [];
    const colors = ["#ff0000", "#ffd700", "#00ff00", "#ff69b4", "#00bfff"];

    for (let i = 0; i < 6; i++) {
      const particles = [];
      for (let j = 0; j < 16; j++) {
        particles.push({
          id: j,
          angle: (360 / 16) * j,
          distance: Math.random() * 40 + 25,
        });
      }

      rockets.push({
        id: i,
        x: 10 + Math.random() * 80,
        y: 15 + Math.random() * 35,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        particles,
      });
    }
    setFireworks(rockets);
  }, []);

  // Trigger celebration
  useEffect(() => {
    if (isActive) {
      generateConfetti();
      generateFireworks();

      // Regenerate effects periodically
      const confettiInterval = setInterval(() => {
        generateConfetti();
      }, 5000);

      const fireworkInterval = setInterval(() => {
        generateFireworks();
      }, 3500);

      return () => {
        clearInterval(confettiInterval);
        clearInterval(fireworkInterval);
      };
    } else {
      setConfetti([]);
      setFireworks([]);
    }
  }, [isActive, generateConfetti, generateFireworks]);

  if (!isActive) return null;

  return (
    <div className="celebration-container">
      {/* Confetti */}
      <div className="confetti-container">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className={`confetti-piece ${piece.shape}`}
            style={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              backgroundColor: piece.color,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              transform: `rotate(${piece.rotation}deg)`,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              "--sway": `${piece.swayAmount}px`,
            }}
          />
        ))}
      </div>

      {/* Fireworks */}
      <div className="fireworks-container">
        {fireworks.map((rocket) => (
          <div
            key={rocket.id}
            className="firework"
            style={{
              left: `${rocket.x}%`,
              top: `${rocket.y}%`,
              animationDelay: `${rocket.delay}s`,
            }}
          >
            {/* Explosion particles */}
            <div className="explosion">
              {rocket.particles.map((particle) => (
                <div
                  key={particle.id}
                  className="particle"
                  style={{
                    backgroundColor: rocket.color,
                    transform: `rotate(${particle.angle}deg) translateY(-${particle.distance}px)`,
                    boxShadow: `0 0 6px ${rocket.color}, 0 0 12px ${rocket.color}`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sparkles overlay - luôn hiện */}
      <div className="sparkles-overlay">
        {[...Array(15)].map((_, i) => (
          <span
            key={i}
            className="sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            ✨
          </span>
        ))}
      </div>
    </div>
  );
}

export default Celebration;
