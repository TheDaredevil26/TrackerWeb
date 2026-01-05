import express from "express"
import knowledgeunit from "../models/knowledgeunit.js"
import { requireAuth } from "../middleware/requireauth.js";

const router = express.Router();


router.post("/add", requireAuth, async(req,res)=>{
    const unit = new knowledgeunit({
        title : req.body.title,
        category : req.body.category,
        difficulty : req.body.difficulty,
        status : req.body.status,
        confidence : req.body.confidence,
        notes : req.body.notes,
        lastRevised : req.body.lastRevised,
        createdAt : req.body.createdAt,
        userId : req.session.userId
})
    await unit.save();
    res.status(201).json({ message: "Knowledge unit added successfully." });;

});

router.get("/all", requireAuth, async(req,res)=>{
    const units = await knowledgeunit.find({ userId : req.session.userId });
    if (units.length === 0) {
        return res.status(200).json({ message: "No knowledge units found." });}
    res.json(units);
});

router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "title",
      "category",
      "difficulty",
      "status",
      "confidence",
      "notes"
    ];

    const updates = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    const updatedUnit = await knowledgeunit.findOneAndUpdate(
      { _id: id, userId: req.session.userId },
      { $set: updates },
      { new: true }
    );

    if (!updatedUnit) {
      return res.status(404).json({ message: "Knowledge unit not found" });
    }

    res.json(updatedUnit);
  } catch (err) {
    res.status(500).json({ message: "Failed to update knowledge unit" });
  }
});

router.delete("/del/:id", requireAuth, async(req,res)=>{
    const { id } = req.params;
    const deletedUnit = await knowledgeunit.findOneAndDelete({ _id: id, userId: req.session.userId });
    if (!deletedUnit) {
        return res.status(404).json({ message: "Knowledge unit not found." });
    }
    res.json({ message: "Knowledge unit deleted successfully." });
});

export default router;

