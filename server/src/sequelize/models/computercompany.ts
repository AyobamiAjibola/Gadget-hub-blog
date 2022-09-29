'use strict';
import {
  Model, UUIDV4
} from 'sequelize';

interface computerAttributes {
  id: string,
  name: string
}
module.exports = (sequelize: any, DataTypes: any) => {
  class ComputerCompany extends Model <computerAttributes>
  implements computerAttributes{

    id!: string;
    name!: string;

    static associate(models: any) {
      // define association here
    }
  }
  ComputerCompany.init({
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
    modelName: 'ComputerCompany',
  });
  return ComputerCompany;
};