import express from "express";
import ViteExpress from "vite-express";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/university";

mongoose.connect(MONGO_URI, {
  // useNewUrlParser: true, // mongoose v6+ defaults are fine
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const PostSchema = new mongoose.Schema({
  tittle: { type: String, required: true },
  author: { type: String, required: true },
  body: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now
  },
  hidden: {
    type: Boolean,
    default: false
  }
});

const PostModel = mongoose.model("Post", PostSchema);

const app = express();
app.use(express.json());

app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});

// List posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await PostModel.find({}).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Get a single post
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid id" });
  }
});

// Create a post
app.post("/api/posts", async (req, res) => {
  try {
    const { tittle, author, body, hidden } = req.body;
    const newPost = new PostModel({ tittle, author, body, hidden });
    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to create post", details: err.message });
  }
});

// Update a post
app.put("/api/posts/:id", async (req, res) => {
  try {
    const updated = await PostModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: "Post not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to update post", details: err.message });
  }
});

// Delete a post
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const deleted = await PostModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Post not found" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to delete post" });
  }
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);