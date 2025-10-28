import React, { useState } from 'react';
import { api } from '../services/api';

const InventoryView = () => {
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

   const handleImageChange = (e) => {
       const file = e.target.files[0];
       if (file) {
           setImage(file);
           setPreviewUrl(URL.createObjectURL(file));
       }
   };

   const handleSubmit = async (e) => {
    e.preventDefault();
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
        // Add form fields to FormData
        Object.keys(payload).forEach(key => {
            formData.append(key, String(payload[key]));
        });

        // Add image only once
        if (image) {
            formData.append('image', image);
        }

        await api.createInventory(formData);
        setLoading(false);
        alert('Inventory item added successfully');
        
        // Reset form
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
    } catch (error) {
        console.error('Error adding inventory item:', error);
        alert(error.message);
    } finally {
        setLoading(false);
    }
};

   return (
       <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
           <h2 className="text-2xl font-bold mb-6">Add New Inventory Item</h2>
           <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                   <label className="block text-sm font-medium mb-1">Product</label>
                   <input 
                       className="w-full p-2 border rounded-md"
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
                       className="w-full p-2 border rounded-md"
                       value={quantity} 
                       onChange={(e) => setQuantity(e.target.value)} 
                       placeholder="e.g., 5" 
                       required 
                   />
               </div>
               <div>
                   <label className="block text-sm font-medium mb-1">Variant</label>
                   <input 
                       className="w-full p-2 border rounded-md"
                       value={variant} 
                       onChange={(e) => setVariant(e.target.value)} 
                       placeholder="e.g., Roma, Cherry" 
                   />
               </div>
               <div>
                   <label className="block text-sm font-medium mb-1">Additional Details</label>
                   <input 
                       className="w-full p-2 border rounded-md"
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
                       className="w-full p-2 border rounded-md"
                       value={price} 
                       onChange={(e) => setPrice(e.target.value)} 
                       placeholder="e.g., 10.99" 
                       required 
                   />
               </div>
               <div>
                   <label className="block text-sm font-medium mb-1">Inventory Type</label>
                   <select
                       className="w-full p-2 border rounded-md"
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
                       className="w-full p-2 border rounded-md"
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
                       className="w-full p-2 border rounded-md"
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
                       className="w-full p-2 border rounded-md cursor-pointer"
                   />
                   {previewUrl && (
                       <div className="mt-2">
                           <img 
                               src={previewUrl} 
                               alt="Preview" 
                               className="max-w-xs rounded-lg shadow-sm"
                           />
                       </div>
                   )}
               </div>
               <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
               >
                   {loading ? 'Adding...' : 'Add to Inventory'}
               </button>
           </form>
       </div>
   );
};

export default InventoryView;