import React from 'react';

const ProductRow = ({ product, onDestroy }) => {
  const { _id, name, category, price, instock } = product;

  const handleDestroy = () => {
    onDestroy(_id);
  };

  return (
    <tr>
      <td>{name}</td>
      <td>{category}</td>
      <td>{price}</td>
      <td>{instock ? 'Yes' : 'No'}</td>
      <td className="text-right">
        <button onClick={handleDestroy} className="btn btn-info">
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;
