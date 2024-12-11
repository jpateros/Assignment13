import React, { memo } from 'react';
import ProductRow from './ProductRow';

const ProductTable = ({ products, filterText, onDestroy }) => {

  const filteredProducts = React.useMemo(() => {
    return Object.values(products).filter(
      (product) => product.name && product.name.indexOf(filterText) !== -1
    );
  }, [products, filterText]);

  return (
    <div>
      <table className="table table-striped table-sm">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>In Stock</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <ProductRow
              key={product._id || product.id}
              product={product}
              onDestroy={onDestroy}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(ProductTable);
