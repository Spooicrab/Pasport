import mongoose from "mongoose";
import config from "../config/config.js";
import { consolelogger } from "../winston.js";

const URI = config.mongo_uri

mongoose.connect(URI).then(() => consolelogger.info("Conectando a MongoDB")).catch((error) => consolelogger.fatal(error))
