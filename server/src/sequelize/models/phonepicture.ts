'use strict';
import {
  Model, UUIDV4
} from 'sequelize';

interface pictureAttributes {
  id: string,
  image: string
}
module.exports = (sequelize: any, DataTypes: any) => {
  class PhonePicture extends Model <pictureAttributes>
  implements pictureAttributes{

    id!: string;
    image!: string;

    static associate(models: any) {
      PhonePicture.belongsTo(models.Phone,
        {onDelete: 'cascade', hooks: true}
      )
    }
  }
  PhonePicture.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    image: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    }
  }, {
    sequelize,
    modelName: 'PhonePicture',
  });
  return PhonePicture;
};