require("dotenv").config();
const express = require("express");
const { Client } = require("@opensearch-project/opensearch");

const app = express();
app.use(express.json());

const OPENSEARCH_URL = process.env.OPENSEARCH_URL || "http://localhost:9200";

// Initialize OpenSearch client
const client = new Client({ node: OPENSEARCH_URL });

app.get("/", (req, res) => {
    res.send("OpenSearch Backend is Running 🚀");
});

// Test OpenSearch connection
app.get("/check", async (req, res) => {
    try {
        const info = await client.info();
        res.json(info);
    } catch (error) {
        console.error("OpenSearch connection error:", error);
        res.status(500).send("OpenSearch is not reachable");
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
