/**
 * ConfirmGiftModal Component
 *
 * Modal xác nhận khi người yêu chọn quà
 * Lưu kết quả vào file JSON trên server
 */

import { useState, useCallback } from "react";
import "./ConfirmGiftModal.css";

function ConfirmGiftModal({
  recipientName = "Em yêu",
  selectedImage,
  selectedIndex,
  onConfirm,
  onClose,
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Lấy tên file từ URL ảnh
  const getImageFileName = (imageUrl) => {
    if (!imageUrl) return "unknown";
    // Extract filename from path like "/images/gift1.jpg" -> "gift1.jpg"
    const parts = imageUrl.split("/");
    return parts[parts.length - 1] || "unknown";
  };

  // Lưu kết quả vào server
  const saveResultToServer = useCallback(async () => {
    try {
      const imageFileName = getImageFileName(selectedImage);

      const resultData = {
        giftImageName: imageFileName,
        giftImageUrl: selectedImage,
        giftIndex: selectedIndex + 1,
        recipientName: recipientName,
        confirmedAt: new Date().toLocaleString("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };

      const response = await fetch("/api/save-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resultData),
      });

      if (response.ok) {
        console.log("Result saved successfully!");
      }
    } catch (error) {
      // Fail silently - không hiển thị lỗi cho người dùng
      console.error("Save result error:", error);
    }
  }, [selectedImage, selectedIndex, recipientName]);

  // Xử lý khi nhấn Confirm
  const handleConfirm = useCallback(async () => {
    setIsConfirming(true);

    // Lưu kết quả vào server (âm thầm)
    await saveResultToServer();

    // Hiệu ứng loading nhẹ
    await new Promise((resolve) => setTimeout(resolve, 800));

    setConfirmed(true);

    // Đợi animation xong rồi mới gọi callback
    setTimeout(() => {
      onConfirm();
    }, 1000);
  }, [saveResultToServer, onConfirm]);

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-backdrop" onClick={onClose}></div>

      <div className={`confirm-modal ${confirmed ? "confirmed" : ""}`}>
        {/* Decorations */}
        <div className="modal-decorations">
          <span className="modal-deco deco-1">🎄</span>
          <span className="modal-deco deco-2">⭐</span>
          <span className="modal-deco deco-3">🎁</span>
          <span className="modal-deco deco-4">❄️</span>
          <span className="modal-deco deco-5">✨</span>
          <span className="modal-deco deco-6">💝</span>
        </div>

        {/* Gift Preview */}
        <div className="modal-gift-preview">
          <div className="preview-frame">
            <img src={selectedImage} alt="Món quà đã chọn" />
            <div className="preview-sparkles">
              {[...Array(6)].map((_, i) => (
                <span key={i} className="preview-sparkle">
                  ✨
                </span>
              ))}
            </div>
          </div>
          <span className="gift-number">Món quà #{selectedIndex + 1}</span>
        </div>

        {/* Content */}
        <div className="modal-content">
          {confirmed ? (
            <>
              <div className="confirm-success">
                <span className="success-icon">💖</span>
                <h2>Tuyệt vời!</h2>
                <p>Cảm ơn {recipientName} đã chọn quà!</p>
              </div>
            </>
          ) : (
            <>
              <div className="modal-emoji">💝</div>
              <h2 className="modal-title">{recipientName} ơi!</h2>
              <p className="modal-message">
                Em có chắc chọn món quà này không?
              </p>
              <p className="modal-submessage">Nhấn vào confirm nhé em yêu 💕</p>

              {/* Buttons */}
              <div className="modal-actions">
                <button
                  className="modal-btn btn-cancel"
                  onClick={onClose}
                  disabled={isConfirming}
                >
                  🔙 Chọn lại
                </button>
                <button
                  className="modal-btn btn-confirm"
                  onClick={handleConfirm}
                  disabled={isConfirming}
                >
                  {isConfirming ? (
                    <>
                      <span className="loading-dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </span>
                    </>
                  ) : (
                    <>✨ Confirm 💖</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Hearts animation */}
        <div className="modal-hearts">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="floating-heart">
              {["❤️", "💕", "💖", "💗"][i % 4]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ConfirmGiftModal;
