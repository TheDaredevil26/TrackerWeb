import mongoose from 'mongoose';
const { Schema } = mongoose;

const KnowledgeUnit = new Schema({
    title: { type: String, required: true},
    category: { type: String, default: "General" },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"], default: "Easy"
    },
    status: { type: String, required: true, enum: ["To Learn", "Learning", "Learned"], default: "To Learn" },
    confidence: { type: Number, required: true, default: 1 },
    notes: String,
    lastRevised: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model('KnowledgeUnit', KnowledgeUnit);


