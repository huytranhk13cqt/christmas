/**
 * SnowGlobe Component
 *
 * Quả cầu tuyết tương tác ở góc màn hình
 * - Click để lắc mạnh
 * - Double click để đổi scene
 * - Hover để tuyết rơi nhẹ
 * - Drag để xoay globe
 */

import { useState, useCallback, useEffect, useRef } from "react";
import "./SnowGlobe.css";

// Các scene khác nhau trong globe
const SCENES = [
  { id: "couple", name: "Couple", emoji1: "👦", emoji2: "👧", centerEmoji: "💕" },
  { id: "tree", name: "Cây thông", emoji1: "🎄", emoji2: "🎁", centerEmoji: "⭐" },
  { id: "snowman", name: "Người tuyết", emoji1: "⛄", emoji2: "🎿", centerEmoji: "❄️" },
  { id: "santa", name: "Santa", emoji1: "🎅", emoji2: "🦌", centerEmoji: "🛷" },
  { id: "love", name: "Tình yêu", emoji1: "💑", emoji2: "💒", centerEmoji: "💖" },
];

function SnowGlobe() {
  const [isShaking, setIsShaking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [snowflakes, setSnowflakes] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [magicParticles, setMagicParticles] = useState([]);
  const lastX = useRef(0);
  const globeRef = useRef(null);

  // Generate snowflakes
  const generateSnowflakes = useCallback((count = 25, intense = false) => {
    const flakes = [];
    for (let i = 0; i < count; i++) {
      flakes.push({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: intense ? Math.random() * 30 : -10,
        size: Math.random() * 3 + 2,
        delay: Math.random() * (intense ? 0.5 : 2),
        duration: Math.random() * 2 + (intense ? 2 : 4),
        sway: Math.random() * 20 - 10,
      });
    }
    setSnowflakes(flakes);
  }, []);

  // Generate magic particles
  const generateMagicParticles = useCallback(() => {
    const particles = [];
    for (let i = 0; i < 8; i++) {
      particles.push({
        id: Date.now() + i,
        x: 50 + (Math.random() - 0.5) * 60,
        y: 50 + (Math.random() - 0.5) * 60,
        emoji: ["✨", "⭐", "💫", "🌟"][Math.floor(Math.random() * 4)],
      });
    }
    setMagicParticles(particles);
    setTimeout(() => setMagicParticles([]), 1000);
  }, []);

  // Initial snowflakes
  useEffect(() => {
    generateSnowflakes(20, false);
  }, [generateSnowflakes]);

  // Continuous gentle snow when hovering
  useEffect(() => {
    if (isHovering && !isShaking && !isMinimized) {
      const interval = setInterval(() => {
        generateSnowflakes(15, false);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovering, isShaking, isMinimized, generateSnowflakes]);

  // Handle shake
  const handleShake = useCallback(() => {
    if (isShaking) return;

    setIsShaking(true);
    generateSnowflakes(35, true);
    generateMagicParticles();

    setTimeout(() => {
      setIsShaking(false);
    }, 800);
  }, [isShaking, generateSnowflakes, generateMagicParticles]);

  // Handle double click - change scene
  const handleDoubleClick = useCallback((e) => {
    e.preventDefault();
    setCurrentScene((prev) => (prev + 1) % SCENES.length);
    generateMagicParticles();
  }, [generateMagicParticles]);

  // Handle drag start
  const handleDragStart = useCallback((e) => {
    setIsDragging(true);
    lastX.current = e.clientX || e.touches?.[0]?.clientX || 0;
  }, []);

  // Handle drag move
  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;

    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const deltaX = clientX - lastX.current;
    setRotation((prev) => prev + deltaX * 0.5);
    lastX.current = clientX;
  }, [isDragging]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Toggle minimize
  const toggleMinimize = useCallback((e) => {
    e.stopPropagation();
    setIsMinimized((prev) => !prev);
  }, []);

  const scene = SCENES[currentScene];

  if (isMinimized) {
    return (
      <div className="snow-globe-minimized" onClick={toggleMinimize}>
        <span className="globe-icon-mini">🔮</span>
        <span className="expand-hint">Globe</span>
      </div>
    );
  }

  return (
    <div
      className="snow-globe-wrapper"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setIsDragging(false);
      }}
    >
      {/* Header */}
      <div className="globe-header">
        <span className="globe-title">🔮 {scene.name}</span>
        <button className="minimize-btn" onClick={toggleMinimize} title="Thu nhỏ">
          −
        </button>
      </div>

      {/* Globe Container */}
      <div
        ref={globeRef}
        className={`snow-globe ${isShaking ? "shaking" : ""} ${isDragging ? "dragging" : ""}`}
        onClick={handleShake}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        style={{ transform: `rotateY(${rotation}deg)` }}
      >
        {/* Outer glow */}
        <div className="globe-glow"></div>

        {/* Glass dome */}
        <div className="globe-glass">
          {/* Snow particles */}
          <div className="snow-layer">
            {snowflakes.map((flake) => (
              <div
                key={flake.id}
                className="snowflake"
                style={{
                  left: `${flake.x}%`,
                  top: `${flake.y}%`,
                  width: `${flake.size}px`,
                  height: `${flake.size}px`,
                  animationDelay: `${flake.delay}s`,
                  animationDuration: `${flake.duration}s`,
                  "--sway": `${flake.sway}px`,
                }}
              />
            ))}
          </div>

          {/* Magic particles */}
          <div className="magic-layer">
            {magicParticles.map((particle) => (
              <span
                key={particle.id}
                className="magic-particle"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                }}
              >
                {particle.emoji}
              </span>
            ))}
          </div>

          {/* Scene content */}
          <div className="globe-scene">
            {/* Background stars */}
            <div className="scene-stars">
              <span className="tiny-star" style={{ top: "15%", left: "20%" }}>✦</span>
              <span className="tiny-star" style={{ top: "10%", right: "25%" }}>✦</span>
              <span className="tiny-star" style={{ top: "25%", left: "70%" }}>✦</span>
            </div>

            {/* Main elements */}
            <div className="scene-elements">
              <span className="scene-item left">{scene.emoji1}</span>
              <span className="scene-item center">{scene.centerEmoji}</span>
              <span className="scene-item right">{scene.emoji2}</span>
            </div>

            {/* Snow ground */}
            <div className="snow-ground">
              <div className="ground-sparkle"></div>
            </div>
          </div>

          {/* Glass reflections */}
          <div className="glass-reflection reflection-1"></div>
          <div className="glass-reflection reflection-2"></div>
        </div>

        {/* Base */}
        <div className="globe-base">
          <div className="base-ring"></div>
          <div className="base-bottom">
            <span className="base-gem">💎</span>
          </div>
        </div>
      </div>

      {/* Hints */}
      <div className="globe-hints">
        <span className="hint">👆 Lắc</span>
        <span className="hint-divider">•</span>
        <span className="hint">👆👆 Đổi scene</span>
      </div>

      {/* Scene indicator */}
      <div className="scene-dots">
        {SCENES.map((_, index) => (
          <span
            key={index}
            className={`scene-dot ${index === currentScene ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentScene(index);
              generateMagicParticles();
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default SnowGlobe;
