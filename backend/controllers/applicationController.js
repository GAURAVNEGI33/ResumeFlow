const { Application, Document } = require("../models");

async function create(req, res) {
  try {
    const { documentId, company, role, status } = req.body;
    
    // Check if the document being used belongs to the user
    const doc = await Document.findByPk(documentId);
    if (!doc || doc.userId !== req.user.id) {
      return res.status(403).send({ success: false, message: "Unauthorized document" });
    }

    const application = await Application.create({
      userId: req.user.id, // Direct association to user
      documentId,
      company,
      role,
      status: status || "saved"
    });

    res.status(201).send({ success: true, application });
  } catch (error) {
    console.log("error creating application:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
}

async function listByUser(req, res) {
  try {
    const applications = await Application.findAll({ where: { userId: req.user.id } });
    res.send({ success: true, applications });
  } catch (error) {
    console.log("error fetching applications:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
}

async function update(req, res) {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application || application.userId !== req.user.id) {
      return res.status(403).send({ success: false, message: "Unauthorized" });
    }
    await application.update(req.body);
    res.send({ success: true, application });
  } catch (error) {
    console.log("error updating application:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
}

async function remove(req, res) {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application || application.userId !== req.user.id) {
      return res.status(403).send({ success: false, message: "Unauthorized" });
    }
    await application.destroy();
    res.status(204).send();
  } catch (error) {
    console.log("error deleting application:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
}

module.exports = { create, listByUser, update, remove };
