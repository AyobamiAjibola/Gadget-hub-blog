import express, {Request, Response} from "express";
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
import { resolve } from "path";
import morgan from "morgan";
import morganBody from "morgan-body";
import authRoutes from './routes/auth/auth.route';
import apiRoutes from './routes/others/route';
import userRoutes from './routes/user/user.route';
import postRoutes from './routes/post/post.route';
import phoneRoutes from './routes/phone/phone.route';
import computerRoutes from './routes/computer/computer.route';
import AppError from "./utils/appError";
import { RESOURCE_NOT_FOUND } from "./constants/response-codes";
import globalErrorHandler from "./utils/error/error.controller";
import db from "./sequelize/models/index"

dotenv.config({ path: resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet({crossOriginEmbedderPolicy: false}));
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/api", apiRoutes);
app.use("/post", postRoutes);
app.use("/phone", phoneRoutes);
app.use("/computer", computerRoutes);

app.use('/uploads', express.static('uploads'));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  } else {
    morganBody(app);
}

app.get("/", (req: Request, res: Response) => {
    res.status(200).send({ data: "Welcome" });
  });

app.all("*", (req: Request, res: Response, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, RESOURCE_NOT_FOUND));
});

app.use(globalErrorHandler);
app.listen(PORT, async () => {
    console.log(`Server running on port: ${PORT} ⚡`);
    await db.sequelize.sync(); //authenticate
    console.log("Connected to database successfully")
});