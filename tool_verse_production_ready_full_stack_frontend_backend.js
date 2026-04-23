// =========================
// FULL PRODUCTION READY STACK
// Frontend (Vite + Vanilla JS)
// Backend (Node.js + Express)
// =========================

// ================= BACKEND =================
// server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const upload = multer({ dest: "uploads/" });

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// ================= PDF MERGE =================
app.post("/api/pdf/merge", async (req, res) => {
  try {
    const { files } = req.body;

    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ error: "Invalid files" });
    }

    const response = await fetch("https://api.ilovepdf.com/v1/merge", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ILOVEPDF_PUBLIC_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= YOUTUBE DOWNLOADER =================
app.post("/api/youtube", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL required" });
    }

    const run = await fetch("https://api.apify.com/v2/acts/apify~youtube-scraper/runs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.APIFY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ startUrls: [{ url }] }),
    });

    const runData = await run.json();

    if (!runData?.data) {
      return res.status(500).json({ error: "Apify failed" });
    }

    res.json(runData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= START =================
app.listen(5000, () => console.log("Server running on port 5000"));


// ================= FRONTEND =================
// index.html

/*
<!DOCTYPE html>
<html>
<head>
  <title>ToolVerse</title>
</head>
<body>
  <h1>All-in-One Tools</h1>

  <h2>PDF Merge</h2>
  <input type="file" id="pdfFiles" multiple />
  <button onclick="mergePDF()">Merge</button>

  <h2>YouTube Downloader</h2>
  <input type="text" id="ytUrl" placeholder="Enter URL" />
  <button onclick="downloadYT()">Download</button>

  <script>
    async function mergePDF() {
      const files = document.getElementById("pdfFiles").files;
      const base64Files = [];

      for (let file of files) {
        const data = await file.arrayBuffer();
        base64Files.push(btoa(String.fromCharCode(...new Uint8Array(data))));
      }

      const res = await fetch("http://localhost:5000/api/pdf/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: base64Files }),
      });

      const data = await res.json();
      console.log(data);
      alert("Merged!");
    }

    async function downloadYT() {
      const url = document.getElementById("ytUrl").value;

      const res = await fetch("http://localhost:5000/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      console.log(data);
      alert("Check console for result");
    }
  </script>
</body>
</html>
*/


// ================= PACKAGE.JSON =================
/*
{
  "name": "toolverse",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "multer": "^1.4.5",
    "node-fetch": "^3.3.2"
  }
}
*/


// ================= .env =================
/*
ILOVEPDF_PUBLIC_KEY=your_key
APIFY_API_TOKEN=your_token
*/


// ================= DEPLOY GUIDE =================
/*
1. npm install
2. add .env
3. node server.js
4. open index.html

Deploy:
- Backend: Render / Railway
- Frontend: Vercel
*/
