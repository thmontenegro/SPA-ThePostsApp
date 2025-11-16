import { useEffect, useState } from "react";
import "./App.css";

function Post({ _id, title, author, body, date, onEdit, onDelete }) {
  const pretty = date ? new Date(date).toLocaleString() : "";
  return (
    <article className="post-card">
      <div className="post-header">
        <h2 className="post-title">{title}</h2>
        <div className="post-meta">by {author} · {pretty}</div>
      </div>
      <div className="post-body">{body}</div>
      <div className="post-actions post-actions-inside">
        <button onClick={() => onEdit && onEdit({ _id, title, author, body, date })} className="btn small">Edit</button>
        <button onClick={() => onDelete && onDelete(_id)} className="btn small danger">Delete</button>
      </div>
    </article>
  );
}

function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", body: "" });
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({ title: "", author: "", body: "" });

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
  const data = await response.json();
  // normalize any legacy docs that might still have `tittle`
  const normalized = Array.isArray(data) ? data.map(p => ({ ...p, title: p.title ?? p.tittle })) : [];
  setPosts(normalized);
    } catch (e) {
      console.error(e);
      alert("Error fetching posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Create failed");
      setForm({ title: "", author: "", body: "" });
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    }
  };

  const startEdit = (p) => {
  setEditingId(p._id);
  setEditingForm({ title: p.title ?? p.tittle, author: p.author, body: p.body });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
  setEditingId(null);
  setEditingForm({ title: "", author: "", body: "" });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingForm((f) => ({ ...f, [name]: value }));
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/posts/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingForm),
      });
      if (!res.ok) throw new Error("Update failed");
      cancelEdit();
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to update post");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Posts</h1>
        <p className="lead">Create, edit and manage posts</p>
      </header>

      <section className="form-section">
        {!editingId && (
          <form onSubmit={handleCreate} className="post-form">
            <h3>Create new post</h3>

            <div className="form-row">
              <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="input" />
              <input name="author" value={form.author} onChange={handleChange} placeholder="Author" required className="input" />
            </div>

            <textarea name="body" value={form.body} onChange={handleChange} placeholder="Body" required rows={4} className="textarea" />

            <div className="form-actions">
              <button type="submit" className="btn primary">Create</button>
            </div>
          </form>
        )}

        {editingId && (
          <form onSubmit={submitEdit} className="post-form edit-form">
            <h3>Editing</h3>
            <input name="title" placeholder="Title" value={editingForm.title} onChange={handleEditChange} required className="input" />
            <input name="author" placeholder="Author" value={editingForm.author} onChange={handleEditChange} required className="input" />
            <textarea name="body" placeholder="Body" value={editingForm.body} onChange={handleEditChange} rows={3} className="textarea" required />
            <div className="form-actions">
              <button type="submit" className="btn primary">Save</button>
              <button type="button" onClick={cancelEdit} className="btn ghost">Cancel</button>
            </div>
          </form>
        )}
      </section>

      <section className="posts-section">
        {posts?.length > 0 ? (
          posts.map((p) => (
            <div key={p._id} className="post-item">
              <Post _id={p._id} title={p.title ?? p.tittle} author={p.author} body={p.body} date={p.date} onEdit={startEdit} onDelete={handleDelete} />
            </div>
          ))
        ) : (
          <p className="no-posts">No posts available.</p>
        )}
      </section>
    </div>
  );
}

export default App;