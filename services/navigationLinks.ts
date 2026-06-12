// Powered by OnSpace.AI
import { Linking, Platform } from 'react-native';
import { Place } from './types';

// Deep-link to an installed navigation app (Waze / Google Maps) instead of
// building turn-by-turn navigation in-app. Coordinates are mocked from the
// map model, so we pass the address query for a realistic external handoff.
export async function openExternalNavigation(destination: Place): Promise<'waze' | 'maps'> {
  const query = encodeURIComponent(`${destination.name} ${destination.address}`);
  const wazeUrl = `https://waze.com/ul?q=${query}&navigate=yes`;
  const mapsUrl = Platform.select({
    ios: `http://maps.apple.com/?daddr=${query}`,
    default: `https://www.google.com/maps/dir/?api=1&destination=${query}`,
  }) as string;

  try {
    const canWaze = await Linking.canOpenURL('waze://');
    if (canWaze) {
      await Linking.openURL(`waze://?q=${query}&navigate=yes`);
      return 'waze';
    }
  } catch {
    // ignore and fall back
  }

  try {
    await Linking.openURL(mapsUrl);
  } catch {
    await Linking.openURL(wazeUrl);
  }
  return 'maps';
}
