const express = require("express");
const cors = require("cors");

const leadRoutes = require("./routes/leadRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "Lead Prioritization API is running"
    });
});

// Lead APIs
app.use("/api/leads", leadRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});