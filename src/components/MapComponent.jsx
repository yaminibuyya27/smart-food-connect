import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useEffect, useState, useCallback } from 'react';
import { Search, MapPin as MapPinIcon, Crosshair } from 'lucide-react';
import { api } from '../services/api';

const DEFAULT_POSITION = { lat: 35.2271, lng: -80.8431 }; // Charlotte, NC

const MapComponent = ({
    latitude,
    longitude,
    zoom = 12,
    height = '300px',
    editable = false,
    onLocationChange = null
}) => {
    // @ts-ignore - Vite env variable
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

    const [markerPosition, setMarkerPosition] = useState(
        latitude && longitude ? { lat: latitude, lng: longitude } : DEFAULT_POSITION
    );
    const [mapCenter, setMapCenter] = useState(markerPosition);
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isAutoDetecting, setIsAutoDetecting] = useState(false);
    const [currentAddress, setCurrentAddress] = useState('');
    const [loadingAddress, setLoadingAddress] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);
    const [hasLocation, setHasLocation] = useState(latitude && longitude ? true : false);

    const extractCoords = (latLng) => {
        const lat = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat;
        const lng = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng;
        return { lat, lng };
    };

    const fetchAddress = useCallback(async (lat, lng) => {
        if (!editable || !lat || !lng) return;

        setLoadingAddress(true);
        try {
            const data = await api.reverseGeocode(lat, lng);

            if (data.results?.[0]) {
                setCurrentAddress(data.results[0].formatted_address);
            } else {
                setCurrentAddress('');
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            setCurrentAddress('');
        } finally {
            setLoadingAddress(false);
        }
    }, [editable]);

    useEffect(() => {
        if (latitude && longitude) {
            const newPosition = { lat: latitude, lng: longitude };
            setMarkerPosition(newPosition);
            setMapCenter(newPosition);
            setHasLocation(true);
            if (editable) {
                fetchAddress(latitude, longitude);
            }
        } else {
            setHasLocation(false);
        }
        setHasInitialized(true);
    }, [latitude, longitude, fetchAddress, editable]);

    useEffect(() => {
        if (!hasInitialized || !editable || latitude !== null || longitude !== null || !navigator.geolocation) {
            return;
        }

        setIsAutoDetecting(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setMarkerPosition(newPosition);
                setMapCenter(newPosition);
                setHasLocation(true);
                fetchAddress(newPosition.lat, newPosition.lng);
                onLocationChange?.(newPosition.lat, newPosition.lng);
                setIsAutoDetecting(false);
            },
            () => {
                setIsAutoDetecting(false);
            }
        );
    }, [hasInitialized, editable, latitude, longitude, fetchAddress, onLocationChange]);

    const handleMapClick = useCallback((event) => {
        if (!editable) return;

        const coords = extractCoords(event.detail.latLng);
        setMarkerPosition(coords);
        setHasLocation(true);
        fetchAddress(coords.lat, coords.lng);
        onLocationChange?.(coords.lat, coords.lng);
    }, [editable, onLocationChange, fetchAddress]);

    const handleMarkerDrag = useCallback((event) => {
        if (!editable) return;

        const coords = extractCoords(event.latLng);
        setMarkerPosition(coords);
        setHasLocation(true);
        fetchAddress(coords.lat, coords.lng);
        onLocationChange?.(coords.lat, coords.lng);
    }, [editable, onLocationChange, fetchAddress]);

    const handleSearch = useCallback(async () => {
        if (!searchValue.trim()) return;

        setIsSearching(true);
        try {
            const data = await api.geocodeAddress(searchValue);

            if (data.results?.[0]) {
                const location = data.results[0].geometry.location;
                const newPosition = { lat: location.lat, lng: location.lng };

                setMarkerPosition(newPosition);
                setMapCenter(newPosition);
                setHasLocation(true);
                setCurrentAddress(data.results[0].formatted_address);
                onLocationChange?.(newPosition.lat, newPosition.lng);
            } else {
                alert('Location not found. Please try a different search term.');
            }
        } catch (error) {
            console.error('Error searching location:', error);
            alert('Error searching for location. Please try again.');
        } finally {
            setIsSearching(false);
        }
    }, [searchValue, onLocationChange]);

    const handleCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsSearching(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setMarkerPosition(newPosition);
                setMapCenter(newPosition);
                setHasLocation(true);
                fetchAddress(newPosition.lat, newPosition.lng);
                onLocationChange?.(newPosition.lat, newPosition.lng);
                setIsSearching(false);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to get your location. Please check browser permissions.');
                setIsSearching(false);
            }
        );
    }, [onLocationChange, fetchAddress]);

    return (
        <div className="w-full">
            {editable && (
                <div className="mb-4 space-y-3">
                    {isAutoDetecting && (
                        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            <span>Detecting your current location...</span>
                        </div>
                    )}

                    {currentAddress && (
                        <div className="flex items-start gap-3 text-sm text-gray-700 bg-green-50 p-4 rounded-lg border border-green-200">
                            <MapPinIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="font-semibold text-green-900 mb-1">Selected Location</p>
                                <p className="text-gray-700">{currentAddress}</p>
                            </div>
                        </div>
                    )}

                    {loadingAddress && !currentAddress && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                            <span>Loading address...</span>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search for address, city, or place..."
                                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors"
                                disabled={isSearching}
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={isSearching || !searchValue.trim()}
                            className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSearching ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Search className="h-4 w-4" />
                                    Search
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleCurrentLocation}
                            disabled={isSearching}
                            className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                            title="Use my current location"
                        >
                            <Crosshair className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                        <MapPinIcon className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                        <p>
                            <strong>Tip:</strong> Search for an address, click on the map, or drag the marker to set your store location.
                        </p>
                    </div>
                </div>
            )}

            <div style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden', border: '2px solid #e5e7eb' }}>
                <APIProvider apiKey={API_KEY}>
                    <Map
                        zoom={zoom}
                        center={mapCenter}
                        mapId="inventory-map"
                        onClick={handleMapClick}
                        gestureHandling={editable ? 'greedy' : 'cooperative'}
                        disableDefaultUI={!editable}
                    >
                        {hasLocation && (
                            <AdvancedMarker
                                position={markerPosition}
                                draggable={editable}
                                onDragEnd={handleMarkerDrag}
                            />
                        )}
                    </Map>
                </APIProvider>
            </div>
        </div>
    );
};

export default MapComponent;
