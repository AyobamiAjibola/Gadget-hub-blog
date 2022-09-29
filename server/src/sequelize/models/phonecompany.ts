'use strict';
import {
  Model, UUIDV4
} from 'sequelize';

interface companyAttributes {
  id: string,
  name: string
}
module.exports = (sequelize: any, DataTypes: any) => {
  class PhoneCompany extends Model <companyAttributes>
  implements companyAttributes{

    id!: string;
    name!: string;

    static associate(models: any) {
      PhoneCompany.hasMany(models.Phone);
    }
  }
  PhoneCompany.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'PhoneCompany',
  });
  return PhoneCompany;
};