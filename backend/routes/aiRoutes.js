const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const auth = require("../middleware/auth");

router.post("/improve", auth, aiController.improveText);

module.exports = router;
