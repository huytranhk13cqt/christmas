/**
 * ParallaxSnow Component
 *
 * Hiệu ứng tuyết rơi với parallax effect
 */

import { useEffect, useState, useCallback } from "react";
import "./ParallaxSnow.css";

function ParallaxSnow() {
  const [snowflakes, setSnowflakes] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  // Generate initial snowflakes
  useEffect(() => {
    const flakes = [];
    for (let i = 0; i < 60; i++) {
      flakes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        speed: Math.random() * 3 + 1,
        opacity: Math.random() * 0.7 + 0.3,
        layer: Math.floor(Math.random() * 3), // 0=far, 1=mid, 2=near
        sway: Math.random() * 30 - 15,
      });
    }
    setSnowflakes(flakes);
  }, []);

  // Track mouse for parallax
  const handleMouseMove = useCallback((e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    setMousePos({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="parallax-snow">
      {[0, 1, 2].map((layer) => (
        <div
          key={layer}
          className={`snow-layer layer-${layer}`}
          style={{
            transform: `translate(${(mousePos.x - 0.5) * (layer + 1) * 20}px, ${(mousePos.y - 0.5) * (layer + 1) * 10}px)`,
          }}
        >
          {snowflakes
            .filter((f) => f.layer === layer)
            .map((flake) => (
              <div
                key={flake.id}
                className="snowflake"
                style={{
                  left: `${flake.x}%`,
                  top: `${flake.y}%`,
                  width: `${flake.size}px`,
                  height: `${flake.size}px`,
                  opacity: flake.opacity,
                  animationDuration: `${10 / flake.speed}s`,
                  "--sway": `${flake.sway}px`,
                }}
              />
            ))}
        </div>
      ))}
    </div>
  );
}

export default ParallaxSnow;
