import swaggerJSDoc from "swagger-jsdoc";
import { __dirname } from "./utils.js";

const swaggerOpt = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ecommerce Coder',
            version: '1.0.0',
            description: 'API para el Ecommerce'
        },
    },
    apis: [`${__dirname}/docs/*.yaml`]
};

export const swaggerSetup = swaggerJSDoc(swaggerOpt);