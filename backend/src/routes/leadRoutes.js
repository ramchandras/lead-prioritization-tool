const express = require("express");

const {
    getLeads
} = require("../controllers/leadController");

const router = express.Router();

router.get("/", getLeads);

module.exports = router;