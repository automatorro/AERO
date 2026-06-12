// Powered by OnSpace.AI
import { Modal, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

interface ProminentDisclosureModalProps {
  visible: boolean;
  onAgree: () => void;
  onDismiss: () => void;
}

// Prominent Disclosure required by App Store / Google Play before requesting
// the system "Always Allow" background location permission.
export function ProminentDisclosureModal({ visible, onAgree, onDismiss }: ProminentDisclosureModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.iconWrap}>
            <MaterialIcons name="my-location" size={32} color={colors.primaryDark} />
          </View>
          <Text style={styles.title}>Permisiune de locație în fundal</Text>
          <Text style={styles.body}>
            AERO colectează date de locație în fundal pentru a te conecta cu pasagerii chiar și
            când aplicația este închisă sau folosești navigația.
          </Text>
          <Text style={styles.note}>
            Locația este folosită doar cât ești Online. O poți opri oricând din setări.
          </Text>
          <View style={styles.actions}>
            <Button label="Sunt de acord" fullWidth onPress={onAgree} icon="check-circle" />
            <Button label="Nu acum" variant="ghost" fullWidth onPress={onDismiss} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text, textAlign: 'center' },
  body: { fontSize: fontSize.md, color: colors.text, textAlign: 'center', lineHeight: fontSize.md * 1.55 },
  note: { fontSize: fontSize.sm, color: colors.textSubtle, textAlign: 'center', marginTop: 4 },
  actions: { alignSelf: 'stretch', gap: spacing.sm, marginTop: spacing.md },
});
