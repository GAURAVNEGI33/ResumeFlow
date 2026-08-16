const {Document,Section,Item,sequelize,} = require("../models");

const STARTER_SECTIONS = [
  {
    heading: "Contact",
    items: [
      "Haldwani, Uttarakhand, India",
      "+91 00000 00000",
    ],
  },
  {
    heading: "Technical Skills",
    items: [
      "C",
      "C++",
      "Node.js",
      "Express.js",
      "MongoDB",
      "PostgreSQL",
      "Redis",
      "RabbitMQ",
      "Docker",
      "Kubernetes",
      "AWS",
      "GCP",
      "Azure",
      "Linux",
      "Windows",
      "Git",
      "CI/CD",
    ],
  },
  {
    heading: "Languages",
    items: [
      "Hindi - Native",
      "English - Fluent",
    ],
  },
  {
    heading: "Awards",
    items: [
      "First Prize, World Photography Day Competition",
    ],
  },
  {
    heading: "Profile",
    items: [
      "Write two or three lines about what you do and what you are good at.",
    ],
  },
  {
    heading: "Work Experience",
    items: [
      "Company Name, City (2022 - 2024)",
      "What you did there, one line per point.",
    ],
  },
  {
    heading: "Education",
    items: [
      "Your Degree, University (2018 - 2022)",
    ],
  },
];

async function addStarterSections(documentId, transaction) {
  for (
    let sectionPosition = 0;
    sectionPosition < STARTER_SECTIONS.length;
    sectionPosition += 1
  ) {
    const starterSection = STARTER_SECTIONS[sectionPosition];

    const section = await Section.create(
      {
        documentId,
        heading: starterSection.heading,
        position: sectionPosition,
      },
      { transaction },
    );

    const items = starterSection.items.map((content, itemPosition) => ({
      sectionId: section.id,
      content,
      position: itemPosition,
    }));

    await Item.bulkCreate(items, { transaction });
  }
}

async function list(req, res) {
  try {
    const documents = await Document.findAll({ where: { userId: req.user.id } });
    res.send({
      success: true,
      message: "Retrieved the list of documents.",
      documents: documents,
    });
  } catch (error) {
    console.log("error in list", error);
    res.status(500).send({
      success: false,
      message: "Failed to retrieve the list of documents.",
    });
  }
}

async function create(req, res) {
  let transaction;

  try {
    const { title, type, templateId } = req.body;

    transaction = await sequelize.transaction();

    const created = await Document.create(
      {
        title,
        type,
        templateId: templateId || null,
        userId: req.user.id,
      },
      { transaction },
    );

    if (templateId) {
      await addStarterSections(created.id, transaction);
    }

    await transaction.commit();

    return res.status(201).send({
      success: true,
      message: "Document created.",
      document: created,
    });
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    console.log("error in create", error);

    return res.status(500).send({
      success: false,
      message: "Failed to create document.",
    });
  }
}

async function findOne(req, res) {
  try {
    const id = req.params.id;
    const document = await Document.findOne({ where: { id: id, userId: req.user.id } });
    if (!document) {
      return res.status(404).send({
        success: false,
        message: "Document not found.",
      });
    }
    res.send({
      success: true,
      message: "Retrieved the document.",
      document,
    });
  } catch (error) {
    console.log("error in findOne", error);
    res.status(500).send({
      success: false,
      message: "Failed to retrieve the document.",
    });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const document = await Document.findOne({ where: { id: id, userId: req.user.id } });
    if (!document) {
      return res.status(404).send({
        success: false,
        message: "Document not found.",
      });
    }
    await document.update(req.body);
    res.send({
      success: true,
      message: "Document updated.",
      document,
    });
  } catch (error) {
    console.log("error in update", error);
    res.status(500).send({
      success: false,
      message: "Failed to update document.",
    });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    const document = await Document.findOne({ where: { id: id, userId: req.user.id } });
    if (!document) {
      return res.status(404).send({
        success: false,
        message: "Document not found.",
      });
    }
    await document.destroy();
    res.status(204).send();
  } catch (error) {
    console.log("error in remove", error);
    res.status(500).send({
      success: false,
      message: "Failed to remove document.",
    });
  }
}

async function duplicate(req, res) {
  try {
    const id = req.params.id;
    const document = await Document.findOne({ where: { id: id, userId: req.user.id } });
    if (!document) {
      return res.status(404).send({
        success: false,
        message: "Document not found.",
      });
    }
    const copy = {
      title: document.title + " (Copy)",
      type: document.type,
      userId: req.user.id,
      templateId: document.templateId,
    };
    const createdCopy = await Document.create(copy);
    res.status(201).send({
      success: true,
      message: "Document duplicated.",
      document: createdCopy,
    });
  } catch (error) {
    console.log("error in duplicate", error);
    res.status(500).send({
      success: false,
      message: "Failed to duplicate document.",
    });
  }
}

async function importDocument(req, res) {
  try {
    const document = req.body;
    const created = await Document.create(document);
    res.status(201).send({
      success: true,
      message: "Document imported.",
      document: created,
    });
  } catch (error) {
    console.log("error in importDocument", error);
    res.status(500).send({
      success: false,
      message: "Failed to import document.",
    });
  }
}

module.exports = {
  list,
  create,
  findOne,
  update,
  remove,
  duplicate,
  importDocument,
};
