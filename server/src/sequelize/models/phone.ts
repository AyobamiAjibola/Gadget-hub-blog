'use strict';
import {
  Model, UUIDV4
} from 'sequelize';

interface PhoneAttributes {
  id: string,
  model: string,
  name: string,
  userId: string
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Phone extends Model <PhoneAttributes>
  implements PhoneAttributes{

    id!: string;
    model!: string;
    name!: string;
    userId!: string

    static associate(models: any) {
      Phone.hasOne(models.PhonePicture);
      Phone.hasOne(models.DescPhone);
      Phone.belongsTo(models.PhoneType);
      Phone.belongsTo(models.PhoneCompany);
    }
  }
  Phone.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    model: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Phone',
  });
  return Phone;
};