import { api } from "../services/api";

export const handleNotification = async (currentUser, item) => {
    if(currentUser == null) {
        alert("Please login before sending the notification");
        return;
    }
    
    const payload = {
        userId: currentUser._id,
        subject: "Smart Food Connect Notification",
        message: `You will be notified when "${item.name}" becomes available.`,
        itemId: item.id
      }
      try {
        await api.createNotification(payload);
        // addNotification(item.id);
      } catch (error) {
        console.error("Failed to set notification:", error);
      }
    };