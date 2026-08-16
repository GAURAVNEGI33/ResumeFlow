"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Share extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Share.belongsTo(models.Document, { foreignKey: "documentId" });
    }
  }
  Share.init(
    {
      slug: DataTypes.STRING,
      documentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Share",
    },
  );
  return Share;
};
