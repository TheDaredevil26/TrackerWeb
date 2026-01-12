import express from "express"
import mongoose from "mongoose"
import authRoutes from "./routes/auth.js";
import session from "express-session";
import { requireAuth } from "./middleware/requireauth.js";
import knowledgeRoutes from "./routes/knowledge.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const app = express()

app.use(express.json());

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
};
app.use(cors(corsOptions));

app.set('trust proxy', 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60
    }
  })
);

app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/js", express.static(path.join(__dirname, "../frontend/js")));
app.use("/styles", express.static(path.join(__dirname, "../frontend/styles")));
app.use(express.static(path.join(__dirname, "../frontend/pages"), { extensions: ['html'] }));


app.use("/auth", authRoutes);
let conn =  await mongoose.connect(process.env.MONGO_URI).then(()=>{console.log("Connected")}
).catch((err)=>{console.log(err)})

app.use("/knowledge", knowledgeRoutes);
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/index.html"));
});

app.get("/me", (req, res) => {

  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({
    session: req.session.userId
  });
});


app.get("/protected", requireAuth, (req,res)=>{
    res.json({
        message : "You are authorised.",
        userId : req.session.userId
    })

});
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`)
})



