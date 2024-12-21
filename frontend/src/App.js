import React, { useState, useEffect } from "react";

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", description: "" });
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetch("http://backend:8000/items")
      .then((response) => response.json())
      .then((data) => setItems(data));
  }, []);

  const handleAddItem = () => {
    fetch("http://backend:8000/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: Date.now(), ...newItem }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setItems((prevItems) => [...prevItems, data.item]);
        setNewItem({ name: "", description: "" });
      });
  };

  const handleUpdateItem = () => {
    if (!selectedItem) {
      alert("No item selected for update");
      return;
    }
    fetch(`http://backend:8000/items/${selectedItem.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedItem),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === selectedItem.id ? data.item : item
          )
        );
        setSelectedItem(null);
      });
  };

  const handleDeleteItem = (id) => {
    fetch(`http://backend:8000/items/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      });
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  return (
    <div>
      <h1>Item Manager</h1>

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
            <button onClick={() => handleSelectItem(item)}>Edit</button>
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
