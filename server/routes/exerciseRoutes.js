const express = require("express");
const router = express.Router();
const Exercise = require("../models/Exercise");

// GET exercises with filters & pagination
router.get("/", async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    grade,
    subject,
    difficulty,
    tags,
  } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { exerciseCode: { $regex: search, $options: "i" } },
      { question: { $regex: search, $options: "i" } },
    ];
  }

  if (grade) filter.grade = grade;
  if (subject) filter.subject = subject;
  if (difficulty) filter.difficulty = difficulty;
  if (tags) filter.tags = { $all: tags.split(",") };

  const total = await Exercise.countDocuments(filter);
  const exercises = await Exercise.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ data: exercises, total });
});

// POST new exercise
router.post("/", async (req, res) => {
  try {
    const newExercise = new Exercise(req.body);
    await newExercise.save();
    res.status(201).json(newExercise);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update exercise
router.put("/:id", async (req, res) => {
  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedExercise);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE exercise
router.delete("/:id", async (req, res) => {
  try {
    await Exercise.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Exercise deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET exercise by id
router.get("/:id", async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: "Không tìm thấy bài tập" });
    }
    res.json(exercise);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
