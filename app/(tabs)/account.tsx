import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { User } from '@/api/auth';
import { meApi } from '@/api/me';
import { walletApi, type Wallet } from '@/api/wallet';
import { SettingsRow, SettingsSectionHeader, SettingsToggleRow } from '@/components/SettingsRow';
import { AddressesIcon } from '@/components/icons/AddressesIcon';
import { AlertTriangleIcon } from '@/components/icons/AlertTriangleIcon';
import { BellIcon } from '@/components/icons/BellIcon';
import { FeedbackIcon } from '@/components/icons/FeedbackIcon';
import { LockIcon } from '@/components/icons/LockIcon';
import { LockOpenIcon } from '@/components/icons/LockOpenIcon';
import { LogoutIcon } from '@/components/icons/LogoutIcon';
import { ProfileIcon } from '@/components/icons/ProfileIcon';
import { UserAvatarIcon } from '@/components/icons/UserAvatarIcon';
import { WalletBalanceCard } from '@/components/WalletBalanceCard';
import { useAuthStore } from '@/store/auth';
import { colors, fontFamilies } from '@/theme';

const ICON_COLOR = '#A3A3A3';
const ROW_DIVIDER = '#F5F5F5';

function flashCopied(): void {
  if (Platform.OS === 'android') {
    ToastAndroid.show('Account number copied', ToastAndroid.SHORT);
  } else {
    Alert.alert('Copied', 'Account number copied to clipboard.');
  }
}

export default function AccountScreen(): React.JSX.Element {
  const qc = useQueryClient();
  const signOut = useAuthStore((s) => s.signOut);

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: () => meApi.getMe(),
    staleTime: 60_000,
  });

  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletApi.getMine(),
    staleTime: 30_000,
  });

  // Optimistic toggle — flip the cached `me` row immediately, roll back if the
  // PATCH fails. Invalidating afterwards would flash the old value back.
  const notifMutation = useMutation({
    mutationFn: (enabled: boolean) => meApi.updateNotifications({ enabled }),
    onMutate: async (enabled) => {
      await qc.cancelQueries({ queryKey: ['me'] });
      const prev = qc.getQueryData<User>(['me']);
      if (prev) {
        qc.setQueryData<User>(['me'], { ...prev, notificationsEnabled: enabled });
      }
      return { prev };
    },
    onError: (_err, _enabled, ctx) => {
      if (ctx?.prev) qc.setQueryData(['me'], ctx.prev);
      Alert.alert('Could not update', 'Please try again.');
    },
    onSuccess: (user) => {
      qc.setQueryData(['me'], user);
    },
  });

  const fullName = me ? `${me.firstName ?? ''} ${me.lastName ?? ''}`.trim() || 'Your name' : 'Your name';
  const email = me?.email ?? me?.phone ?? '—';
  const notificationsEnabled = me?.notificationsEnabled ?? true;

  const onWalletPress = (): void => {
    router.push('/wallet');
  };

  const onCopyAccount = (wallet: Wallet | undefined): void => {
    if (!wallet) return;
    void Clipboard.setStringAsync(wallet.virtualAccountNumber).then(flashCopied);
  };

  const onLogout = (): void => {
    Alert.alert('Log out', 'You will need to sign in again.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          void signOut().then(() => router.replace('/(auth)/onboarding'));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <UserAvatarIcon size={56} color={colors.border.strong} />
          </View>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {wallet ? (
          <WalletBalanceCard
            balance={Number(wallet.balance)}
            bankName={wallet.virtualAccountProvider}
            accountNumber={wallet.virtualAccountNumber}
            onPressCard={onWalletPress}
            onCopyAccount={() => onCopyAccount(wallet)}
            style={styles.wallet}
          />
        ) : (
          <View style={[styles.wallet, styles.walletSkeleton]}>
            <ActivityIndicator color={colors.brand.primary} />
          </View>
        )}

        <View style={styles.section}>
          <SettingsSectionHeader title="Account" />
          <SettingsRow
            icon={<ProfileIcon color={ICON_COLOR} />}
            label="Profile"
            onPress={() => router.push('/(auth)/profile')}
          />
          <Divider />
          <SettingsRow
            icon={<AddressesIcon color={ICON_COLOR} />}
            label="My Addresses"
            onPress={() => {
              /* TODO: addresses screen */
            }}
          />
          <Divider />
          <SettingsToggleRow
            icon={<BellIcon color={ICON_COLOR} />}
            label="Notifications"
            value={notificationsEnabled}
            onValueChange={(v) => notifMutation.mutate(v)}
          />
        </View>

        <View style={styles.section}>
          <SettingsSectionHeader title="Security" />
          <SettingsRow
            icon={<LockIcon color={ICON_COLOR} />}
            label="Change Password"
            onPress={() => {
              /* TODO */
            }}
          />
          <Divider />
          <SettingsRow
            icon={<LockOpenIcon color={ICON_COLOR} />}
            label="Forgot Password"
            onPress={() => {
              /* TODO */
            }}
          />
        </View>

        <View style={styles.section}>
          <SettingsSectionHeader title="Help & Feedback" />
          <SettingsRow
            icon={<AlertTriangleIcon color={ICON_COLOR} />}
            label="Report a Problem"
            onPress={() => {
              /* TODO */
            }}
          />
          <Divider />
          <SettingsRow
            icon={<FeedbackIcon color={ICON_COLOR} />}
            label="Feedback"
            onPress={() => {
              /* TODO */
            }}
          />
        </View>

        <Pressable
          onPress={onLogout}
          accessibilityRole="button"
          style={({ pressed }) => [styles.logout, pressed && styles.logoutPressed]}
        >
          <LogoutIcon size={20} color="#FF3B30" />
          <Text style={styles.logoutLabel}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Divider(): React.JSX.Element {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.base },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  identity: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 28,
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: colors.surface.muted,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 12,
  },
  name: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.text.primary,
  },
  email: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.hint,
    marginTop: 4,
  },

  wallet: { marginBottom: 16 },
  walletSkeleton: {
    height: 195,
    borderRadius: 20,
    backgroundColor: colors.surface.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  section: { marginTop: 16 },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: ROW_DIVIDER,
  },

  logout: {
    marginTop: 24,
    height: 55,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutPressed: { opacity: 0.75, backgroundColor: 'rgba(255,59,48,0.05)' },
  logoutLabel: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 16,
    lineHeight: 22,
    color: '#FF3B30',
  },
});
