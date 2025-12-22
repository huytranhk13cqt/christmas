/**
 * MusicPlayer Component
 *
 * Phát nhạc nền Giáng sinh với các tùy chọn:
 * - Phát theo vòng (loop)
 * - Phát ngẫu nhiên (shuffle)
 * - Audio visualizer
 * - Progress bar
 */

import { useState, useEffect, useRef, useCallback } from "react";
import "./MusicPlayer.css";

function MusicPlayer() {
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [visualizerBars, setVisualizerBars] = useState(Array(8).fill(5));

  // Lấy danh sách nhạc từ server
  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const response = await fetch("/api/music");
      const data = await response.json();
      setTracks(data.tracks || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhạc:", error);
    }
  };

  // Cập nhật volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Animated visualizer effect (simulated)
  const animateVisualizer = useCallback(() => {
    if (isPlaying) {
      const newBars = Array(8).fill(0).map(() =>
        Math.random() * 80 + 20 // Random height between 20% and 100%
      );
      setVisualizerBars(newBars);
      animationRef.current = requestAnimationFrame(() => {
        setTimeout(animateVisualizer, 100); // Update every 100ms
      });
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      animateVisualizer();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setVisualizerBars(Array(8).fill(5));
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animateVisualizer]);

  // Update progress
  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(currentProgress) ? 0 : currentProgress);
      setDuration(audioRef.current.duration || 0);
    }
  }, []);

  // Format time
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle seek
  const handleSeek = (e) => {
    if (audioRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      audioRef.current.currentTime = percentage * duration;
    }
  };

  // Xử lý khi bài hát kết thúc
  const handleTrackEnd = () => {
    if (tracks.length === 0) return;

    if (isShuffle) {
      // Chọn ngẫu nhiên bài tiếp theo (tránh bài hiện tại)
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (nextIndex === currentTrackIndex && tracks.length > 1);
      setCurrentTrackIndex(nextIndex);
    } else {
      // Chuyển sang bài tiếp theo (loop)
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }
  };

  // Phát nhạc
  const handlePlay = () => {
    if (!audioRef.current || tracks.length === 0) return;

    setHasInteracted(true);

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => {
        console.log("Không thể phát nhạc:", err);
      });
      setIsPlaying(true);
    }
  };

  // Chuyển bài
  const handleNext = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrev = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  // Lấy tên bài hát từ đường dẫn
  const getTrackName = (path) => {
    if (!path) return "No track";
    const filename = path.split("/").pop();
    return filename.replace(/\.[^/.]+$/, ""); // Bỏ extension
  };

  // Không hiển thị nếu không có nhạc
  if (tracks.length === 0) {
    return null;
  }

  return (
    <div className={`music-player ${isExpanded ? "expanded" : ""} ${isPlaying ? "is-playing" : ""}`}>
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={tracks[currentTrackIndex]}
        onEnded={handleTrackEnd}
        onTimeUpdate={updateProgress}
        onLoadedMetadata={updateProgress}
        preload="auto"
      />

      {/* Toggle button with visualizer */}
      <button
        className="music-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        title="Điều khiển nhạc"
      >
        <span className="toggle-icon">🎵</span>
        {isPlaying && (
          <div className="mini-visualizer">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="mini-bar"
                style={{ height: `${visualizerBars[i] || 20}%` }}
              />
            ))}
          </div>
        )}
      </button>

      {/* Player controls */}
      <div className="player-controls">
        {/* Visualizer */}
        <div className="visualizer">
          {visualizerBars.map((height, i) => (
            <span
              key={i}
              className="visualizer-bar"
              style={{
                height: `${height}%`,
                animationDelay: `${i * 0.05}s`
              }}
            />
          ))}
        </div>

        {/* Track info */}
        <div className="track-info">
          <span className={`track-icon ${isPlaying ? "spinning" : ""}`}>🎄</span>
          <div className="track-details">
            <span className="track-name">
              {getTrackName(tracks[currentTrackIndex])}
            </span>
            <span className="track-time">
              {formatTime(audioRef.current?.currentTime || 0)} / {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-container" onClick={handleSeek}>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
            <div
              className="progress-thumb"
              style={{ left: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main controls */}
        <div className="control-buttons">
          <button
            className="control-btn"
            onClick={handlePrev}
            title="Bài trước"
          >
            ⏮
          </button>

          <button
            className={`control-btn play-btn ${isPlaying ? "playing" : ""}`}
            onClick={handlePlay}
            title={isPlaying ? "Tạm dừng" : "Phát"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <button className="control-btn" onClick={handleNext} title="Bài tiếp">
            ⏭
          </button>

          <button
            className={`control-btn shuffle-btn ${isShuffle ? "active" : ""}`}
            onClick={toggleShuffle}
            title={isShuffle ? "Tắt ngẫu nhiên" : "Bật ngẫu nhiên"}
          >
            🔀
          </button>
        </div>

        {/* Volume control */}
        <div className="volume-control">
          <span className="volume-icon">
            {volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="volume-slider"
          />
        </div>

        {/* Track counter */}
        <div className="track-counter">
          <span className="counter-current">{currentTrackIndex + 1}</span>
          <span className="counter-sep">/</span>
          <span className="counter-total">{tracks.length}</span>
        </div>
      </div>

      {/* First interaction prompt */}
      {!hasInteracted && (
        <div className="interaction-prompt" onClick={handlePlay}>
          <span className="prompt-icon">🎵</span>
          <span className="prompt-text">Nhấn để phát nhạc Giáng sinh!</span>
          <span className="prompt-icon">🎄</span>
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;
