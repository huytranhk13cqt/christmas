/**
 * Admin Page - Xem kết quả chọn quà
 */

import { useState, useEffect, useCallback } from "react";
import "./AdminPage.css";

function AdminPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storageType, setStorageType] = useState("Unknown");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch results from API
  const fetchResults = useCallback(async () => {
    try {
      const response = await fetch("/api/results");
      if (!response.ok) throw new Error("Không thể tải dữ liệu");

      const data = await response.json();
      setResults(data.results || []);
      setStorageType(data.storage || "Unknown");
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Auto refresh every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchResults, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchResults]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Get gift number from image name
  const getGiftNumber = (result) => {
    if (result.giftIndex !== undefined) return result.giftIndex + 1;
    const match = result.giftImageName?.match(/\d+/);
    return match ? match[0] : "?";
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="admin-spinner">🎁</div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>
            <span className="admin-icon">🎄</span>
            Admin Dashboard
            <span className="admin-icon">🎁</span>
          </h1>
          <p className="admin-subtitle">Quản lý kết quả chọn quà Giáng sinh</p>
        </div>
        <a href="/" className="admin-back-btn">
          ← Về trang chính
        </a>
      </header>

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">🎁</div>
          <div className="stat-info">
            <span className="stat-number">{results.length}</span>
            <span className="stat-label">Lựa chọn</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💾</div>
          <div className="stat-info">
            <span className="stat-number storage-badge" data-storage={storageType}>
              {storageType}
            </span>
            <span className="stat-label">Storage</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <span className="stat-number">
              {lastUpdated ? lastUpdated.toLocaleTimeString("vi-VN") : "--:--"}
            </span>
            <span className="stat-label">Cập nhật lần cuối</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="admin-controls">
        <button className="admin-btn refresh-btn" onClick={fetchResults}>
          🔄 Làm mới
        </button>

        <label className="auto-refresh-toggle">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">Tự động làm mới (10s)</span>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="admin-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Results Table */}
      <div className="admin-table-container">
        {results.length === 0 ? (
          <div className="admin-empty">
            <div className="empty-icon">📭</div>
            <h3>Chưa có ai chọn quà</h3>
            <p>Khi người yêu của bạn chọn quà, kết quả sẽ hiện ở đây!</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Hình ảnh</th>
                <th>Quà số</th>
                <th>Người nhận</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={result.id || index}>
                  <td className="td-index">{index + 1}</td>
                  <td className="td-image">
                    <div className="result-image-wrapper">
                      <img
                        src={result.giftImageUrl || `/images/${result.giftImageName}`}
                        alt={`Gift ${getGiftNumber(result)}`}
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect fill='%23f0f0f0' width='60' height='60'/%3E%3Ctext x='50%25' y='50%25' font-size='24' text-anchor='middle' dy='.3em'%3E🎁%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  </td>
                  <td className="td-gift-number">
                    <span className="gift-badge">Quà #{getGiftNumber(result)}</span>
                  </td>
                  <td className="td-recipient">
                    <span className="recipient-name">{result.recipientName || "Ẩn danh"}</span>
                  </td>
                  <td className="td-time">
                    <div className="time-info">
                      <span className="time-display">{result.confirmedAt || formatDate(result.serverTime)}</span>
                      {result.serverTime && (
                        <span className="time-server">Server: {formatDate(result.serverTime)}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <footer className="admin-footer">
        <p>🎄 Christmas Gift Reveal - Admin Panel 🎄</p>
      </footer>
    </div>
  );
}

export default AdminPage;
