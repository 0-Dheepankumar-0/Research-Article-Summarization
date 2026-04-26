import express from "express";
import axios from "axios";
import xml2js from "xml2js";
import https from "https";
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { pipeline } from "stream/promises";
import Summaries from "../models/Summaries.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const summaryCache = new Map(); // In-memory cache

const router = express.Router();

function getRandomQuery() {
    const topics = [
      "machine learning",
      "neural networks",
      "quantum computing",
      "natural language processing",
      "computer vision",
      "reinforcement learning"
    ];
    return topics[Math.floor(Math.random() * topics.length)];
  }
// Route to search for papers
router.get("/research-list", async (req, res) => {
    const searchTerm = req.query.q?.trim() || getRandomQuery();
    const apiUrl = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(searchTerm)}&max_results=20`;
  
    try {
      const response = await axios.get(apiUrl);
      
      xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
        if (err) {
          console.error("XML Parse Error:", err);
          return res.status(500).json({ error: "Failed to parse response" });
        }
  
        const entries = result.feed.entry;
        const papers = Array.isArray(entries) ? entries : [entries];
  
        const formatted = papers.map(paper => ({
          title: paper.title.trim(),
          published: paper.published,
          authors: Array.isArray(paper.author)
            ? paper.author.map(a => a.name)
            : [paper.author.name],
          pdfUrl: Array.isArray(paper.link)
            ? paper.link.find(link => link.$.type === "application/pdf")?.$.href
            : paper.link?.$.href || null,
          summary: paper.summary?.trim()
        }));
  
        res.json(formatted);
      });
    } catch (error) {
      console.error("arXiv API Error:", error.message);
      res.status(500).json({ error: "Failed to fetch research papers" });
    }
  });
  
  function preprocessText(text) {
    return text
      .replace(/\n+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2') // fix merged words
      .replace(/[^a-zA-Z0-9.,;:(){}\[\]\s-]/g, '') // strip weird characters
      .replace(/(page \d+|doi:.*|https?:\/\/\S+)/gi, '')
      .trim();
  }
  
  function getTextHash(text) {
    return crypto.createHash("sha256").update(text).digest("hex");
  }
  
  async function summarizeText(text) {
    const cleanText = preprocessText(text);
    const slicedText = cleanText.slice(0, 10000);
    const hash = getTextHash(slicedText);
  
    if (summaryCache.has(hash)) {
      return summaryCache.get(hash);
    }
  
    const model = slicedText.length < 3000
      ? "google/pegasus-xsum"
      : "pszemraj/led-large-book-summary";
  
    const prompt = `
  You are a helpful research summarization assistant.
  
  Summarize the following academic paper clearly and in formal tone. Focus on the main problem, methods, results, and conclusions. Avoid repetition and ignore names, emails, or footers.
  
  Text:
  """
  ${slicedText}
  """`;
  
    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${model}`,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const raw = response.data[0];
      const summary = raw?.generated_text?.trim() || raw?.summary_text?.trim() || "Summary not generated.";
  
      summaryCache.set(hash, summary);
      return summary;
    } catch (err) {
      console.error("❌ Hugging Face model error:", err.response?.data || err.message);
      throw new Error("Failed to generate summary. Model may be busy or unavailable.");
    }
  }
  
  // Hugging Face Pegasus-XSum Summarization
//   async function summarizeText(text) {
//     const CHUNK_SIZE = 3000;
//     const cleanText = preprocessText(text);
//     const chunks = [];
  
//     for (let i = 0; i < cleanText.length; i += CHUNK_SIZE) {
//       chunks.push(cleanText.slice(i, i + CHUNK_SIZE));
//     }
//     for (const chunk of chunks) {
//       try {
//         const response = await axios.post(
//           "https://api-inference.huggingface.co/models/pszemraj/led-large-book-summary",
//           { inputs: chunk },
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         console.log("response.data[0]: ", response.data[0])
//         const summary = response.data[0]?.summary_text?.trim();
//         return summary || "Summary not generated.";
//       } catch (err) {
//         console.error("Hugging Face model error:", err.response?.data || err.message);
//         throw new Error("Model is unavailable or busy. Try again later.");
//       }
//     }
  
//     const formatted = summary
//   .split(/(?<=\\.)\\s+/)
//   .map(s => `<li>${s.trim()}</li>`)
//   .join('\n');
// return `<ul>${formatted}</ul>`;
//   }
  
  // Step 1: Extract PDF Text and pass to summarizer
  router.post("/extract-pdf-text", authenticateToken, async (req, res) => {
    const { pdfUrl } = req.body;
  
    if (!pdfUrl) {
      return res.status(400).json({ error: "PDF URL is required." });
    }
  
    const filePath = path.join(process.cwd(), `temp-${Date.now()}.pdf`);
  
    try {
      const response = await axios.get(pdfUrl, { responseType: "stream" });
      await pipeline(response.data, fs.createWriteStream(filePath));
  
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
  
      fs.unlinkSync(filePath);
  
      const summary = await summarizeText(pdfData.text);
      console.log("Summary final: ", summary);
      res.json({ summary });
  
    } catch (error) {
      console.error("PDF Processing Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to extract and summarize PDF." });
    }
  });

//   save summaries in DB

router.post('/save-summary', authenticateToken, async (req, res) => {
    try {
      const { pdfUrl, summary } = req.body;
      const userId = getAuthenticatedUserId(req);
  
      if (!userId || !pdfUrl || !summary) {
        return res.status(400).json({ message: 'Missing fields' });
      }
  
      // 🔍 Check if already exists for same user and PDF
      const existing = await Summaries.findOne({ userId, pdfUrl });
  
      if (existing) {
        return res.status(409).json({ message: 'Summary already exists for this PDF and user.' });
      }
  
      const newSummary = new Summaries({ userId, pdfUrl, summary });
      await newSummary.save();
  
      res.status(201).json({ message: 'Summary saved successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error saving summary', error: err.message });
    }
  });
  
//   Get summaries of login user

const getAuthenticatedUserId = (req) => req.user?.id || null;

const getUserSummaries = async (req, res) => {
    try {
      const userId = getAuthenticatedUserId(req);
  
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const summaries = await Summaries.find({ userId }).sort({ createdAt: -1 });
  
      res.status(200).json(summaries);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching summaries', error: err.message });
    }
};

router.get('/user-summaries', authenticateToken, getUserSummaries);

  export default router;