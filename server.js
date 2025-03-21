require("dotenv").config();
const express = require("express");
const { Client } = require("@opensearch-project/opensearch");

const app = express();
app.use(express.json());

// Serve static files (index.html)
app.use(express.static("public"));

// OpenSearch is served in 9200
const OPENSEARCH_URL = process.env.OPENSEARCH_URL || "http://localhost:9200";

// Initialize OpenSearch client
const client = new Client({ node: OPENSEARCH_URL });

// Get paintings with dynamic filtering
app.get("/paintings", async (req, res) => {
    const { filter_key, filter_value } = req.query;

    if (!filter_key || !filter_value) {
        return res
            .status(400)
            .json({ error: "Please provide filter_key and filter_value" });
    }

    try {
        const response = await client.search({
            index: "paintings",
            body: {
                query: { match: { [filter_key]: filter_value } },
            },
        });

        res.json(response.body.hits.hits.map((hit) => hit._source));
    } catch (error) {
        console.error("Error fetching paintings:", error);
        res.status(500).send("Error fetching paintings");
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
);
