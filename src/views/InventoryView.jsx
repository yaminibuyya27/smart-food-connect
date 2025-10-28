import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X } from 'lucide-react';

const InventoryView = ({ 
    mode = 'add', // 'add' or 'edit'
    itemToEdit = null, 
    onClose = null,
    onSuccess = null 
}) => {
    const [product, setProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [variant, setVariant] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [price, setPrice] = useState('');
    const [available, setAvailable] = useState(true);
    const [expiryDate, setExpiryDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [type, setType] = useState('shopper');
    const [originalData, setOriginalData] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        if (mode === 'edit' && itemToEdit) {
            setProduct(itemToEdit.name || itemToEdit.product || '');
            setQuantity(String(itemToEdit.quantity || ''));
            setVariant(itemToEdit.category || itemToEdit.variant || '');
            setAdditionalDetails(itemToEdit.description || itemToEdit.additionalDetails || '');
            setPrice(String(itemToEdit.price || ''));
            setAvailable(itemToEdit.available ?? true);
            setExpiryDate(itemToEdit.expiry?.split('T')[0] || itemToEdit.expiryDate?.split('T')[0] || '');
            setType(itemToEdit.type || 'shopper');
            setPreviewUrl(`${API_URL}/api/inventory/image/${itemToEdit.id || itemToEdit._id}`);
            
            setOriginalData({
                product: itemToEdit.name || itemToEdit.product || '',
                quantity: String(itemToEdit.quantity || ''),
                variant: itemToEdit.category || itemToEdit.variant || '',
                additionalDetails: itemToEdit.description || itemToEdit.additionalDetails || '',
                price: String(itemToEdit.price || ''),
                available: itemToEdit.available ?? true,
                expiryDate: itemToEdit.expiry?.split('T')[0] || itemToEdit.expiryDate?.split('T')[0] || '',
                type: itemToEdit.type || 'shopper'
            });
        }
    }, [mode, itemToEdit, API_URL]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const hasChanges = () => {
        if (mode === 'add') return true;
        if (!originalData) return false;
        
        return (
            product !== originalData.product ||
            quantity !== originalData.quantity ||
            variant !== originalData.variant ||
            additionalDetails !== originalData.additionalDetails ||
            price !== originalData.price ||
            available !== originalData.available ||
            expiryDate !== originalData.expiryDate ||
            type !== originalData.type ||
            image !== null
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (mode === 'edit' && !hasChanges()) {
            alert('No changes were made');
            return;
        }
        
        setLoading(true);

        const formData = new FormData();
        const payload = {
            product,
            quantity: Number(quantity),
            variant,
            additionalDetails,
            price: Number(price),
            available: Boolean(available),
            expiryDate,
            type
        };

        try {
            Object.keys(payload).forEach(key => {
                formData.append(key, String(payload[key]));
            });

            if (image) {
                formData.append('image', image);
            }

            if (mode === 'edit') {
                await api.updateInventoryItem(itemToEdit.id || itemToEdit._id, formData);
                alert('Inventory item updated successfully');
                if (onSuccess) onSuccess();
                if (onClose) onClose();
            } else {
                await api.createInventory(formData);
                alert('Inventory item added successfully');
                
                resetForm();
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            console.error(`Error ${mode === 'edit' ? 'updating' : 'adding'} inventory item:`, error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setProduct('');
        setQuantity('');
        setVariant('');
        setAdditionalDetails('');
        setPrice('');
        setAvailable(true);
        setExpiryDate('');
        setImage(null);
        setPreviewUrl('');
        setType('shopper');
    };

    const handleCancel = () => {
        if (onClose) {
            onClose();
        }
    };

    const formContent = (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Product</label>
                <input 
                    className="w-full p-2 border rounded-md bg-white"
                    value={product} 
                    onChange={(e) => setProduct(e.target.value)} 
                    placeholder="e.g., Tomatoes" 
                    required 
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input 
                    type="number" 
                    className="w-full p-2 border rounded-md bg-white"
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)} 
                    placeholder="e.g., 5" 
                    required 
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Variant</label>
                <input 
                    className="w-full p-2 border rounded-md bg-white"
                    value={variant} 
                    onChange={(e) => setVariant(e.target.value)} 
                    placeholder="e.g., Roma, Cherry" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Additional Details</label>
                <input 
                    className="w-full p-2 border rounded-md bg-white"
                    value={additionalDetails} 
                    onChange={(e) => setAdditionalDetails(e.target.value)} 
                    placeholder="e.g., Organic, Locally Grown" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input 
                    type="number" 
                    step="0.01"
                    className="w-full p-2 border rounded-md bg-white"
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    placeholder="e.g., 10.99" 
                    required 
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Inventory Type</label>
                <select
                    className="w-full p-2 border rounded-md bg-white"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                >
                    <option value="shopper">Shopper</option>
                    <option value="charity">Charity</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                    className="w-full p-2 border rounded-md bg-white"
                    value={available ? "true" : "false"}
                    onChange={(e) => setAvailable(e.target.value === "true")}
                >
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <input 
                    type="date" 
                    className="w-full p-2 border rounded-md bg-white"
                    value={expiryDate} 
                    onChange={(e) => setExpiryDate(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Product Image</label>
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded-md cursor-pointer bg-white"
                />
                {previewUrl && (
                    <div className="mt-2">
                        <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="max-w-xs rounded-lg shadow-sm"
                            onError={(e) => {
                                e.target.src = '/placeholder-food.png';
                                e.target.onerror = null;
                            }}
                        />
                    </div>
                )}
            </div>
            
            <div className="flex gap-3">
                {mode === 'edit' && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                )}
                <button 
                    type="submit" 
                    disabled={loading || (mode === 'edit' && !hasChanges())}
                    className={`${mode === 'edit' ? 'flex-1' : 'w-full'} py-2 px-4 rounded-md transition-colors ${
                        loading || (mode === 'edit' && !hasChanges())
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {loading 
                        ? (mode === 'edit' ? 'Updating...' : 'Adding...') 
                        : (mode === 'edit' ? 'Update Item' : 'Add to Inventory')
                    }
                </button>
            </div>
        </form>
    );

    if (mode === 'edit') {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Edit Inventory Item</h2>
                            <button
                                onClick={handleCancel}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        {formContent}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Add New Inventory Item</h2>
            {formContent}
        </div>
    );
};

export default InventoryView;