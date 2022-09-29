'use strict';
import {
  Model, UUIDV4
} from 'sequelize';

interface typeAttributes {
  id: string,
  type: string
}
module.exports = (sequelize: any, DataTypes: any) => {
  class PhoneType extends Model <typeAttributes>
  implements typeAttributes{

    id!: string;
    type!: string;

    static associate(models: any) {
      PhoneType.hasMany(models.Phone);
    }
  }
  PhoneType.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'PhoneType',
  });
  return PhoneType;
};