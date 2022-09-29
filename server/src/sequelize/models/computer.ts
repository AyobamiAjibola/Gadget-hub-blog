'use strict';
import {
  Model, UUIDV4
} from 'sequelize';

interface ComputerAttributes {
  id: string,
  model: string,
  name: string,
  userId: string
}
module.exports = (sequelize: any, DataTypes: any) => {
  class Computer extends Model <ComputerAttributes>
  implements ComputerAttributes{

    id!: string;
    model!: string;
    name!: string;
    userId!: string;

    static associate(models: any) {
      Computer.hasOne(models.ComputerPicture);
      Computer.hasOne(models.DescComputer);
      Computer.belongsTo(models.ComputerType);
      Computer.belongsTo(models.ComputerCompany);
    }
  }
  Computer.init({
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
    modelName: 'Computer',
  });
  return Computer;
};