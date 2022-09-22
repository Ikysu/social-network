import { DataTypes, UUID, UUIDV4 } from "sequelize"
export default {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
        noUpdate: true
    },
    username: {
        type: DataTypes.STRING
    },
    avatar:{
        type: DataTypes.STRING
    },
    friends: {
        type: DataTypes.JSON
    }
}