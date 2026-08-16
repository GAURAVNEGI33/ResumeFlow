const express = require("express");
const router = express.Router();

const documentController = require("../controllers/documentController");
const validate = require("../middleware/documentValidator");

const auth = require("../middleware/auth");

router.get("/", auth, documentController.list);
router.post("/", auth, documentController.create);
router.post("/import", auth, documentController.importDocument);
router.get("/:id", auth, validate, documentController.findOne);
router.put("/:id", auth, validate, documentController.update);
router.post("/:id/duplicate", auth, validate, documentController.duplicate);
router.delete("/:id", auth, validate, documentController.remove);

module.exports = router;
