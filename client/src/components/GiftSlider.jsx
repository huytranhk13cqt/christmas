/**
 * GiftSlider Component
 *
 * Hiển thị slider các hộp quà để người dùng chọn
 */

import { useRef, useEffect } from "react";
import "./GiftSlider.css";

// Các màu hộp quà khác nhau
const GIFT_COLORS = [
  { box: "#c41e3a", ribbon: "#ffd700" }, // Đỏ + Vàng
  { box: "#228b22", ribbon: "#ff6b6b" }, // Xanh + Đỏ
  { box: "#4169e1", ribbon: "#silver" }, // Xanh dương + Bạc
  { box: "#8b008b", ribbon: "#ffd700" }, // Tím + Vàng
  { box: "#ff6347", ribbon: "#228b22" }, // Cam + Xanh
  { box: "#20b2aa", ribbon: "#ff69b4" }, // Xanh ngọc + Hồng
];

function GiftSlider({ count, selectedIndex, onSelect }) {
  const sliderRef = useRef(null);

  // Cuộn tới item được chọn
  useEffect(() => {
    if (sliderRef.current) {
      const selectedItem = sliderRef.current.children[selectedIndex];
      if (selectedItem) {
        selectedItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedIndex]);

  // Tạo danh sách hộp quà
  const gifts = Array.from({ length: count }, (_, index) => {
    const colorScheme = GIFT_COLORS[index % GIFT_COLORS.length];
    return {
      id: index,
      ...colorScheme,
    };
  });

  return (
    <div className="gift-slider-container">
      <div className="gift-slider" ref={sliderRef}>
        {gifts.map((gift, index) => (
          <div
            key={gift.id}
            className={`gift-item ${selectedIndex === index ? "selected" : ""}`}
            onClick={() => onSelect(index)}
          >
            <div
              className="gift-box-preview"
              style={{ "--box-color": gift.box, "--ribbon-color": gift.ribbon }}
            >
              {/* Thân hộp */}
              <div className="box-body">
                <div className="box-shine"></div>
              </div>

              {/* Nắp hộp */}
              <div className="box-lid">
                <div className="lid-top"></div>
              </div>

              {/* Ruy băng */}
              <div className="ribbon-vertical"></div>
              <div className="ribbon-horizontal"></div>
              <div className="ribbon-bow">
                <div className="bow-left"></div>
                <div className="bow-right"></div>
                <div className="bow-center"></div>
              </div>

              {/* Số thứ tự */}
              <div className="gift-number">{index + 1}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chỉ báo vị trí */}
      <div className="slider-indicator">
        <span className="current">{selectedIndex + 1}</span>
        <span className="separator">/</span>
        <span className="total">{count}</span>
      </div>

      {/* Navigation arrows */}
      <button
        className="slider-nav prev"
        onClick={() => onSelect(Math.max(0, selectedIndex - 1))}
        disabled={selectedIndex === 0}
      >
        ◀
      </button>
      <button
        className="slider-nav next"
        onClick={() => onSelect(Math.min(count - 1, selectedIndex + 1))}
        disabled={selectedIndex === count - 1}
      >
        ▶
      </button>
    </div>
  );
}

export default GiftSlider;
