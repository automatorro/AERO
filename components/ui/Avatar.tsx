// Powered by OnSpace.AI
import { StyleSheet, Text, View } from 'react-native';
import { fontWeight } from '@/constants/theme';

interface AvatarProps {
  name: string;
  color: string;
  size?: number;
}

function initials(name: string): string {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function Avatar({ name, color, size = 44 }: AvatarProps) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.38 }]}>{initials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  text: { color: '#FFFFFF', fontWeight: fontWeight.bold, includeFontPadding: false },
});
