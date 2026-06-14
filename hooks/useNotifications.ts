// AERO — Hook pentru Push Notifications
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { registerForPushNotifications, savePushToken } from '@/services/notifications';
import { useAuth } from '@/hooks/useAuth';

export function useNotifications() {
  const router = useRouter();
  const { user } = useAuth();
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    // Înregistrare token
    registerForPushNotifications().then(token => {
      if (token && user?.id) {
        savePushToken(user.id, token);
      }
    });

    // Listener: notificare primită (foreground)
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificare primită:', notification.request.content.title);
    });

    // Listener: utilizatorul apasă pe notificare
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      const type = data?.type as string;

      // Navigare în funcție de tip
      switch (type) {
        case 'ride_new_request':
          router.push('/(driver)/drive');
          break;
        case 'ride_accepted':
        case 'ride_driver_arrived':
          router.push('/(passenger)/active');
          break;
        case 'ride_counter_offer':
          router.push('/(passenger)/searching');
          break;
        case 'ride_completed':
          router.push('/(passenger)/rating');
          break;
        case 'driver_approved':
          router.push('/(driver)/drive');
          break;
        case 'sos_alert':
          router.push('/(admin)/alerts');
          break;
        case 'chat_message':
          if (data?.rideId) {
            router.push({ pathname: '/chat/[rideId]', params: { rideId: data.rideId } });
          }
          break;
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [user?.id]);
}
