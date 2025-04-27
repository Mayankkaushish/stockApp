const express = require("express");
const cors = require("cors");
const yahooFinance = require("yahoo-finance2").default;
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// const NEWS_API_KEY = "26a51deb0b65466d8477979a54c84f5c"; // Replace with your actual key
app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const isHistory = req.query.history === "true";

    if (isHistory) {
      const today = new Date();
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - 90);

      const historyData = await yahooFinance.historical(symbol, {
        period1: pastDate.toISOString().split("T")[0],
        period2: today.toISOString().split("T")[0],
      });

      if (!historyData || historyData.length === 0) {
        return res.status(404).json({ error: "No historical data available" });
      }

      console.log(`✅ Fetched ${historyData.length} days of data for ${symbol}`);
      return res.json(historyData);
    }

    const quote = await yahooFinance.quote(symbol);

    if (!quote || !quote.regularMarketPrice) {
      return res.status(404).json({ error: "No recent data available" });
    }

    res.json({
      symbol,
      latestPrice: quote.regularMarketPrice,
      volume: quote.regularMarketVolume || 0,
      timestamp: quote.regularMarketTime,
      open: quote.regularMarketOpen,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
    });
  } catch (error) {
    console.error("❌ Error fetching stock data:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

app.get('/api/fundamentals/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol;

    const quoteSummary = await yahooFinance.quoteSummary(symbol, {
      modules: [
        'earningsHistory',
        'incomeStatementHistory',
        'financialData',
        'cashflowStatementHistory',
      ],
    });

    const earningsData = quoteSummary.earningsHistory?.history || [];
    const incomeData = quoteSummary.incomeStatementHistory || {};
    const financialData = quoteSummary.financialData || {};
    const cashflowData = quoteSummary.cashflowStatementHistory || {};

    console.log("🔍 Full financialData object:", financialData);

    // === Earnings Data ===
    const earningsPerShare = earningsData.map((q) => q.epsActual || 0);
    const surprisePercentage = earningsData.map((q) => q.epsSurprisePercent || 0);

    // === Revenue Data ===
    const quarterlyRevenue = incomeData.incomeStatementHistory
      .slice()
      .reverse()
      .map((q) => q.totalRevenue || 0);

    // === Margin Data ===
    const marginData = {
      marginData: incomeData.incomeStatementHistory
        .slice()
        .reverse()
        .map((q) => {
          const revenue = q.totalRevenue || 0;
          const netIncome = q.netIncome || 0;
          const margin = revenue > 0 ? netIncome / revenue : 0;
          console.log(`🧮 Proxy Margin: NetIncome=${netIncome}, Revenue=${revenue}, Margin=${margin}`);
          return margin;
        })
        .filter((m) => m !== 0)
        .slice(0, 4),
    };

    console.log("📊 Gross Margins Sent to Frontend:", marginData);

    // === Operating Margin ===
    let operatingMargin = null;
    if (financialData.operatingMargins?.toFixed) {
      operatingMargin = parseFloat(financialData.operatingMargins.toFixed(4));
      console.log("📈 Operating Margin Sent to Frontend:", operatingMargin);
    }

    res.json({
      earnings: {
        earningsPerShare,
        surprisePercentage,
      },
      revenue: {
        quarterlyRevenue,
      },
      margins: marginData,
      operatingMargin,
    });
  } catch (error) {
    console.error("❌ Error fetching fundamentals:", error);
    res.status(500).json({ error: "Failed to fetch fundamentals" });
  }
});

// 🧠 Utility to calculate confidence decay based on article age
const scaleConfidenceByAge = (publishedAt) => {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffHours = (now - published) / (1000 * 60 * 60);

  if (diffHours < 2) return 1.0;
  if (diffHours < 6) return 0.8;
  if (diffHours < 12) return 0.6;
  if (diffHours < 24) return 0.4;
  if (diffHours < 48) return 0.2;
  return 0.0;
};

// ✅ News Sentiment Endpoint (MOVED TO BACKEND)
app.post("/api/sentiment", async (req, res) => {
  try {
    const { symbol } = req.body;
    if (!symbol) return res.status(400).json({ error: "Symbol is required" });

    const NEWS_API_KEY = "26a51deb0b65466d8477979a54c84f5c";
    const url = `https://newsapi.org/v2/everything?q=${symbol}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
    const newsRes = await axios.get(url);

    const seen = new Set();
    const articles = (newsRes.data.articles || [])
      .filter((a) => a.title && a.publishedAt && !seen.has(a.title) && seen.add(a.title))
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 5);

    if (articles.length === 0) {
      return res.json({ label: "Neutral", confidence: 0 });
    }

    const headlines = articles.map((a, i) => `${i + 1}. ${a.title} (${a.publishedAt})`);
    console.log(headlines);
    const latestPublished = new Date(articles[0]?.publishedAt);
    const now = new Date();
    const ageInHours = (now - latestPublished) / (1000 * 60 * 60);

    if (ageInHours > 48) {
    console.log("🕒 All news is older than 48 hours. Skipping sentiment analysis.");
    return res.json({ label: "Neutral", confidence: 0 });
    }


    const prompt = `
    You're an expert stock analyst. Analyze the following news headlines and determine the overall market sentiment toward the stock.

    News Headlines:
    ${headlines.join("\n")}

    Respond with one word ("Bullish", "Bearish", or "Neutral") and a confidence score out of 100.
    Format your response exactly as:
    Sentiment: <Bullish/Bearish/Neutral>
    Confidence: <0-100>
    `;

    const ollamaRes = await axios.post("http://localhost:11434/api/generate", {
      model: "mistral",
      prompt,
      stream: false,
    });

    const output = ollamaRes.data.response;
    const sentimentMatch = output.match(/Sentiment:\s*(Bullish|Bearish|Neutral)/i);
    const confidenceMatch = output.match(/Confidence:\s*(\d{1,3})/);

    const label = sentimentMatch ? sentimentMatch[1] : "Unknown";
    let confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 0;

    // ✅ Scale confidence by recency of the most recent article
    const scaledConfidence = Math.round(confidence * scaleConfidenceByAge(articles[0].publishedAt));
    console.log(symbol,label,confidence);
    return res.json({ label, confidence: scaledConfidence });
    } 
  catch (err) {
    console.error("❌ Error in /api/sentiment:", err.message);
    res.status(500).json({ error: "Sentiment analysis failed" });
    }
  });

  app.get('/api/hedge-fund-sentiment', async (req, res) => {
    try {
      const mnemonic = "FPF-ALLQHF_GAVN10_LEVERAGERATIO_AVERAGE";
      const url = `https://data.financialresearch.gov/hf/v1/series/full/?mnemonic=${mnemonic}`;
      const response = await axios.get(url);
  
      const timeseries = response.data?.[mnemonic]?.timeseries?.aggregation;
      if (!timeseries || timeseries.length === 0) {
        return res.json({ score: 0, message: "No data found" });
      }
  
      const latest = timeseries[timeseries.length - 1];
      const score = latest?.[1] ?? 0;
  
      console.log("📊 Hedge Fund Leverage Score:", score);
      res.json({ score, date: latest[0] });
    } catch (error) {
      console.error("❌ Error fetching hedge fund sentiment:", error.message);
      res.status(500).json({ error: "Failed to fetch hedge fund sentiment" });
    }
  });  
  
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
