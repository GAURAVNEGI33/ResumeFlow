"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Application.belongsTo(models.User, { foreignKey: "userId" });
      Application.belongsTo(models.Document, { foreignKey: "documentId" });
    }
  }
  Application.init(
    {
      company: DataTypes.STRING,
      role: DataTypes.STRING,
      status: DataTypes.ENUM(
        "saved",
        "applied",
        "interview",
        "offer",
        "rejected",
      ),
      userId: DataTypes.INTEGER,
      documentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Application",
    },
  );
  return Application;
};
