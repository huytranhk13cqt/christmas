/**
 * Christmas Gift Reveal - Backend Server
 *
 * API endpoints:
 * - GET /api/images - Lấy danh sách ảnh trong thư mục images
 * - GET /api/music - Lấy danh sách nhạc trong thư mục music
 */

import express from "express";
import cors from "cors";
import { readdirSync, existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Đường dẫn tới thư mục public của client
const PUBLIC_DIR = join(__dirname, "../client/public");
const RESULT_DIR = join(__dirname, "../result");

// Production: Đường dẫn tới React build
const CLIENT_BUILD_DIR = join(__dirname, "../client/dist");

// Dùng thư mục build trong production, public trong development
const isProduction = existsSync(CLIENT_BUILD_DIR);
const ASSETS_DIR = isProduction ? CLIENT_BUILD_DIR : PUBLIC_DIR;
const IMAGES_DIR = join(ASSETS_DIR, "images");
const MUSIC_DIR = join(ASSETS_DIR, "music");

// Tạo thư mục nếu chưa tồn tại
[PUBLIC_DIR, IMAGES_DIR, MUSIC_DIR, RESULT_DIR].forEach((dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`📁 Đã tạo thư mục: ${dir}`);
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files từ thư mục public
app.use("/images", express.static(IMAGES_DIR));
app.use("/music", express.static(MUSIC_DIR));

/**
 * Lọc các file theo extension
 */
function filterFilesByExtension(files, extensions) {
  return files.filter((file) => {
    const ext = file.toLowerCase().split(".").pop();
    return extensions.includes(ext);
  });
}

/**
 * API: Lấy danh sách ảnh
 * Hỗ trợ: jpg, jpeg, png, gif, webp
 */
app.get("/api/images", (req, res) => {
  try {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

    if (!existsSync(IMAGES_DIR)) {
      return res.json({ images: [], count: 0 });
    }

    const files = readdirSync(IMAGES_DIR);
    const images = filterFilesByExtension(files, imageExtensions);

    console.log(`🖼️  Tìm thấy ${images.length} ảnh`);

    res.json({
      images: images.map((img) => `/images/${img}`),
      count: images.length,
    });
  } catch (error) {
    console.error("Lỗi khi đọc thư mục images:", error);
    res.status(500).json({ error: "Không thể đọc thư mục images" });
  }
});

/**
 * API: Lấy danh sách nhạc
 * Hỗ trợ: mp3, wav, ogg
 */
app.get("/api/music", (req, res) => {
  try {
    const musicExtensions = ["mp3", "wav", "ogg"];

    if (!existsSync(MUSIC_DIR)) {
      return res.json({ tracks: [], count: 0 });
    }

    const files = readdirSync(MUSIC_DIR);
    const tracks = filterFilesByExtension(files, musicExtensions);

    console.log(`🎵 Tìm thấy ${tracks.length} bài hát`);

    res.json({
      tracks: tracks.map((track) => `/music/${track}`),
      count: tracks.length,
    });
  } catch (error) {
    console.error("Lỗi khi đọc thư mục music:", error);
    res.status(500).json({ error: "Không thể đọc thư mục music" });
  }
});

/**
 * API: Health check
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "🎄 Server đang hoạt động!" });
});

/**
 * API: Lưu kết quả chọn quà
 * POST /api/save-result
 */
app.post("/api/save-result", (req, res) => {
  try {
    const { giftImageName, giftImageUrl, giftIndex, recipientName, confirmedAt } = req.body;

    if (!giftImageName) {
      return res.status(400).json({ error: "Thiếu thông tin quà" });
    }

    const resultFile = join(RESULT_DIR, "gift-selection.json");

    // Đọc file cũ nếu có
    let results = [];
    if (existsSync(resultFile)) {
      try {
        const existingData = readFileSync(resultFile, "utf-8");
        results = JSON.parse(existingData);
        if (!Array.isArray(results)) results = [results];
      } catch {
        results = [];
      }
    }

    // Thêm kết quả mới
    const newResult = {
      id: Date.now(),
      giftImageName,
      giftImageUrl,
      giftIndex,
      recipientName,
      confirmedAt,
      serverTime: new Date().toISOString(),
    };

    results.push(newResult);

    // Ghi file
    writeFileSync(resultFile, JSON.stringify(results, null, 2), "utf-8");

    console.log(`💝 Đã lưu kết quả: ${giftImageName}`);
    console.log(`📁 File: ${resultFile}`);

    res.json({
      success: true,
      message: "Đã lưu kết quả thành công!",
      result: newResult
    });
  } catch (error) {
    console.error("Lỗi khi lưu kết quả:", error);
    res.status(500).json({ error: "Không thể lưu kết quả" });
  }
});

/**
 * API: Lấy kết quả đã chọn
 * GET /api/results
 */
app.get("/api/results", (req, res) => {
  try {
    const resultFile = join(RESULT_DIR, "gift-selection.json");

    if (!existsSync(resultFile)) {
      return res.json({ results: [], count: 0 });
    }

    const data = readFileSync(resultFile, "utf-8");
    const results = JSON.parse(data);

    res.json({
      results: Array.isArray(results) ? results : [results],
      count: Array.isArray(results) ? results.length : 1,
    });
  } catch (error) {
    console.error("Lỗi khi đọc kết quả:", error);
    res.status(500).json({ error: "Không thể đọc kết quả" });
  }
});

// Production: Serve React build
if (existsSync(CLIENT_BUILD_DIR)) {
  // Serve static files từ React build
  app.use(express.static(CLIENT_BUILD_DIR));

  // SPA fallback - mọi route không match API sẽ trả về index.html
  app.get("*", (req, res) => {
    // Không redirect các API routes
    if (req.path.startsWith("/api/") || req.path.startsWith("/images/") || req.path.startsWith("/music/")) {
      return res.status(404).json({ error: "Not found" });
    }
    res.sendFile(join(CLIENT_BUILD_DIR, "index.html"));
  });

  console.log("📦 Production mode: Serving React build from", CLIENT_BUILD_DIR);
}

// Start server
app.listen(PORT, () => {
  console.log(`
  🎄 ================================= 🎄
  🎁 Christmas Gift Reveal Server
  🎄 ================================= 🎄

  🚀 Server đang chạy tại: http://localhost:${PORT}
  📦 Mode: ${isProduction ? "Production" : "Development"}

  📁 Thư mục ảnh: ${IMAGES_DIR}
  🎵 Thư mục nhạc: ${MUSIC_DIR}
  💝 Thư mục kết quả: ${RESULT_DIR}

  📌 Hãy thêm ảnh vào thư mục 'images' và nhạc vào thư mục 'music'!
  💡 Kết quả chọn quà sẽ được lưu vào: ${RESULT_DIR}/gift-selection.json
  `);
});
