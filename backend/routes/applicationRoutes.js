const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const auth = require("../middleware/auth");

router.post("/", auth, applicationController.create);
router.get("/", auth, applicationController.listByUser);
router.put("/:id", auth, applicationController.update);
router.delete("/:id", auth, applicationController.remove);

module.exports = router;
