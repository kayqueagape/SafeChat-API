import { DataTypes } from "sequelize";

import sequilize from "../db/sequilizedb.js";

const User = sequilize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: true,
});

User.sync();

export default User;
