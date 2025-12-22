/**
 * ScratchCard Component
 *
 * Thẻ cào Giáng sinh để reveal món quà
 * Người dùng dùng chuột/ngón tay để cào
 */

import { useRef, useState, useEffect, useCallback } from "react";
import "./ScratchCard.css";

function ScratchCard({ imageUrl, onComplete, onReveal }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Draw Christmas themed scratch surface
  const drawScratchSurface = useCallback((ctx, width, height) => {
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#c41e3a");
    gradient.addColorStop(0.5, "#8b0000");
    gradient.addColorStop(1, "#c41e3a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add sparkle pattern
    ctx.fillStyle = "rgba(255, 215, 0, 0.3)";
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 4 + 2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw snowflakes
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "20px Arial";
    const snowflakes = ["❄", "✨", "⭐", "🌟"];
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * (width - 20);
      const y = Math.random() * (height - 20) + 20;
      ctx.fillText(snowflakes[i % snowflakes.length], x, y);
    }

    // Center text
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 24px 'Mountains of Christmas', cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🎄 Cào để mở quà! 🎁", width / 2, height / 2);
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Wait for container to be rendered
    const initCanvas = () => {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      // Set canvas size based on container
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width || 300;
      canvas.height = rect.height || 220;

      // Reset states
      setIsCompleted(false);
      setScratchPercent(0);
      setShowHint(true);
      setIsScratching(false);

      // Draw scratch surface with Christmas pattern
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      drawScratchSurface(ctx, canvas.width, canvas.height);
    };

    // Small delay to ensure container is properly sized
    const timer = setTimeout(initCanvas, 100);

    return () => clearTimeout(timer);
  }, [imageUrl, drawScratchSurface]);

  // Get position from event
  const getPosition = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  // Reveal all (clear canvas)
  const revealAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    // Fade out animation
    let opacity = 1;
    const fadeOut = setInterval(() => {
      opacity -= 0.08;
      if (opacity <= 0) {
        clearInterval(fadeOut);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (onComplete) {
          setTimeout(() => onComplete(), 500);
        }
      } else {
        ctx.globalAlpha = opacity;
        ctx.globalCompositeOperation = "source-over";
        drawScratchSurface(ctx, canvas.width, canvas.height);
      }
    }, 30);
  }, [onComplete, drawScratchSurface]);

  // Calculate percentage of scratched area
  const calculateScratchPercent = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let transparentPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }

    const percent = (transparentPixels / (pixels.length / 4)) * 100;
    setScratchPercent(percent);

    // Auto reveal when 50% scratched
    if (percent >= 50 && !isCompleted) {
      setIsCompleted(true);
      revealAll();
      if (onReveal) onReveal();
    }
  }, [isCompleted, onReveal, revealAll]);

  // Scratch function
  const scratch = useCallback(
    (e) => {
      if (!isScratching || isCompleted) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const pos = getPosition(e);

      // Draw scratch (erase)
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2);
      ctx.fill();

      // Calculate scratch percentage
      calculateScratchPercent();

      // Hide hint
      if (showHint) setShowHint(false);
    },
    [isScratching, isCompleted, getPosition, showHint, calculateScratchPercent]
  );

  // Event handlers
  const handleStart = useCallback(
    (e) => {
      e.preventDefault();
      setIsScratching(true);
      scratch(e);
    },
    [scratch]
  );

  const handleMove = useCallback(
    (e) => {
      e.preventDefault();
      scratch(e);
    },
    [scratch]
  );

  const handleEnd = useCallback(() => {
    setIsScratching(false);
  }, []);

  return (
    <div className="scratch-card-wrapper">
      <div className="scratch-card-title">
        <span>🎄</span>
        <span>Thẻ cào may mắn</span>
        <span>🎁</span>
      </div>

      <div className="scratch-card-container" ref={containerRef}>
        {/* Gift image underneath */}
        <div className="scratch-card-image">
          <img src={imageUrl} alt="Gift" />
          <div className="gift-revealed-text">
            {isCompleted && <span>🎉 Chúc mừng! 🎉</span>}
          </div>
        </div>

        {/* Scratch canvas on top */}
        <canvas
          ref={canvasRef}
          className={`scratch-canvas ${isCompleted ? "completed" : ""}`}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />

        {/* Hint */}
        {showHint && !isCompleted && (
          <div className="scratch-hint">
            <span className="hint-icon">👆</span>
            <span>Dùng ngón tay hoặc chuột để cào</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="scratch-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(scratchPercent * 2, 100)}%` }}
          />
        </div>
        <span className="progress-text">
          {isCompleted
            ? "✨ Đã mở quà!"
            : `${Math.round(Math.min(scratchPercent * 2, 100))}%`}
        </span>
      </div>

      {/* Decorations */}
      <div className="scratch-decorations">
        <span className="deco deco-1">❄️</span>
        <span className="deco deco-2">✨</span>
        <span className="deco deco-3">🌟</span>
        <span className="deco deco-4">❄️</span>
      </div>
    </div>
  );
}

export default ScratchCard;
