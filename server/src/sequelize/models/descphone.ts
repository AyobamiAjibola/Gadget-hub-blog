'use strict';
import {
  Model, UUIDV4
} from 'sequelize';

interface descAttributes {
  id: string,
  storage: string,
  ram: string,
  camera: string
}
module.exports = (sequelize: any, DataTypes: any) => {
  class DescPhone extends Model <descAttributes>
  implements descAttributes{

    id!: string;
    storage!: string;
    ram!: string;
    camera!: string;

    static associate(models: any) {
      DescPhone.belongsTo(models.Phone,
        {onDelete: 'cascade', hooks: true}
      )
    }
  }
  DescPhone.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    storage: {
      type: DataTypes.STRING
    },
    ram: {
      type: DataTypes.STRING
    },
    camera: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'DescPhone',
  });
  return DescPhone;
};