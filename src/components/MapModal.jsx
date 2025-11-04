import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import MapComponent from './MapComponent';
import { api } from '../services/api';

const MapModal = ({ isOpen, onClose, latitude, longitude, itemName }) => {
    const [address, setAddress] = useState('');
    const [loadingAddress, setLoadingAddress] = useState(false);

    useEffect(() => {
        if (!isOpen || !latitude || !longitude) return;

        const fetchAddress = async () => {
            setLoadingAddress(true);
            try {
                const data = await api.reverseGeocode(latitude, longitude);

                if (data.results?.[0]) {
                    setAddress(data.results[0].formatted_address);
                } else {
                    setAddress('Address not available');
                }
            } catch (error) {
                console.error('Error fetching address:', error);
                setAddress('Could not load address');
            } finally {
                setLoadingAddress(false);
            }
        };

        fetchAddress();
    }, [isOpen, latitude, longitude]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-hidden"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 shadow-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">Store Location</h2>
                            {itemName && (
                                <p className="text-blue-100 mt-1">{itemName}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto p-6 flex-1 overscroll-contain">
                    {loadingAddress ? (
                        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                            <span>Loading address...</span>
                        </div>
                    ) : address && (
                        <div className="mb-4 flex items-start gap-3 text-sm text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-blue-900 mb-1">Address</p>
                                <p className="text-gray-700">{address}</p>
                            </div>
                        </div>
                    )}

                    <MapComponent
                        latitude={latitude}
                        longitude={longitude}
                        zoom={15}
                        height="500px"
                        editable={false}
                    />

                    <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <strong>Coordinates:</strong> {latitude.toFixed(6)}, {longitude.toFixed(6)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapModal;
