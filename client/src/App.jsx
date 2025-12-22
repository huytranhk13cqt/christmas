/**
 * Christmas Gift Reveal - Main App Component
 *
 * Flow: Welcome Guide -> Chọn quà -> Scratch Card / Mở quà -> Xem ảnh -> Đóng ảnh -> Xem thư -> Celebration
 */

import { useState, useEffect, useCallback } from "react";
import GiftSlider from "./components/GiftSlider";
import GiftBox from "./components/GiftBox";
import ChristmasLetter from "./components/ChristmasLetter";
import MusicPlayer from "./components/MusicPlayer";
import CountdownTimer from "./components/CountdownTimer";
import ScratchCard from "./components/ScratchCard";
import SnowGlobe from "./components/SnowGlobe";
import Celebration from "./components/Celebration";
import CoupleWalking from "./components/CoupleWalking";
import WelcomeGuide from "./components/WelcomeGuide";
import FloatingHearts from "./components/FloatingHearts";
import ParallaxSnow from "./components/ParallaxSnow";
import SparkleCursor from "./components/SparkleCursor";
import ConfirmGiftModal from "./components/ConfirmGiftModal";
import EasterEgg from "./components/EasterEgg";
import "./App.css";

// Tên người nhận - có thể tùy chỉnh
const RECIPIENT_NAME = "Em yêu";

