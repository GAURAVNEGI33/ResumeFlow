const express = require("express");
const router = express.Router();
const shareController = require("../controllers/shareController");
const auth = require("../middleware/auth");

// Public route - anyone can view a shared resume by slug
router.get("/public/:slug", shareController.getBySlug);

// Protected routes - authenticated user actions
router.post("/", auth, shareController.create);
router.get("/document/:documentId", auth, shareController.listByDocument);
router.delete("/:id", auth, shareController.remove);

module.exports = router;
