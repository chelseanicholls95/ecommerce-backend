const { Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connection");

const schema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "Product",
      key: "id",
    },
    onDelete: "cascade",
    onUpdate: "cascade",
  },
  tag_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "Tag",
      key: "id",
    },
    onDelete: "cascade",
    onUpdate: "cascade",
  },
};

const options = {
  sequelize,
  timestamps: false,
  freezeTableName: true,
  underscored: true,
  modelName: "product_tag",
};

class ProductTag extends Model {}

ProductTag.init(schema, options);

module.exports = ProductTag;
