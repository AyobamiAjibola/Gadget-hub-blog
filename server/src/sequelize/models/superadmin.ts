'use strict';
import {
  Model, UUIDV4
} from 'sequelize';

interface AdminAttributes {
  id: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  isAdmin: boolean;
  role: string;
  uniqueValue: string;
  userTypeId: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class SuperAdmin extends Model <AdminAttributes>
  implements AdminAttributes {
    id!: string;
    fullName!: string;
    email!: string;
    password!: string;
    confirmPassword!: string;
    isAdmin!: boolean;
    role!: string;
    uniqueValue!: string;
    userTypeId!: string;

    static associate(models: any) {
      // SuperAdmin.hasMany(models.Phone);
    }
  }
  SuperAdmin.init({
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
    role: {
      type: DataTypes.STRING,
    },
    uniqueValue: {
      type: DataTypes.ENUM,
      values: ['mofaramade']
    },
    userTypeId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'UserTypeId'
    }
  }, {
    sequelize,
    modelName: 'SuperAdmin',
  });
  return SuperAdmin;
};