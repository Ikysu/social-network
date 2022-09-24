import { DataTypes, UUID } from "sequelize"
export default {
    login: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
        noUpdate: true
    },
    password: {
        type: DataTypes.STRING
    },
    pid: {
        type: UUID,
        allowNull: false,
        noUpdate: true
    }
}