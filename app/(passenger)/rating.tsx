import { useI18n } from '@/contexts/I18nContext';
// AERO — Rating Cursă (Pasager)
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { useRide } from '@/hooks/useRide';

export default function RatingScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activeRide, completeRide } = useRide();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!activeRide || !activeRide.offer) {
    return null;
  }

  const handleSubmit = () => {
    // Aici s-ar apela un backend endpoint saveRating({ rideId, rating, comment })
    completeRide();
    router.replace('/(passenger)/ride');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl }]}>
      <Text style={styles.title}>{t('rating_headline')}</Text>
      <Text style={styles.sub}>{t('rating_subtext', { driverName: activeRide.offer.driverName })}</Text>

      <View style={styles.avatarWrap}>
        <View style={[styles.avatar, { backgroundColor: activeRide.offer.avatarColor }]}>
          <Text style={styles.avatarText}>{activeRide.offer.driverName.charAt(0)}</Text>
        </View>
      </View>

      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setRating(star)}>
            <MaterialIcons
              name={star <= rating ? 'star' : 'star-border'}
              size={48}
              color={star <= rating ? '#F59E0B' : colors.textFaint}
            />
          </Pressable>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder={t('rating_comment_placeholder')}
        placeholderTextColor={colors.textFaint}
        multiline
        value={comment}
        onChangeText={setComment}
      />

      <View style={{ flex: 1 }} />

      <Button label={t('rating_submit_btn')} fullWidth size="lg" onPress={handleSubmit} />
      <Pressable style={styles.skipBtn} onPress={handleSubmit}>
        <Text style={styles.skipText}>{t('rating_skip_btn')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: spacing.xs, textAlign: 'center' },
  sub: { fontSize: fontSize.md, color: colors.textSubtle, textAlign: 'center', marginBottom: spacing.xl },
  avatarWrap: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  stars: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  input: {
    alignSelf: 'stretch', backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, fontSize: fontSize.md, color: colors.text,
    minHeight: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: colors.border,
  },
  skipBtn: { marginTop: spacing.md, paddingVertical: spacing.sm },
  skipText: { color: colors.textSubtle, fontSize: fontSize.md, fontWeight: fontWeight.bold },
});
