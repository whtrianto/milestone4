import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const USER_ID = process.env.REACT_APP_USER_ID || 'user-123';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'x-user-id': USER_ID,
      'Content-Type': 'application/json',
    },
  });

  const fetchTodos = async (searchQuery = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = searchQuery ? { search: searchQuery } : {};
      const response = await api.get('/todos', { params });
      setTodos(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await api.post('/todos', { title: title.trim() });
      setTitle('');
      fetchTodos(search);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.patch(`/todos/${id}`);
      fetchTodos(search);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to toggle todo');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query);
    fetchTodos(query);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Todo App</h1>

        <div className="form-section">
          <form onSubmit={handleAdd} className="add-form">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter todo title..."
              className="todo-input"
              disabled={loading}
            />
            <button type="submit" className="btn-add" disabled={loading}>
              Add
            </button>
          </form>
        </div>

        <div className="search-section">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search todos..."
            className="search-input"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}

        {loading && todos.length === 0 && (
          <div className="loading">Loading...</div>
        )}

        <div className="todos-section">
          {todos.length === 0 && !loading ? (
            <div className="empty-state">No todos found</div>
          ) : (
            <table className="todos-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {todos.map((todo, index) => (
                  <tr key={todo.id}>
                    <td>{index + 1}</td>
                    <td>{todo.title}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggle(todo.id)}
                        disabled={loading}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

