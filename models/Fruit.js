const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Fruit = sequelize.define('Fruit', {
    fruit_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    },
    season: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'fruits',
    timestamps: true ,// Adds createdAt and updatedAt fields
    defaultScope: {
      order: [['id', 'ASC']]
    }
  });

  return Fruit;
};