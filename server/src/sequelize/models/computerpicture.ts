'use strict';
import {
  Model, UUIDV4
} from 'sequelize';

interface pictureAttributes {
  id: string,
  image: string
}
module.exports = (sequelize: any, DataTypes: any) => {
  class ComputerPicture extends Model <pictureAttributes>
  implements pictureAttributes{

    id!: string;
    image!: string;

    static associate(models: any) {
      ComputerPicture.belongsTo(models.Computer,
        {onDelete: 'cascade', hooks: true}
      )
    }
  }
  ComputerPicture.init({
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
    modelName: 'ComputerPicture',
  });
  return ComputerPicture;
};