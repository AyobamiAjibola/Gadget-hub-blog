'use strict';
import {
  Model, UUIDV4
} from 'sequelize';

interface computerAttributes {
  id: string,
  storage: string,
  ram: string,
  cpu: string,
  gen: string
}
module.exports = (sequelize: any, DataTypes: any) => {
  class DescComputer extends Model <computerAttributes>
  implements computerAttributes{

    id!: string;
    storage!: string;
    ram!: string;
    cpu!: string;
    gen!: string;

    static associate(models: any) {
      DescComputer.belongsTo(models.Computer,
        {onDelete: 'cascade', hooks: true}
      )
    }
  }
  DescComputer.init({
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
    cpu: {
      type: DataTypes.STRING
    },
    gen: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'DescComputer',
  });
  return DescComputer;
};