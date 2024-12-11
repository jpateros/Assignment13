import React, { useState } from 'react';
import axios from 'axios';

const RESET_VALUES = { id: '', category: '', price: '', name: '', instock: true };

const ProductForm = ({ onSave }) => {
  const [product, setProduct] = useState({ ...RESET_VALUES });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateFields = ({ name, category, price }) => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!category) newErrors.category = 'Category is required';
    if (!price) newErrors.price = 'Price is required';
    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const fieldErrors = validateFields(product);

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    try {
      const newProduct = {
        id: Date.now(),
        product: {
          productid: Date.now(),
          category: product.category,
          price: parseFloat(product.price),
          name: product.name,
          instock: product.instock,
        },
      };

      await axios.post('http://localhost:5000/product/create', newProduct);

      onSave(newProduct);

      setProduct({ ...RESET_VALUES });
      setErrors({});
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <h4>Add a New Product</h4>
      <div>
        <label>
          Name
          <input
            type="text"
            name="name"
            className="form-control"
            value={product.name}
            onChange={handleChange}
          />
        </label>
        {errors.name && <small className="text-danger">{errors.name}</small>}
      </div>
      <div>
        <label>
          Category
          <input
            type="text"
            name="category"
            className="form-control"
            value={product.category}
            onChange={handleChange}
          />
        </label>
        {errors.category && <small className="text-danger">{errors.category}</small>}
      </div>
      <div>
        <label>
          Price
          <input
            type="number"
            name="price"
            className="form-control"
            value={product.price}
            onChange={handleChange}
          />
        </label>
        {errors.price && <small className="text-danger">{errors.price}</small>}
      </div>
      <div>
        <label>
          In Stock
          <input
            type="checkbox"
            name="instock"
            checked={product.instock}
            onChange={handleChange}
          />
        </label>
      </div>
      <button type="submit" className="btn btn-info">
        Save
      </button>
    </form>
  );
};

export default ProductForm;
