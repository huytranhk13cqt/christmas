/**
 * Christmas Gift Reveal - Backend Server
 *
 * API endpoints:
 * - GET /api/images - Lấy danh sách ảnh trong thư mục images
 * - GET /api/music - Lấy danh sách nhạc trong thư mục music
 * - POST /api/save-result - Lưu kết quả chọn quà
 * - GET /api/results - Lấy danh sách kết quả đã chọn
 */

import express from "express";
import cors from "cors";
import { readdirSync, existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ==================== MongoDB Configuration ====================
// Railway MongoDB environment variables
const MONGO_URL = process.env.MONGO_URL || null;
const DB_NAME = process.env.DB_NAME || "christmas_gift";
const COLLECTION_NAME = "gift_selections";

let db = null;
let mongoConnected = false;

/**
 * Kết nối MongoDB
 */
async function connectMongoDB() {
  if (!MONGO_URL) {
    console.log("⚠️  MONGO_URL chưa được cấu hình, sử dụng file storage");
    return false;
  }

  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    db = client.db(DB_NAME);

    // Test connection
    await db.command({ ping: 1 });

    console.log("✅ Đã kết nối MongoDB thành công!");
    console.log(`📦 Database: ${DB_NAME}`);
    console.log(`📁 Collection: ${COLLECTION_NAME}`);

    mongoConnected = true;
    return true;
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
    console.log("⚠️  Fallback về file storage");
    return false;
  }
}

// ==================== File Storage Paths ====================
const PUBLIC_DIR = join(__dirname, "../client/public");
const RESULT_DIR = join(__dirname, "../result");
const CLIENT_BUILD_DIR = join(__dirname, "../client/dist");

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
  res.json({
    status: "ok",
    message: "🎄 Server đang hoạt động!",
    storage: mongoConnected ? "MongoDB" : "File System"
  });
});

/**
 * API: Lưu kết quả chọn quà
 * POST /api/save-result
 */
app.post("/api/save-result", async (req, res) => {
  try {
    const { giftImageName, giftImageUrl, giftIndex, recipientName, confirmedAt } = req.body;

    if (!giftImageName) {
      return res.status(400).json({ error: "Thiếu thông tin quà" });
    }

    const newResult = {
      id: Date.now(),
      giftImageName,
      giftImageUrl,
      giftIndex,
      recipientName,
      confirmedAt,
      serverTime: new Date().toISOString(),
    };

    // Sử dụng MongoDB nếu đã kết nối
    if (mongoConnected && db) {
      await db.collection(COLLECTION_NAME).insertOne(newResult);
      console.log(`💝 Đã lưu kết quả vào MongoDB: ${giftImageName}`);
    } else {
      // Fallback về file storage
      const resultFile = join(RESULT_DIR, "gift-selection.json");

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

      results.push(newResult);
      writeFileSync(resultFile, JSON.stringify(results, null, 2), "utf-8");
      console.log(`💝 Đã lưu kết quả vào file: ${giftImageName}`);
    }

    res.json({
      success: true,
      message: "Đã lưu kết quả thành công!",
      result: newResult,
      storage: mongoConnected ? "MongoDB" : "File System"
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
app.get("/api/results", async (req, res) => {
  try {
    let results = [];

    // Sử dụng MongoDB nếu đã kết nối
    if (mongoConnected && db) {
      results = await db.collection(COLLECTION_NAME).find({}).sort({ serverTime: -1 }).toArray();
      console.log(`📊 Đọc ${results.length} kết quả từ MongoDB`);
    } else {
      // Fallback về file storage
      const resultFile = join(RESULT_DIR, "gift-selection.json");

      if (existsSync(resultFile)) {
        const data = readFileSync(resultFile, "utf-8");
        results = JSON.parse(data);
        if (!Array.isArray(results)) results = [results];
      }
    }

    res.json({
      results,
      count: results.length,
      storage: mongoConnected ? "MongoDB" : "File System"
    });
  } catch (error) {
    console.error("Lỗi khi đọc kết quả:", error);
    res.status(500).json({ error: "Không thể đọc kết quả" });
  }
});

// Production: Serve React build
if (existsSync(CLIENT_BUILD_DIR)) {
  app.use(express.static(CLIENT_BUILD_DIR));

  app.get("*", (req, res) => {
    if (req.path.startsWith("/api/") || req.path.startsWith("/images/") || req.path.startsWith("/music/")) {
      return res.status(404).json({ error: "Not found" });
    }
    res.sendFile(join(CLIENT_BUILD_DIR, "index.html"));
  });

  console.log("📦 Production mode: Serving React build from", CLIENT_BUILD_DIR);
}

// Start server với MongoDB connection
async function startServer() {
  // Kết nối MongoDB trước
  await connectMongoDB();

  // Start Express server
  app.listen(PORT, () => {
    console.log(`
  🎄 ================================= 🎄
  🎁 Christmas Gift Reveal Server
  🎄 ================================= 🎄

  🚀 Server đang chạy tại: http://localhost:${PORT}
  📦 Mode: ${isProduction ? "Production" : "Development"}
  💾 Storage: ${mongoConnected ? "MongoDB" : "File System"}

  📁 Thư mục ảnh: ${IMAGES_DIR}
  🎵 Thư mục nhạc: ${MUSIC_DIR}
  💝 Kết quả: ${mongoConnected ? "MongoDB - " + DB_NAME + "/" + COLLECTION_NAME : RESULT_DIR + "/gift-selection.json"}
  `);
  });
}

startServer();
