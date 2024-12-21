import React, { useState, useEffect } from "react";
import './App.css';
const App = () => {
  const [user, setUser] = useState(null); // Track the logged-in user
  const [authForm, setAuthForm] = useState({ username: "", password: "" }); // Authentication form
  const [items, setItems] = useState([]); // Items list
  const [newItem, setNewItem] = useState({ name: "", description: "" }); // New item form
  const [selectedItem, setSelectedItem] = useState(null); // Selected item for update

  useEffect(() => {
    if (user) {
      fetch("http://34.194.215.177:8000/items") // Update to Docker service name
        .then((response) => response.json())
        .then((data) => setItems(data));
    }
  }, [user]);

  // Handle login and signup
  const handleAuth = (endpoint) => {
    fetch(`http://34.194.215.177:8000/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authForm),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          alert("Authentication successful");
          setUser({ username: authForm.username });
        } else {
          alert("Authentication failed");
        }
      });
  };

  // Add a new item
  const handleAddItem = () => {
    fetch("http://34.194.215.177:8000/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => response.json())
      .then((data) => {
        setItems((prevItems) => [...prevItems, data]);
        setNewItem({ name: "", description: "" });
      });
  };

  // Update an item
  const handleUpdateItem = () => {
    if (!selectedItem) return alert("No item selected for update");
    fetch(`http://34.194.215.177:8000/items/${selectedItem.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedItem),
    })
      .then((response) => response.json())
      .then(() => {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === selectedItem.id ? selectedItem : item
          )
        );
        setSelectedItem(null);
      });
  };

  // Delete an item
  const handleDeleteItem = (id) => {
    fetch(`http://34.194.215.177:8000/items/${id}`, {
      method: "DELETE",
    }).then(() => {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    });
  };

  return (
    <div className="container">
      <h1>Item Manager</h1>

      {!user ? (
        <div>
          <h2>Login / Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={authForm.username}
            onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
          />
          <button onClick={() => handleAuth("login")}>Login</button>
          <button onClick={() => handleAuth("signup")}>Register</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {user.username}</h2>
          <button onClick={() => setUser(null)}>Logout</button>

          <div>
            <input
              type="text"
              placeholder="Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
            />
            <button onClick={handleAddItem}>Add Item</button>
          </div>

          {selectedItem && (
            <div>
              <h2>Edit Item</h2>
              <input
                type="text"
                placeholder="Name"
                value={selectedItem.name}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Description"
                value={selectedItem.description}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    description: e.target.value,
                  })
                }
              />
              <button onClick={handleUpdateItem}>Update Item</button>
            </div>
          )}

          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong>: {item.description}
                <div>
                <button onClick={() => setSelectedItem(item)}>Edit</button>
                <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
