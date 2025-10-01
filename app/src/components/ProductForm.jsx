import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

const ProductForm = ({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    keyProblems: initialData?.keyProblems || '',
    targetKeywords: initialData?.targetKeywords || '',
    price: initialData?.price || '',
    category: initialData?.category || '',
  });

  const [errors, setErrors] = useState({});

  const categories = [
    'SaaS',
    'E-commerce',
    'Mobile App',
    'Web Service',
    'Digital Product',
    'Physical Product',
    'Consulting',
    'Education',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (!formData.keyProblems.trim()) {
      newErrors.keyProblems = 'Key problems are required';
    }

    if (!formData.targetKeywords.trim()) {
      newErrors.targetKeywords = 'Target keywords are required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData.price && (isNaN(formData.price) || parseFloat(formData.price) < 0)) {
      newErrors.price = 'Price must be a valid positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    const submissionData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null,
      targetKeywords: formData.targetKeywords.split(',').map(k => k.trim()).filter(k => k),
    };

    try {
      await onSubmit(submissionData);
      setFormData({
        name: '',
        description: '',
        keyProblems: '',
        targetKeywords: '',
        price: '',
        category: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reddit-orange"
              onClick={onClose}
              disabled={isLoading}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {initialData ? 'Edit Product' : 'Add New Product'}
              </h3>
              
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-reddit-orange focus:border-reddit-orange sm:text-sm`}
                    placeholder="Enter product name"
                    disabled={isLoading}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description * <span className="text-gray-500">({formData.description.length}/500)</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-reddit-orange focus:border-reddit-orange sm:text-sm`}
                    placeholder="Describe your product"
                    maxLength={500}
                    disabled={isLoading}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                <div>
                  <label htmlFor="keyProblems" className="block text-sm font-medium text-gray-700">
                    Key Problems It Solves *
                  </label>
                  <textarea
                    id="keyProblems"
                    name="keyProblems"
                    rows={3}
                    value={formData.keyProblems}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${errors.keyProblems ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-reddit-orange focus:border-reddit-orange sm:text-sm`}
                    placeholder="What problems does your product solve?"
                    disabled={isLoading}
                  />
                  {errors.keyProblems && <p className="mt-1 text-sm text-red-600">{errors.keyProblems}</p>}
                </div>

                <div>
                  <label htmlFor="targetKeywords" className="block text-sm font-medium text-gray-700">
                    Target Keywords * <span className="text-gray-500">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    id="targetKeywords"
                    name="targetKeywords"
                    value={formData.targetKeywords}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${errors.targetKeywords ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-reddit-orange focus:border-reddit-orange sm:text-sm`}
                    placeholder="keyword1, keyword2, keyword3"
                    disabled={isLoading}
                  />
                  {errors.targetKeywords && <p className="mt-1 text-sm text-red-600">{errors.targetKeywords}</p>}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${errors.category ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-reddit-orange focus:border-reddit-orange sm:text-sm`}
                    disabled={isLoading}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (Optional)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={`block w-full pl-7 border ${errors.price ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-reddit-orange focus:border-reddit-orange sm:text-sm`}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-reddit-orange text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reddit-orange sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" text="" />
                    ) : (
                      initialData ? 'Update Product' : 'Add Product'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reddit-orange sm:mt-0 sm:col-start-1 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;