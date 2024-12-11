import React, { useState, useEffect, useCallback } from 'react';
import Filters from './Filters';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';
import axios from 'axios';

const Products = () => {
  const [filterText, setFilterText] = useState('');
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/product/get');
        const fetchedProducts = {};
        response.data.forEach((product) => {
          if (product.product && product.product.name) {
            fetchedProducts[product._id] = { ...product.product, _id: product._id };
          }
        });
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  const handleFilter = useCallback((filterInput) => {
    setFilterText(filterInput.filterText);
  }, []);

  const handleSave = useCallback(
    async (product) => {
      try {
        if (!product._id) {
          const newProduct = {
            product: {
              productid: new Date().getTime(),
              category: product.category,
              price: parseFloat(product.price),
              name: product.name,
              instock: product.instock,
            },
          };

          const response = await axios.post('http://localhost:5000/product/create', newProduct);
          const createdProduct = { ...response.data.product, _id: response.data._id };

          setProducts((prevProducts) => ({
            ...prevProducts,
            [createdProduct._id]: createdProduct,
          }));
        } else {
          const response = await axios.put(
            `http://localhost:5000/product/update/${product._id}`,
            { product }
          );
          const updatedProduct = { ...response.data.product, _id: response.data._id };

          setProducts((prevProducts) => ({
            ...prevProducts,
            [updatedProduct._id]: updatedProduct,
          }));
        }
      } catch (err) {
        console.error('Error saving product:', err);
      }
    },
    []
  );

  const handleDestroy = useCallback(
    async (productId) => {
      try {
        await axios.delete(`http://localhost:5000/product/delete/${productId}`);
        setProducts((prevProducts) => {
          const updatedProducts = { ...prevProducts };
          delete updatedProducts[productId];
          return updatedProducts;
        });
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    },
    []
  );

  return (
    <div>
      <h1>My Inventory</h1>
      <Filters onFilter={handleFilter} />
      <ProductTable
        products={products}
        filterText={filterText}
        onDestroy={handleDestroy}
      />
      <ProductForm onSave={handleSave} />
    </div>
  );
};

export default Products;
