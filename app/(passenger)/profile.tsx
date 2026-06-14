import { useI18n } from '@/contexts/I18nContext';
// AERO — Passenger Profile
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Avatar, Card } from '@/components';
import { colors, fontSize, fontWeight, radius, spacing, shadows } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';
import { getSharedSupabaseClient } from '@/template/core/client';

export default function PassengerProfileScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = async () => {
    showAlert(t('profile_logout_title'), t('profile_logout_message'), [
      { text: t('profile_logout_cancel'), style: 'cancel' },
      { text: t('profile_logout_confirm'), onPress: async () => {
        try { await getSharedSupabaseClient().auth.signOut(); } catch {}
        router.replace('/(auth)');
      }},
    ]);
  };

  const handleDeleteAccount = () => {
    showAlert('Ștergere cont', 'Această acțiune este ireversibilă. Continuăm?', [
      { text: t('profile_logout_cancel'), style: 'cancel' },
      { text: 'Șterge', style: 'destructive', onPress: async () => {
        try { await getSharedSupabaseClient().auth.signOut(); } catch {}
        router.replace('/(auth)');
      }},
    ]);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    showAlert('Dark Mode', 'Tema va fi aplicată după repornirea aplicației (Mock).', [{ text: 'Ok' }]);
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Avatar name={user.name} color={user.avatarColor} size={80} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.phone}>{user.phone || t('profile_no_phone')}</Text>
        <View style={styles.ratingBadge}>
          <MaterialIcons name="star" size={16} color="#F59E0B" />
          <Text style={styles.ratingText}>{user.rating.toFixed(1)} Rating Pasager</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile_section_app_settings')}</Text>
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowIcon}><MaterialIcons name="dark-mode" size={24} color={colors.text} /></View>
            <Text style={styles.rowText}>{t('profile_dark_mode')}</Text>
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} trackColor={{ true: colors.primary }} />
          </View>
          <View style={styles.divider} />
          <Pressable style={styles.row} onPress={() => router.push('/(passenger)/rides')}>
            <View style={styles.rowIcon}><MaterialIcons name="receipt-long" size={24} color={colors.text} /></View>
            <Text style={styles.rowText}>{t('profile_history_rides')}</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textFaint} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.row} onPress={() => router.push('/(passenger)/passes')}>
            <View style={styles.rowIcon}><MaterialIcons name="favorite" size={24} color={colors.text} /></View>
            <Text style={styles.rowText}>{t('profile_saved_addresses')}</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textFaint} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.row} onPress={() => router.push('/(auth)/language')}>
            <View style={styles.rowIcon}><MaterialIcons name="language" size={24} color={colors.text} /></View>
            <Text style={styles.rowText}>{t('profile_language')}</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textFaint} />
          </Pressable>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile_section_account')}</Text>
        <Card style={styles.card}>
          <Pressable style={styles.row} onPress={() => showAlert(t('profile_support_title'), t('profile_support_message'))}>
            <View style={styles.rowIcon}><MaterialIcons name="support-agent" size={24} color={colors.text} /></View>
            <Text style={styles.rowText}>{t('profile_support_help')}</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textFaint} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.row} onPress={handleLogout}>
            <View style={styles.rowIcon}><MaterialIcons name="logout" size={24} color={colors.danger} /></View>
            <Text style={[styles.rowText, { color: colors.danger }]}>{t('profile_logout_title')}</Text>
          </Pressable>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile_section_admin')}</Text>
        <Card style={styles.card}>
          <Pressable style={styles.row} onPress={() => router.push('/(admin)/dashboard')}>
            <View style={styles.rowIcon}><MaterialIcons name="admin-panel-settings" size={24} color="#F97316" /></View>
            <Text style={styles.rowText}>{t('profile_admin_panel')}</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textFaint} />
          </Pressable>
        </Card>
      </View>

      <Button 
        label={t('profile_btn_delete_account')} 
        variant="ghost" 
        textStyle={{ color: colors.danger }} 
        style={{ marginTop: spacing.xl }}
        onPress={handleDeleteAccount}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'center', padding: spacing.xl, backgroundColor: colors.surface, borderBottomWidth: 1, borderColor: colors.border },
  name: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: spacing.md },
  phone: { fontSize: fontSize.md, color: colors.textSubtle, marginTop: 4 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surfaceAlt, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, marginTop: spacing.md },
  ratingText: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.text },
  section: { paddingHorizontal: spacing.md, marginTop: spacing.xl },
  sectionTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.textSubtle, marginBottom: spacing.sm, marginLeft: spacing.sm },
  card: { padding: 0, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  rowIcon: { width: 36, alignItems: 'center' },
  rowText: { flex: 1, fontSize: fontSize.md, color: colors.text, fontWeight: fontWeight.medium },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 52 },
});
