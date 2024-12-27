import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const Products = ({ products, setProducts }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    category: '',
    price: '',
    stock: '',
    image: null,
  });

  const handleAddProduct = () => {
    setProducts([...products, { ...newProduct, id: Date.now().toString() }]);
    setNewProduct({ id: '', name: '', category: '', price: '', stock: '', image: null });
  };

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setNewProduct(product);
  };

  const handleUpdateProduct = () => {
    setProducts(products.map((product) => (product.id === currentProduct.id ? newProduct : product)));
    setIsEditing(false);
    setCurrentProduct(null);
    setNewProduct({ id: '', name: '', category: '', price: '', stock: '', image: null });
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6">Products</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              isEditing ? handleUpdateProduct() : handleAddProduct();
            }}
          >
            <div className="grid grid-cols-1 gap-4 mb-4">
              <input
                type="text"
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                className="p-2 border rounded"
                required
              />
              <input
                type="file"
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                className="p-2 border rounded"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
              {isEditing ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Product List</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Category</th>
                <th className="py-2">Price</th>
                <th className="py-2">Stock</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-2">{product.name}</td>
                  <td className="py-2">{product.category}</td>
                  <td className="py-2">${product.price.toFixed(2)}</td>
                  <td className="py-2">{product.stock}</td>
                  <td className="py-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;