// Powered by OnSpace.AI
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';

interface ScreenProps {
  children: ReactNode;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
  background?: string;
}

export function Screen({ children, edges = ['top'], background = colors.background }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: background }]}>
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1 },
});
