const express = require("express");
const router = express.Router();

// Connect document routes
router.use("/documents", require("./documentRoutes"));

// Connect auth routes
router.use("/auth", require("./authRoutes"));

// Connect section routes
router.use("/sections", require("./sectionRoutes"));

// Connect item routes
router.use("/items", require("./itemRoutes"));

// Connect template routes
router.use("/templates", require("./templateRoutes"));

// Connect share routes
router.use("/shares", require("./shareRoutes"));

// Connect version routes
router.use("/versions", require("./versionRoutes"));

// Connect application routes
router.use("/applications", require("./applicationRoutes"));

// Connect AI routes
router.use("/ai", require("./aiRoutes"));

// Connect export routes
router.use("/export", require("./exportRoutes"));

// Connect dashboard routes
router.use("/dashboard", require("./dashboardRoutes"));

module.exports = router;
