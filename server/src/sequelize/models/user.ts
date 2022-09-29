'use strict';
import {
  Model, UUIDV4
} from 'sequelize';

interface UserAttributes {
  id: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  isAdmin: boolean;
  userTypeId: string;
  role: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model <UserAttributes>
  implements UserAttributes {
    id!: string;
    fullName!: string;
    email!: string;
    password!: string;
    confirmPassword!: string;
    isAdmin!: boolean;
    userTypeId!: string;
    role!: string;

    static associate(models: any) {
      User.belongsTo(models.UserType);
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    fullName: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    confirmPassword: {
      type: DataTypes.STRING
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    userTypeId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'UserTypeId'
    },
    role: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};