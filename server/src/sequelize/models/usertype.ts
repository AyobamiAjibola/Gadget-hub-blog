'use strict';
import {
  Model, UUIDV4
} from 'sequelize';

interface Type {
  id: string;
  userType: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class UserType extends Model <Type>
  implements Type {
    id!: string;
    userType!: string;

    static associate(models: any) {
      UserType.hasMany(models.User);
    }
  }
  UserType.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    userType: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'UserType',
  });
  return UserType;
};