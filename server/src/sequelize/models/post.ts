'use strict';
import {
  Model, UUIDV4
} from 'sequelize';

interface PostAttributes {
  id: string,
  title: string,
  post: string,
  name: string, //posters name
  userId: string,
  categoryId: string
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Post extends Model <PostAttributes>
  implements PostAttributes{
    id!: string;
    title!: string;
    post!: string;
    name!: string;
    userId!: string;
    categoryId!: string;

    static associate(models: any) {
      Post.hasMany(models.Picture);
      Post.belongsTo(models.Category);
    }
  }
  Post.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING
    },
    post: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.STRING
    },
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'CategoryId'
    },
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};