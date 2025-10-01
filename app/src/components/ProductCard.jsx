import React, { useState } from 'react';
import { Edit, Trash2, Tag, DollarSign, Package } from 'lucide-react';
import { truncateText } from '../utils/helpers';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(product.id);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Package className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">
              {product.name}
            </h3>
          </div>
          
          <p className="text-gray-600 text-sm mb-3">
            {truncateText(product.description, 120)}
          </p>

          <div className="space-y-2 mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Key Problems:</h4>
              <p className="text-sm text-gray-600">
                {truncateText(product.keyProblems, 100)}
              </p>
            </div>

            {product.targetKeywords && product.targetKeywords.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Keywords:</h4>
                <div className="flex flex-wrap gap-1">
                  {product.targetKeywords.slice(0, 3).map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {keyword}
                    </span>
                  ))}
                  {product.targetKeywords.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      +{product.targetKeywords.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {product.category}
              </span>
              {product.price && (
                <span className="inline-flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {product.price}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
            title="Edit product"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 disabled:opacity-50"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Trash2 className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Delete Product
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete "{product.name}"? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reddit-orange sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;