import mongoose from "mongoose";
import config from "../config/config.js";

const URI = config.mongo_uri

mongoose.connect(URI).then(() => console.log("Conectado a MongoDB")).catch((error) => console.log(error))
