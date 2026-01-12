import express from "express"
import mongoose from "mongoose"
import authRoutes from "./routes/auth.js";
import session from "express-session";
import { requireAuth } from "./middleware/requireauth.js";
import knowledgeRoutes from "./routes/knowledge.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const app = express()

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60
    }
  })
);

app.use("/auth", authRoutes);
let conn =  await mongoose.connect(process.env.MONGO_URI).then(()=>{console.log("Connected")}
).catch((err)=>{console.log(err)})

app.use("/knowledge", knowledgeRoutes);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/index.html"));
  res.send("Welcome")
  console.log("Running")
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



