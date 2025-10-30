import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, Upload, Package, DollarSign, Calendar, Tag, FileText, Image as ImageIcon } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

const InventoryView = ({
    mode = 'add', // 'add' or 'edit'
    itemToEdit = null,
    onClose = null,
    onSuccess = null
}) => {
    const { refetchInventory } = useInventory();
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
                await refetchInventory();
                alert('Inventory item updated successfully');
                if (onSuccess) onSuccess();
                if (onClose) onClose();
            } else {
                await api.createInventory(formData);
                await refetchInventory();
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
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    Product Name
                </label>
                <input 
                    className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors"
                    value={product} 
                    onChange={(e) => setProduct(e.target.value)} 
                    placeholder="e.g., Fresh Tomatoes" 
                    required 
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Package className="h-4 w-4 text-green-500" />
                        Quantity
                    </label>
                    <input 
                        type="number" 
                        className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors"
                        value={quantity} 
                        onChange={(e) => setQuantity(e.target.value)} 
                        placeholder="e.g., 10" 
                        required 
                    />
                </div>
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        Price
                    </label>
                    <input 
                        type="number" 
                        step="0.01"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors"
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        placeholder="e.g., 10.99" 
                        required 
                    />
                </div>
            </div>
            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Tag className="h-4 w-4 text-purple-500" />
                    Variant
                </label>
                <input 
                    className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors"
                    value={variant} 
                    onChange={(e) => setVariant(e.target.value)} 
                    placeholder="e.g., Organic, Roma, Cherry" 
                />
            </div>
            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="h-4 w-4 text-orange-500" />
                    Additional Details
                </label>
                <textarea 
                    className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    value={additionalDetails} 
                    onChange={(e) => setAdditionalDetails(e.target.value)} 
                    placeholder="e.g., Organic, Locally Grown, Non-GMO" 
                    rows="3"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Tag className="h-4 w-4 text-indigo-500" />
                        Available For
                    </label>
                    <select
                        className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors cursor-pointer"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <option value="shopper">Shoppers</option>
                        <option value="charity">Charities</option>
                    </select>
                </div>
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Package className="h-4 w-4 text-teal-500" />
                        Availability Status
                    </label>
                    <select
                        className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors cursor-pointer"
                        value={available ? "true" : "false"}
                        onChange={(e) => setAvailable(e.target.value === "true")}
                    >
                        <option value="true">Available</option>
                        <option value="false">Out of Stock</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 text-red-500" />
                    Expiry Date
                </label>
                <input 
                    type="date" 
                    className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors cursor-pointer"
                    value={expiryDate} 
                    onChange={(e) => setExpiryDate(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <ImageIcon className="h-4 w-4 text-pink-500" />
                    Product Image
                </label>
                <div className="relative">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg cursor-pointer bg-white hover:border-blue-300 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
                {previewUrl && (
                    <div className="mt-4 flex justify-center">
                        <div className="relative group">
                            <img 
                                src={previewUrl} 
                                alt="Preview" 
                                className="max-w-xs rounded-lg shadow-md border-2 border-gray-200 group-hover:shadow-xl transition-shadow"
                                onError={(e) => {
                                    e.target.src = '/placeholder-food.png';
                                    e.target.onerror = null;
                                }}
                            />
                            {image && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                                    New Image
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="flex gap-3 pt-4">
                {mode === 'edit' && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 py-3 px-6 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2"
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </button>
                )}
                <button 
                    type="submit" 
                    disabled={loading || (mode === 'edit' && !hasChanges())}
                    className={`${mode === 'edit' ? 'flex-1' : 'w-full'} py-3 px-6 rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 ${
                        loading || (mode === 'edit' && !hasChanges())
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                >
                    {loading ? (
                        <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            {mode === 'edit' ? 'Updating...' : 'Adding...'}
                        </>
                    ) : (
                        <>
                            <Upload className="h-4 w-4" />
                            {mode === 'edit' ? 'Update Item' : 'Add to Inventory'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );

    if (mode === 'edit') {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                    <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Edit Inventory Item</h2>
                            <button
                                onClick={handleCancel}
                                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        {formContent}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-8 mb-8">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Package className="h-8 w-8" />
                        Add New Inventory Item
                    </h2>
                    <p className="text-blue-100 mt-2">Fill in the details to add a new product to your inventory</p>
                </div>
                <div className="p-6">
                    {formContent}
                </div>
            </div>
        </div>
    );
};

export default InventoryView;