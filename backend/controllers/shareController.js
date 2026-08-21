const { Share, Document, Section, Item, User, Template } = require("../models");

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

// Public access endpoint for shared resume
async function getBySlug(req, res) {
  try {
    const { slug } = req.params;
    const share = await Share.findOne({
      where: { slug },
      include: [
        {
          model: Document,
          include: [
            {
              model: User,
              attributes: ["id", "name", "email"]
            },
            {
              model: Section,
              include: [
                {
                  model: Item,
                }
              ]
            }
          ]
        }
      ]
    });

    if (!share || !share.Document) {
      return res.status(404).send({
        success: false,
        message: "Shared resume not found or link has expired."
      });
    }

    // Sort sections and their items by position ASC
    const docData = share.Document.toJSON();
    if (docData.Sections && Array.isArray(docData.Sections)) {
      docData.Sections.sort((a, b) => (a.position || 0) - (b.position || 0));
      docData.Sections.forEach(section => {
        if (section.Items && Array.isArray(section.Items)) {
          section.Items.sort((a, b) => (a.position || 0) - (b.position || 0));
        }
      });
    }

    res.send({
      success: true,
      share: {
        id: share.id,
        slug: share.slug,
        createdAt: share.createdAt,
        document: docData
      }
    });
  } catch (error) {
    console.log("error in getBySlug:", error);
    res.status(500).send({ success: false, message: "Failed to load shared resume." });
  }
}

module.exports = { create, listByDocument, remove, getBySlug };
