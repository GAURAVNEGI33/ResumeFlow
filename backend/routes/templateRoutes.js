const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");
const auth = require("../middleware/auth");

router.post("/", auth, templateController.create);
router.get("/", auth, templateController.listAll);

module.exports = router;
