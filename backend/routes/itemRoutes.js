const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");
const auth = require("../middleware/auth");

// CREATE a new item
router.post("/", auth, itemController.create);

// GET items for a specific section
router.get("/section/:sectionId", auth, itemController.listBySection);

// UPDATE an item
router.put("/:id", auth, itemController.update);

// DELETE an item
router.delete("/:id", auth, itemController.remove);

module.exports = router;
