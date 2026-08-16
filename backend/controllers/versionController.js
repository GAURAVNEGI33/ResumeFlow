const { Version, Document } = require("../models");

async function create(req, res) {
  try {
    const { documentId, label, snapshot } = req.body;
    const doc = await Document.findByPk(documentId);
    if (!doc || doc.userId !== req.user.id) {
      return res.status(403).send({ success: false, message: "Unauthorized" });
    }
    const version = await Version.create({ documentId, label, snapshot });
    res.status(201).send({ success: true, version });
  } catch (error) {
    console.log("error creating version:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
}

async function listByDocument(req, res) {
  try {
    const { documentId } = req.params;
    const doc = await Document.findByPk(documentId);
    if (!doc || doc.userId !== req.user.id) {
      return res.status(403).send({ success: false, message: "Unauthorized" });
    }
    const versions = await Version.findAll({ where: { documentId } });
    res.send({ success: true, versions });
  } catch (error) {
    console.log("error fetching versions:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
}

module.exports = { create, listByDocument };
