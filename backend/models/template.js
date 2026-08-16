"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Template extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Template.hasMany(models.Document, {
        foreignKey: "templateId",
        onDelete: "SET NULL",
      });
    }
  }
  Template.init(
    {
      name: DataTypes.STRING,
      config: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Template",
    },
  );
  return Template;
};
