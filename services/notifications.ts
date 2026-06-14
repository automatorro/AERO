// AERO — Push Notifications Service
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { getSharedSupabaseClient } from '@/template/core/client';

// Configurare handler — Notificările apar și când aplicația este în foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type NotificationType =
  | 'ride_new_request'      // Șofer: cerere nouă de cursă
  | 'ride_counter_offer'    // Pasager: contra-ofertă primită
  | 'ride_accepted'         // Pasager: șoferul a acceptat cursa
  | 'ride_driver_arrived'   // Pasager: șoferul a ajuns
  | 'ride_completed'        // Ambii: cursa s-a finalizat
  | 'driver_approved'       // Șofer: contul a fost aprobat
  | 'sos_alert'             // Admin: alertă SOS
  | 'chat_message';         // Ambii: mesaj nou în chat

interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
}

// Obține push token-ul Expo
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('Push notifications nu funcționează pe simulator.');
    return null;
  }

  // Verifică permisiunile
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permisiunea de notificări a fost refuzată.');
    return null;
  }

  // Android: canal de notificări
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('aero-default', {
      name: 'AERO',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F97316',
      sound: 'default',
    });
  }

  try {
    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: 'aero-rideshare', // În producție, folosește Constants.expoConfig?.extra?.eas?.projectId
    })).data;

    console.log('Expo Push Token:', token);
    return token;
  } catch (e) {
    console.warn('Eroare la obținerea push token:', e);
    return null;
  }
}

// Salvează token-ul în Supabase user_profiles
export async function savePushToken(userId: string, token: string) {
  try {
    const client = getSharedSupabaseClient();
    // Folosim un câmp JSON în user_profiles sau o tabelă separată
    // Pentru MVP, salvăm în user_metadata
    await client.auth.updateUser({
      data: { push_token: token }
    });
  } catch (e) {
    console.warn('Eroare la salvarea push token:', e);
  }
}

// Trimite notificare locală (pentru testare și fallback)
export async function sendLocalNotification(payload: NotificationPayload) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: payload.title,
      body: payload.body,
      data: { type: payload.type, ...payload.data },
      sound: 'default',
    },
    trigger: null, // Imediat
  });
}

// Helper-e pentru notificări specifice AERO
export const AeroNotifications = {
  // Șofer primește cerere nouă
  newRideRequest: (pickup: string, price: string) =>
    sendLocalNotification({
      type: 'ride_new_request',
      title: '🚗 Cerere Nouă de Cursă!',
      body: `Preluare: ${pickup} · ${price} RON`,
    }),

  // Pasager primește contra-ofertă
  counterOffer: (driverName: string, price: string) =>
    sendLocalNotification({
      type: 'ride_counter_offer',
      title: '💰 Contra-ofertă primită',
      body: `${driverName} propune ${price} RON`,
    }),

  // Pasager: cursa a fost acceptată
  rideAccepted: (driverName: string, etaMin: number) =>
    sendLocalNotification({
      type: 'ride_accepted',
      title: '✅ Cursa a fost acceptată!',
      body: `${driverName} ajunge în ~${etaMin} minute`,
    }),

  // Pasager: șoferul a ajuns
  driverArrived: (driverName: string, plate: string) =>
    sendLocalNotification({
      type: 'ride_driver_arrived',
      title: '📍 Șoferul a ajuns!',
      body: `${driverName} te așteaptă · ${plate}`,
    }),

  // Ambii: cursa finalizată
  rideCompleted: (price: string) =>
    sendLocalNotification({
      type: 'ride_completed',
      title: '🏁 Cursă finalizată',
      body: `Plata: ${price} RON. Lasă un rating!`,
    }),

  // Șofer: contul a fost aprobat
  driverApproved: () =>
    sendLocalNotification({
      type: 'driver_approved',
      title: '🎉 Contul tău a fost aprobat!',
      body: 'Poți începe să preiei curse pe AERO.',
    }),

  // SOS alert pentru admin
  sosAlert: (userName: string) =>
    sendLocalNotification({
      type: 'sos_alert',
      title: '🚨 ALERTĂ SOS',
      body: `${userName} a declanșat SOS! Verifică imediat.`,
    }),

  // Mesaj nou în chat
  chatMessage: (senderName: string, preview: string) =>
    sendLocalNotification({
      type: 'chat_message',
      title: `💬 ${senderName}`,
      body: preview.length > 50 ? preview.substring(0, 50) + '...' : preview,
    }),
};
