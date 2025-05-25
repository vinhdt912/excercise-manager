const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  text: String,
  correct: Boolean,
});

const ExerciseSchema = new mongoose.Schema({
  exerciseCode: String,
  grade: Number,
  subject: String,
  difficulty: String,
  question: String,
  tags: [String],
  isMultipleChoice: Boolean,
  answers: [AnswerSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Exercise", ExerciseSchema);
