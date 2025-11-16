import express from "express";
import ViteExpress from "vite-express";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/university";

mongoose.connect(MONGO_URI, {
  // useNewUrlParser: true, // mongoose v6+ defaults are fine
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
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
    const posts = await PostModel.find({}).sort({ date: -1 }).lean();
    const normalized = posts.map(p => ({
      ...p,
      title: p.title ?? p.tittle, // fallback for legacy docs
      // strip legacy key if present in response
      ...(p.tittle !== undefined ? { tittle: undefined } : {})
    }));
    res.json(normalized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Get a single post
app.get("/api/posts/:id", async (req, res) => {
  try {
    const p = await PostModel.findById(req.params.id).lean();
    if (!p) return res.status(404).json({ error: "Post not found" });
    const normalized = { ...p, title: p.title ?? p.tittle };
    delete normalized.tittle;
    res.json(normalized);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid id" });
  }
});

// Create a post
app.post("/api/posts", async (req, res) => {
  try {
    const { title, tittle, author, body, hidden } = req.body;
    const newPost = new PostModel({ title: title ?? tittle, author, body, hidden });
    const saved = await newPost.save();
    const out = saved.toObject();
    delete out.tittle;
    res.status(201).json(out);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to create post", details: err.message });
  }
});

// Update a post
app.put("/api/posts/:id", async (req, res) => {
  try {
    const { title, tittle, author, body, hidden } = req.body;
    const update = { author, body, hidden };
    if (title !== undefined) update.title = title;
    if (title === undefined && tittle !== undefined) update.title = tittle;
    const updated = await PostModel.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    ).lean();
    if (!updated) return res.status(404).json({ error: "Post not found" });
    const out = { ...updated };
    delete out.tittle;
    res.json(out);
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