function App() {
  // State
  const [images, setImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showGiftImage, setShowGiftImage] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [revealMode, setRevealMode] = useState("scratch"); // "scratch" or "box"
  const [scratchCompleted, setScratchCompleted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true); // Welcome guide
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Confirm modal
  const [giftConfirmed, setGiftConfirmed] = useState(false); // Luôn bắt đầu mới khi refresh

  // Lấy danh sách ảnh từ server
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/images");
      const data = await response.json();
      setImages(data.images || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách ảnh:", error);
      setIsLoading(false);
    }
  };

  // Hoàn thành welcome guide
  const handleWelcomeComplete = useCallback(() => {
    setShowWelcome(false);
  }, []);

  // Chọn ngẫu nhiên một hộp quà
  const handleRandom = useCallback(() => {
    if (images.length === 0 || isRevealed) return;

    let spins = 0;
    const maxSpins = 15;
    const interval = setInterval(() => {
      setSelectedIndex(Math.floor(Math.random() * images.length));
      spins++;
      if (spins >= maxSpins) {
        clearInterval(interval);
      }
    }, 100);
  }, [images.length, isRevealed]);

  // Khi nhấn "Mở Quà" - hiện scratch card hoặc gift box TRƯỚC
  const handleOpenGift = useCallback(() => {
    if (images.length === 0 || isRevealed) return;
    setIsRevealed(true);

    // Nếu là chế độ hộp quà, đợi animation xong rồi hiện confirm modal
    if (revealMode === "box") {
      setTimeout(() => {
        setShowConfirmModal(true);
      }, 2500); // Đợi animation hộp quà mở xong
    }
  }, [images.length, isRevealed, revealMode]);

  // Cho phép chọn lại quà
  const handleReselect = useCallback(() => {
    setGiftConfirmed(false);
    setIsRevealed(false);
    setShowGiftImage(false);
    setShowLetter(false);
    setShowCelebration(false);
    setScratchCompleted(false);
    setSelectedIndex(0);
    // Không xóa localStorage để vẫn gửi email được
  }, []);

  // Khi đã confirm từ modal - hiện celebration
  const handleGiftConfirmed = useCallback(() => {
    setShowConfirmModal(false);
    setGiftConfirmed(true);

    // Hiện gift image và celebration sau khi confirm
    setShowGiftImage(true);
    setShowCelebration(true);
  }, []);

  // Đóng confirm modal (quay lại chọn quà khác)
  const handleCloseConfirmModal = useCallback(() => {
    setShowConfirmModal(false);
    // Reset để chọn lại
    setIsRevealed(false);
    setScratchCompleted(false);
  }, []);

  // Khi scratch card hoàn thành - hiện confirm modal
  const handleScratchComplete = useCallback(() => {
    setScratchCompleted(true);
    // Hiện confirm modal sau khi cào xong
    setShowConfirmModal(true);
  }, []);

  // Đóng ảnh quà -> Hiện thư chúc mừng
  const handleCloseGiftImage = useCallback(() => {
    setShowGiftImage(false);
    setTimeout(() => {
      setShowLetter(true);
    }, 300);
  }, []);

  // Đóng thư (không reset nếu đã confirm)
  const handleCloseLetter = useCallback(() => {
    setShowLetter(false);
    // Nếu đã confirm rồi thì chỉ đóng thư, không reset
    if (!giftConfirmed) {
      setIsRevealed(false);
      setShowGiftImage(false);
      setShowCelebration(false);
      setScratchCompleted(false);
      setSelectedIndex(0);
    }
  }, [giftConfirmed]);

  // Toggle reveal mode
  const toggleRevealMode = useCallback(() => {
    setRevealMode((prev) => (prev === "scratch" ? "box" : "scratch"));
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="app loading">
        <div className="loading-content">
          <div className="loading-spinner">🎄</div>
          <p>Đang tải quà tặng...</p>
        </div>
      </div>
    );
  }

  // No images state
  if (images.length === 0) {
    return (
      <div className="app no-images">
        <div className="no-images-content">
          <h1>🎄 Christmas Gift Reveal 🎁</h1>
          <div className="warning-box">
            <p>Chưa có ảnh nào trong thư mục!</p>
            <p>
              Hãy thêm ảnh vào: <code>client/public/images/</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Parallax Snow Background */}
      <ParallaxSnow />

      {/* Sparkle Cursor Trail */}
      <SparkleCursor />

      {/* Floating Hearts on hover */}
      <FloatingHearts />

      {/* Easter Egg - click title 7 times */}
      <EasterEgg recipientName={RECIPIENT_NAME} />

      {/* Welcome Guide - Hiển thị đầu tiên */}
      {showWelcome && (
        <WelcomeGuide
          recipientName={RECIPIENT_NAME}
          onComplete={handleWelcomeComplete}
        />
      )}

      {/* Music Player */}
      <MusicPlayer />

      {/* Snow Globe - góc trái dưới */}
      <SnowGlobe />

      {/* Couple Walking - góc phải dưới */}
      <CoupleWalking />

      {/* Celebration Effect */}
      <Celebration isActive={showCelebration && !showLetter} recipientName={RECIPIENT_NAME} />

      {/* Header */}
      <header className="header">
        <h1 className="title">
          <span className="emoji">🎄</span>
          Christmas Gift
          <span className="emoji">🎁</span>
        </h1>
        <p className="subtitle">Một món quà đặc biệt dành cho {RECIPIENT_NAME}!</p>
      </header>

      {/* Countdown Timer */}
      <CountdownTimer />

      {/* Confirm Gift Modal */}
      {showConfirmModal && (
        <ConfirmGiftModal
          recipientName={RECIPIENT_NAME}
          selectedImage={images[selectedIndex]}
          selectedIndex={selectedIndex}
          onConfirm={handleGiftConfirmed}
          onClose={handleCloseConfirmModal}
        />
      )}

      {/* Main Content */}
      <main className="main">
        {/* Nếu đã confirm quà - chỉ hiện thư và ảnh đã chọn */}
        {giftConfirmed ? (
          <div className="confirmed-gift-section">
            <div className="confirmed-message">
              <h2>💝 {RECIPIENT_NAME} đã chọn món quà rồi! 💝</h2>
              <p>Cảm ơn em đã nhận quà Giáng sinh của anh nhé!</p>
            </div>

            <div className="confirmed-gift-preview">
              <img
                src={images[selectedIndex]}
                alt="Món quà của em"
              />
            </div>

            <div className="confirmed-actions">
              <button
                className="btn btn-primary"
                onClick={() => setShowLetter(true)}
              >
                💌 Đọc lại thư tình
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleReselect}
              >
                🎁 Chọn lại quà khác
              </button>
            </div>

            {/* Christmas Letter */}
            {showLetter && (
              <ChristmasLetter onClose={handleCloseLetter} recipientName={RECIPIENT_NAME} />
            )}
          </div>
        ) : !isRevealed ? (
          <>
            {/* Gift Slider */}
            <GiftSlider
              count={images.length}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
            />

            {/* Mode Toggle */}
            <div className="mode-toggle">
              <span className={revealMode === "scratch" ? "active" : ""}>
                🎫 Thẻ cào
              </span>
              <button className="toggle-btn" onClick={toggleRevealMode}>
                <span
                  className="toggle-slider"
                  style={{
                    transform: revealMode === "box" ? "translateX(24px)" : "translateX(0)",
                  }}
                />
              </button>
              <span className={revealMode === "box" ? "active" : ""}>
                🎁 Hộp quà
              </span>
            </div>

            {/* Action Buttons */}
            <div className="actions">
              <button className="btn btn-secondary" onClick={handleRandom}>
                🎲 Ngẫu Nhiên
              </button>
              <button className="btn btn-primary" onClick={handleOpenGift}>
                ✨ Mở Quà
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Reveal content based on mode */}
            {revealMode === "scratch" ? (
              <ScratchCard
                imageUrl={images[selectedIndex]}
                onComplete={handleScratchComplete}
                onReveal={() => setShowCelebration(true)}
              />
            ) : (
              <GiftBox imageUrl={images[selectedIndex]} isOpen={isRevealed} />
            )}

            {/* Gift Image Modal - Hiện TRƯỚC */}
            {showGiftImage && (
              <div className="gift-image-modal">
                <div className="gift-image-backdrop" onClick={handleCloseGiftImage}></div>
                <div className="gift-image-content">
                  <div className="gift-image-frame">
                    <div className="gift-image-sparkles">
                      {[...Array(8)].map((_, i) => (
                        <span key={i} className="sparkle">
                          ✨
                        </span>
                      ))}
                    </div>
                    <img src={images[selectedIndex]} alt="Your Gift" />
                    <h3>🎉 Món quà dành cho {RECIPIENT_NAME}! 🎉</h3>
                  </div>
                  <button className="close-gift-btn" onClick={handleCloseGiftImage}>
                    💌 Đọc thư tình →
                  </button>
                </div>
              </div>
            )}

            {/* Christmas Letter - Hiện SAU khi đóng ảnh */}
            {showLetter && (
              <ChristmasLetter onClose={handleCloseLetter} recipientName={RECIPIENT_NAME} />
            )}

            {/* Xem lại thư - chỉ hiện khi đã xong và chưa có modal nào */}
            {!showGiftImage && !showLetter && (scratchCompleted || revealMode === "box") && (
              <div className="actions" style={{ marginTop: "20px" }}>
                <button className="btn btn-primary" onClick={() => setShowLetter(true)}>
                  💌 Đọc thư tình
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Decorations */}
      <div className="decorations">
        <div className="ornament ornament-1">🔔</div>
        <div className="ornament ornament-2">⭐</div>
        <div className="ornament ornament-3">🎀</div>
        <div className="ornament ornament-4">❄️</div>
        <div className="ornament ornament-5">🌟</div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>🎄 Merry Christmas & Happy New Year! 🎄</p>
        <p className="footer-love">Made with ❤️ for {RECIPIENT_NAME}</p>
      </footer>
    </div>
  );
}

export default App;
