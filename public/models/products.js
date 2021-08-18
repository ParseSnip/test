const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Product = sequelize.define('Products', {
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    // allowNull defaults to true
    allowNull: false
  },
  quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  color:{
    type: DataTypes.STRING
  },
  id: {
    type: DataTypes.STRING,
    unique: true
  },
  description:{
    type: DataTypes.STRING
  }
},{
    freezeTableName: true
});

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true

module.exports = {Product}