const { Item, Section, Document } = require("../models");

async function create(req, res) {
  try {
    const { sectionId, content, position } = req.body;

    // SECURITY CHECK: Find the section AND its parent document to check ownership
    const section = await Section.findByPk(sectionId, { include: [Document] });
    
    if (!section || section.Document.userId !== req.user.id) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized. You do not own this section.",
      });
    }

    const created = await Item.create({ sectionId, content, position });
    res.status(201).send({
      success: true,
      message: "Item created successfully.",
      item: created,
    });
  } catch (error) {
    console.log("error in item create:", error);
    res.status(500).send({
      success: false,
      message: "Failed to create item.",
    });
  }
}

async function listBySection(req, res) {
  try {
    const sectionId = req.params.sectionId;

    // SECURITY CHECK
    const section = await Section.findByPk(sectionId, { include: [Document] });
    
    if (!section || section.Document.userId !== req.user.id) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized. You do not own this section.",
      });
    }

    const items = await Item.findAll({ 
      where: { sectionId },
      order: [['position', 'ASC']] // Order bullet points correctly
    });
    
    res.send({
      success: true,
      message: "Retrieved section items.",
      items,
    });
  } catch (error) {
    console.log("error in item listBySection:", error);
    res.status(500).send({
      success: false,
      message: "Failed to retrieve items.",
    });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    
    // SECURITY CHECK: We must go up the chain: Item -> Section -> Document
    const item = await Item.findByPk(id, { 
      include: [{
        model: Section,
        include: [Document]
      }]
    });
    
    if (!item || item.Section.Document.userId !== req.user.id) {
      return res.status(404).send({
        success: false,
        message: "Item not found or unauthorized.",
      });
    }

    await item.update(req.body);
    res.send({
      success: true,
      message: "Item updated.",
      item,
    });
  } catch (error) {
    console.log("error in item update:", error);
    res.status(500).send({
      success: false,
      message: "Failed to update item.",
    });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    
    const item = await Item.findByPk(id, { 
      include: [{
        model: Section,
        include: [Document]
      }]
    });
    
    if (!item || item.Section.Document.userId !== req.user.id) {
      return res.status(404).send({
        success: false,
        message: "Item not found or unauthorized.",
      });
    }

    await item.destroy();
    res.status(204).send();
  } catch (error) {
    console.log("error in item remove:", error);
    res.status(500).send({
      success: false,
      message: "Failed to remove item.",
    });
  }
}

module.exports = {
  create,
  listBySection,
  update,
  remove,
};
