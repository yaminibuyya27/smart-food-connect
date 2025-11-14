import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Badge } from './UIComponents';
import { ShoppingBag, Bell, Calendar, Package, Minus, Plus, MapPin } from 'lucide-react';
import MapModal from './MapModal';

const InventoryCard = ({
  item,
  apiUrl,
  currentUser,
  notifications = [],
  cartItems = [],
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onNotify,
  onAddNotification,
  onLoginRequired,
  view,
  setActiveView,
  renderAction = null // Optional: custom action button renderer
}) => {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const getItemCartQuantity = () => {
    const cartItem = cartItems.find(ci => ci.id === item.id);
    return cartItem ? (cartItem.cartQuantity || 1) : 0;
  };

  const itemCartQuantity = getItemCartQuantity();

  const isExpiringSoon = (expiryDate) => {
    const daysUntilExpiry = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 3 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const formatExpiryDate = (expiryDate) => {
    const date = new Date(expiryDate);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    if (diffDays < 0) {
      return `${formattedDate} (expired)`;
    } else if (diffDays === 0) {
      return `${formattedDate} (today)`;
    } else if (diffDays === 1) {
      return `${formattedDate} (tomorrow)`;
    } else if (diffDays <= 7) {
      return `${formattedDate} (in ${diffDays} days)`;
    } else if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${formattedDate} (in ${weeks} ${weeks === 1 ? 'week' : 'weeks'})`;
    } else {
      return formattedDate;
    }
  };

  const handleAddToCart = (item) => {
    if (currentUser === null) {
      alert("Please login before adding items to the cart");
      if (onLoginRequired) {
        onLoginRequired();
      }
    } else {
      onAddToCart(item);
    }
  };

  const handleNotifyClick = async () => {
    if (currentUser === null) {
      alert("Please login before sending for notify");
      if (onLoginRequired) {
        onLoginRequired();
      }
    } else {
      const success = await onNotify(currentUser, item, setActiveView);
      if (success && onAddNotification) {
        onAddNotification(item.id);
        alert(`✓ Notification set! We'll notify you when "${item.name}" is back in stock.`);
      }
    }
  };

  const expiryStatus = isExpired(item.expiry)
    ? 'expired'
    : isExpiringSoon(item.expiry)
    ? 'expiring-soon'
    : 'fresh';

  return (
    <>
    <Card className="flex flex-col overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-2xl hover:border-gray-300 hover:bg-white transition-all duration-300 group">
      <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={`${apiUrl}/api/inventory/image/${item.id}`}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-food.png';
            e.currentTarget.onerror = null;
          }}
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {!item.available && (
            <Badge variant="destructive" className="shadow-md">
              Out of Stock
            </Badge>
          )}
          {expiryStatus === 'expiring-soon' && (
            <Badge variant="warning" className="shadow-md">
              Expiring Soon
            </Badge>
          )}
          {expiryStatus === 'expired' && (
            <Badge variant="destructive" className="shadow-md">
              Expired
            </Badge>
          )}
        </div>

      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>
            {item.name}
          </CardTitle>
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-green-600">
              ${item.price}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
          {item.description}
        </p>

        <div className="space-y-2 pt-2 flex-1">
          {item.type && view === 'retailer' && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="default" className="text-xs">
                Available for: {item.type}
              </Badge>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">
              Best before: <span className="font-medium">{formatExpiryDate(item.expiry)}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">
              Quantity: <span className="font-medium">{item.quantity}</span>
            </span>
          </div>

          {item.location?.latitude && item.location?.longitude && (
            <div className="mt-3">
              <button
                onClick={() => setIsMapModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors font-medium"
              >
                <MapPin className="h-4 w-4" />
                View Store Location
              </button>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        {renderAction ? (
          renderAction(item)
        ) : item.available ? (
          itemCartQuantity > 0 ? (
            <div className="w-full flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md h-11">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (itemCartQuantity === 1) {
                    if (onRemoveFromCart) {
                      onRemoveFromCart(item.id);
                    }
                  } else {
                    if (onUpdateQuantity) {
                      onUpdateQuantity(item.id, -1);
                    }
                  }
                }}
                className="flex items-center justify-center w-12 h-full hover:bg-white/20 rounded-l-lg transition-colors"
              >
                <Minus className="h-5 w-5" />
              </button>
              
              <span className="flex-1 text-center font-semibold text-base">
                {itemCartQuantity}
              </span>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item);
                }}
                className="flex items-center justify-center w-12 h-full hover:bg-white/20 rounded-r-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Button
              onClick={() => handleAddToCart(item)}
              variant="outline"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </Button>
          )
        ) : (
          <Button
            variant="outline"
            onClick={handleNotifyClick}
            disabled={notifications.includes(item.id)}
            className={`w-full inline-flex items-center justify-center gap-2 font-semibold shadow-md transition-all duration-200 ${
              notifications.includes(item.id)
                ? 'bg-gray-400 text-white cursor-not-allowed opacity-75'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            <Bell className="h-4 w-4" />
            {notifications.includes(item.id) ? "You'll be notified" : "Notify When Available"}
          </Button>
        )}
      </CardFooter>
    </Card>

    {item.location?.latitude && item.location?.longitude && (
      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        latitude={item.location.latitude}
        longitude={item.location.longitude}
        itemName={item.name}
      />
    )}
    </>
  );
};

export default InventoryCard;