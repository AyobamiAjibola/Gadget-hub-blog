'use strict';
import {
  Model, UUIDV4
} from 'sequelize';

interface ImageAttributes {
  id: string,
  image: any,
  postId: string
}
module.exports = (sequelize: any, DataTypes: any) => {
  class Picture extends Model <ImageAttributes>
  implements ImageAttributes{

    id!: string;
    image!: any;
    postId!: string;

    static associate(models: any) {
      Picture.belongsTo(models.Post,
        {onDelete: 'cascade', hooks: true}
      )
    }
  }
  Picture.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    image: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    postId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'PostId'
    }
  }, {
    sequelize,
    modelName: 'Picture',
  });
  return Picture;
};