import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function Post({ tittle, author, body, date }){
  const pretty = date ? new Date(date).toLocaleString() : "";
  return(
    <div style={{borderWidth:"1px", borderColor:"lightgray", borderStyle:"solid", borderRadius:"5px", padding: '8px', marginBottom: '8px'}}>
      <h2>{tittle}</h2>
      <p style={{marginTop: 0}}>by {author} on {pretty}</p>
      <div>{body}</div>
    </div>
  )
}

function App() {
  const [post, setPost] = useState([]);
  const [form, setForm] = useState({ tittle: "", author: "", body: "" });
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({ tittle: "", author: "", body: "" });

  const fetchPosts = async () => {
    try{
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPost(data);
    }catch(e){
      console.error(e);
      alert("Error fetching posts");
  }
}

useEffect(() => {
  fetchPosts();
}, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    try{
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Create failed');
      setForm({ tittle: "", author: "", body: "" });
      fetchPosts();
    }catch(err){
      console.error(err);
      alert('Failed to create post');
    }
  }

  const startEdit = (p) => {
    setEditingId(p._id);
    setEditingForm({ tittle: p.tittle, author: p.author, body: p.body });
  }

  const cancelEdit = () => {
    setEditingId(null);
    setEditingForm({ tittle: "", author: "", body: "" });
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingForm(f => ({ ...f, [name]: value }));
  }

  const submitEdit = async (e) => {
    e.preventDefault();
    try{
      const res = await fetch(`/api/posts/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingForm)
      });
      if (!res.ok) throw new Error('Update failed');
      cancelEdit();
      fetchPosts();
    }catch(err){
      console.error(err);
      alert('Failed to update post');
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try{
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchPosts();
    }catch(err){
      console.error(err);
      alert('Failed to delete post');
    }
  }

  return (
    <div style={{padding: '12px'}}>
      <h1>Posts</h1>

      <form onSubmit={handleCreate} style={{marginBottom: '16px'}}>
        <h3>Create new post</h3>
        <input name="tittle" value={form.tittle} onChange={handleChange} placeholder="Title" required />
        <input name="author" value={form.author} onChange={handleChange} placeholder="Author" required />
        <br />
        <textarea name="body" value={form.body} onChange={handleChange} placeholder="Body" required rows={4} cols={40} />
        <br />
        <button type="submit">Create</button>
      </form>

      {post?.length > 0 ? (
        post.map(p => (
          <div key={p._id}>
            {editingId === p._id ? (
              <form onSubmit={submitEdit} style={{marginBottom: '8px'}}>
                <input name="tittle" value={editingForm.tittle} onChange={handleEditChange} required />
                <input name="author" value={editingForm.author} onChange={handleEditChange} required />
                <br />
                <textarea name="body" value={editingForm.body} onChange={handleEditChange} rows={3} cols={40} required />
                <br />
                <button type="submit">Save</button>
                <button type="button" onClick={cancelEdit}>Cancel</button>
              </form>
            ) : (
              <>
                <Post tittle={p.tittle} author={p.author} body={p.body} date={p.date} />
                <button onClick={() => startEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </>
            )}
          </div>
        ))
      ) : (
        <p>No post available.</p>
      )}
    </div>
  )
}

export default App;