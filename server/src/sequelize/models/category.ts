'use strict';
import {
  Model, UUIDV4
} from 'sequelize';

interface categoryAttributes {
  id: string,
  category: string
}
module.exports = (sequelize: any, DataTypes: any) => {
  class Category extends Model <categoryAttributes>
  implements categoryAttributes{

    id!: string;
    category!: string;

    static associate(models: any) {
      Category.hasMany(models.Post);
    }
  }
  Category.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    category: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};