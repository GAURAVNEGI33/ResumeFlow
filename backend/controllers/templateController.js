const { Template } = require("../models");

async function create(req, res) {
  try {
    const { name, config } = req.body;
    const template = await Template.create({ name, config });
    res.status(201).send({ success: true, template });
  } catch (error) {
    console.log("error creating template:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
}

async function listAll(req, res) {
  try {
    const templates = await Template.findAll();
    res.send({ success: true, templates });
  } catch (error) {
    console.log("error fetching templates:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
}

module.exports = { create, listAll };
