"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Section extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Section.belongsTo(models.Document, { foreignKey: "documentId" });
      Section.hasMany(models.Item, {
        foreignKey: "sectionId",
        onDelete: "CASCADE",
      });
    }
  }
  Section.init(
    {
      heading: DataTypes.STRING,
      position: DataTypes.INTEGER,
      documentId: DataTypes.INTEGER,

    isSidebar: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    },
    {
      sequelize,
      modelName: "Section",
    },
  );
  return Section;
};
