import express from "express"
import mongoose from "mongoose"
import authRoutes from "./routes/auth.js";
import session from "express-session";
import { requireAuth } from "./middleware/requireauth.js";
import knowledgeRoutes from "./routes/knowledge.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()

app.use(express.json());

app.use(
  session({
    secret: "knowledge-tracker-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 3
    }
  })
);
app.use(express.static(path.join(__dirname, "../frontend/pages")));
app.use("/js", express.static(path.join(__dirname, "../frontend/js")));
app.use("/styles", express.static(path.join(__dirname, "../frontend/styles")));


app.use("/auth", authRoutes);
let conn =  await mongoose.connect("mongodb://localhost:27017/usersdb").then(()=>{console.log("Connected")}
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
app.listen(3000,()=>{
    console.log("Server started at port 3000")
})



