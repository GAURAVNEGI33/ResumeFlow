"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Document, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Application, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Export, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }

    checkPassword(plainText) {
      return bcrypt.compare(plainText, this.password);
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 8,
        },
      },
      tier: {
        type: DataTypes.ENUM("free", "pro"),
        defaultValue: "free",
      },
      aiCredits: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      resetOtp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      otpExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    },
  );

  User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  return User;
};
