const express = require("express");
const router = express.Router();

const sectionController = require("../controllers/sectionController");
const auth = require("../middleware/auth");
// We can use a section validator later if needed, but for now we'll stick to auth

// CREATE a new section
router.post("/", auth, sectionController.create);

// GET sections for a specific document
router.get("/document/:documentId", auth, sectionController.listByDocument);

// UPDATE a section
router.put("/:id", auth, sectionController.update);

// DELETE a section
router.delete("/:id", auth, sectionController.remove);

module.exports = router;
