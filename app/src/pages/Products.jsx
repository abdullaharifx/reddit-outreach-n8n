import React, { useState, useEffect } from 'react';
import { Package, Plus, Search } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductForm from '../components/ProductForm';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { debounce } from '../utils/helpers';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search term
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error('Fetch products error:', error);
      // For development, set some mock data
      setProducts([
        {
          id: 1,
          name: 'TaskMaster Pro',
          domain: 'taskmaster.com',
          description: 'A comprehensive project management tool designed for small to medium businesses.',
          detail: 'TaskMaster Pro offers advanced features including task tracking, team collaboration, deadline management, progress visualization, custom workflows, and integrations with popular tools. Perfect for remote teams and startups looking to streamline their project management processes.',
          price: 29.99,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: 'CodeReview AI',
          domain: 'codereview-ai.io',
          description: 'AI-powered code review assistant that helps developers catch bugs and improve code quality.',
          detail: 'Leveraging cutting-edge AI technology, CodeReview AI automatically analyzes pull requests, identifies potential bugs, security vulnerabilities, and code smells. It learns from your team\'s coding standards and provides actionable feedback to improve code quality and reduce review time by 60%.',
          price: 49.99,
          createdAt: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (productData) => {
    try {
      setFormLoading(true);
      
      if (editingProduct) {
        // Update existing product
        await productsAPI.update(editingProduct.id, productData);
        setProducts(prev => 
          prev.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p)
        );
        toast.success('Product updated successfully');
      } else {
        // Create new product
        const response = await productsAPI.create(productData);
        const newProduct = response.data || { 
          id: Date.now(), 
          ...productData, 
          createdAt: new Date().toISOString() 
        };
        setProducts(prev => [newProduct, ...prev]);
        toast.success('Product added successfully');
      }
      
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      toast.error(editingProduct ? 'Failed to update product' : 'Failed to add product');
      console.error('Form submit error:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await productsAPI.delete(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Delete product error:', error);
    }
  };

  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" text="Loading products..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your products and their marketing information.
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-reddit-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reddit-orange transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Search Bar */}
      {products.length > 0 && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            onChange={(e) => handleSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-reddit-orange focus:border-reddit-orange sm:text-sm"
          />
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No products yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first product.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAddProduct}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-reddit-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reddit-orange"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No products found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search terms.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
        isLoading={formLoading}
      />
    </div>
  );
};

export default Products;