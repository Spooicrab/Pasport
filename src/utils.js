import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import config from "./config/config.js";

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const HashData = async (data) => {
    data = data.toString()
    return bcrypt.hash(data, 10)
};

export const CompareData = async (data, HashedData) => {
    data = data.toString()
    return bcrypt.compare(data, HashedData)
}

const JWTSECRET = config.jwtsecret

export const generateToken = (data) => {
    const token = jwt.sign(data, JWTSECRET, { expiresIn: 60000 })
    return token
}