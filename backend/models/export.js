"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Export extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Export.belongsTo(models.User, { foreignKey: "userId" });
      Export.belongsTo(models.Document, { foreignKey: "documentId" });
    }
  }
  Export.init(
    {
      format: DataTypes.ENUM("pdf", "docx"),
      fileUrl: DataTypes.STRING,
      documentId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Export",
    },
  );
  return Export;
};
