import { DataTypes, UUID } from "sequelize"
export default {
    login: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
    },
    password: {
        type: DataTypes.STRING
    },
    profile_id: {
        type: UUID,
        allowNull: false
    }
}