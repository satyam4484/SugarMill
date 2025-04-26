import express,{Express} from "express";
import cors from "cors"
import router from "./routes/index.routes.js";
import appConfigs from "./utils/config.js";

const app:Express = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw());
app.use(express.text());



app.use(cors({
    origin: 'http://localhost:5173', // Specify the frontend origin explicitly
    credentials: true,
}))


// router tp serve all the routers
app.use('/api',router);

export default app;