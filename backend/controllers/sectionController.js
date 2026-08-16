const { Section, Document } = require("../models");

async function create(req, res) {
  try {
    const { documentId, heading, position } = req.body;
    const isSidebar = req.body.isSidebar === true;

    // SECURITY CHECK: Ensure the document belongs to the logged-in user
    const doc = await Document.findOne({ where: { id: documentId, userId: req.user.id } });
    if (!doc) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized. You do not own this document.",
      });
    }

    const created = await Section.create({ documentId, heading, position, isSidebar});
    res.status(201).send({
      success: true,
      message: "Section created successfully.",
      section: created,
    });
  } catch (error) {
    console.log("error in section create:", error);
    res.status(500).send({
      success: false,
      message: "Failed to create section.",
    });
  }
}

async function listByDocument(req, res) {
  try {
    const documentId = req.params.documentId;

    // SECURITY CHECK
    const doc = await Document.findOne({ where: { id: documentId, userId: req.user.id } });
    if (!doc) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized. You do not own this document.",
      });
    }

    const sections = await Section.findAll({ 
      where: { documentId },
      order: [['position', 'ASC']] // Usually we want sections ordered by their position
    });
    
    res.send({
      success: true,
      message: "Retrieved document sections.",
      sections,
    });
  } catch (error) {
    console.log("error in section listByDocument:", error);
    res.status(500).send({
      success: false,
      message: "Failed to retrieve sections.",
    });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    
    // Find the section and INCLUDE its parent Document so we can check the userId
    const section = await Section.findByPk(id, { include: [Document] });
    
    if (!section || section.Document.userId !== req.user.id) {
      return res.status(404).send({
        success: false,
        message: "Section not found or unauthorized.",
      });
    }
const allowedUpdates = {};

if (typeof req.body.heading === "string") {
  allowedUpdates.heading = req.body.heading.trim();
}

if (Number.isInteger(req.body.position)) {
  allowedUpdates.position = req.body.position;
}

if (typeof req.body.isSidebar === "boolean") {
  allowedUpdates.isSidebar = req.body.isSidebar;
}

await section.update(allowedUpdates);
    res.send({
      success: true,
      message: "Section updated.",
      section,
    });
  } catch (error) {
    console.log("error in section update:", error);
    res.status(500).send({
      success: false,
      message: "Failed to update section.",
    });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    
    const section = await Section.findByPk(id, { include: [Document] });
    
    if (!section || section.Document.userId !== req.user.id) {
      return res.status(404).send({
        success: false,
        message: "Section not found or unauthorized.",
      });
    }

    await section.destroy();
    res.status(204).send();
  } catch (error) {
    console.log("error in section remove:", error);
    res.status(500).send({
      success: false,
      message: "Failed to remove section.",
    });
  }
}

module.exports = {
  create,
  listByDocument,
  update,
  remove,
};
