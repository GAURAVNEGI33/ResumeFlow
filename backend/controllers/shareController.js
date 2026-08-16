const { Share, Document } = require("../models");

async function create(req, res) {
  try {
    const { documentId, slug } = req.body;
    const doc = await Document.findByPk(documentId);
    if (!doc || doc.userId !== req.user.id) {
      return res.status(403).send({ success: false, message: "Unauthorized" });
    }
    const share = await Share.create({ documentId, slug });
    res.status(201).send({ success: true, share });
  } catch (error) {
    console.log("error creating share:", error);
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
    const shares = await Share.findAll({ where: { documentId } });
    res.send({ success: true, shares });
  } catch (error) {
    console.log("error fetching shares:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
}

async function remove(req, res) {
  try {
    const share = await Share.findByPk(req.params.id, { include: [Document] });
    if (!share || share.Document.userId !== req.user.id) {
      return res.status(403).send({ success: false, message: "Unauthorized" });
    }
    await share.destroy();
    res.status(204).send();
  } catch (error) {
    console.log("error deleting share:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
}

module.exports = { create, listByDocument, remove };
