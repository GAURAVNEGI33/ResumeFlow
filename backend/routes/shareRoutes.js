const express = require("express");
const router = express.Router();
const shareController = require("../controllers/shareController");
const auth = require("../middleware/auth");

router.post("/", auth, shareController.create);
router.get("/document/:documentId", auth, shareController.listByDocument);
router.delete("/:id", auth, shareController.remove);

module.exports = router;
