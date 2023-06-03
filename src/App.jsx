import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'

function App() {
  const [potions, setPotions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    ingredients: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPotions();
  }, []);

  const fetchPotions = async () => {
    const response = await axios.get('http://localhost:4000/potions');
    setPotions(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editMode) {
      // Enviar la solicitud PUT al backend para actualizar la poción
      await axios.put(`http://localhost:4000/potions/${editId}`, formData);
    } else {
      // Enviar la solicitud POST al backend para crear una nueva poción
      await axios.post('http://localhost:4000/potions', formData);
    }

    // Limpiar el formulario y actualizar la lista de pociones
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      category: '',
      ingredients: [],
    });
    setEditMode(false);
    setEditId(null);
    fetchPotions();
  };

  const handleEdit = (id) => {
    // Buscar la poción seleccionada por su ID
    const potionToEdit = potions.find((potion) => potion.id === id);

    // Actualizar el estado del formulario con los datos de la poción seleccionada
    setFormData({
      name: potionToEdit.name,
      description: potionToEdit.description,
      price: potionToEdit.price,
      quantity: potionToEdit.quantity,
      category: potionToEdit.category,
      ingredients: potionToEdit.ingredients,
    });

    setEditMode(true);
    setEditId(id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta poción?')) {
      await axios.delete(`http://localhost:4000/potions/${id}`);
      fetchPotions();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='container'> 
      <h2>Página de Pociones</h2>
      <ul>
        {potions.map((potion) => (
          <li key={potion.id}>
            <h3>{potion.name}</h3>
            <p>Descripción: {potion.description}</p>
            <p>Precio: {potion.price}</p>
            <p>Cantidad disponible: {potion.quantity}</p>
            <p>Categoría: {potion.category}</p>
            <button onClick={() => handleEdit(potion.id)}>Editar</button>
            <button onClick={() => handleDelete(potion.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <h3>{editMode ? 'Editar Poción' : 'Crear Poción'}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Descripción:
          <input
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Precio:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Cantidad:
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Categoría:
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </label>
      
        <button type="submit">{editMode ? 'Actualizar' : 'Crear'}</button>
      </form>
    </div>
  );
}

export default App;
