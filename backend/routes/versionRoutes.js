const express = require("express");
const router = express.Router();
const versionController = require("../controllers/versionController");
const auth = require("../middleware/auth");

router.post("/", auth, versionController.create);
router.get("/document/:documentId", auth, versionController.listByDocument);

module.exports = router;
