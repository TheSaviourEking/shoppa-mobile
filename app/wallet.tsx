import { useQuery } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { Fragment, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { parseAmount, transactionDirection, walletApi, type Transaction, type Wallet } from '@/api/wallet';
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon';
import { WalletBalanceCard } from '@/components/WalletBalanceCard';
import { colors, fontFamilies } from '@/theme';

const INCOME_GREEN = '#00CC2C';

interface MonthGroup {
  key: string;
  title: string;
  transactions: Transaction[];
}

const MONTH_LABELS = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

function groupByMonth(txs: readonly Transaction[]): MonthGroup[] {
  const buckets = new Map<string, MonthGroup>();
  for (const tx of txs) {
    const d = new Date(tx.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    let g = buckets.get(key);
    if (!g) {
      g = {
        key,
        title: `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`,
        transactions: [],
      };
      buckets.set(key, g);
    }
    g.transactions.push(tx);
  }
  // Transactions come back newest-first from the server, so bucket order will
  // already be descending — but iteration order of Map matches insertion, so
  // this is safe as long as we don't re-sort.
  return Array.from(buckets.values());
}

function formatSignedAmount(tx: Transaction): string {
  const n = parseAmount(tx.amount).toLocaleString('en-NG');
  return transactionDirection(tx) === 'out' ? `-₦${n}` : `₦${n}`;
}

// "2nd Feb, 2025  14:24"
function formatTransactionDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const suffix = ordinalSuffix(day);
  const month = d.toLocaleString('en-NG', { month: 'short' });
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day}${suffix} ${month}, ${year}  ${hh}:${mm}`;
}

function ordinalSuffix(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return 'th';
  switch (n % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

function titleFromTransaction(tx: Transaction): string {
  if (tx.type === 'TOPUP') return 'Wallet Top up';
  // DEBIT / CREDIT / REFUND — the server puts the post category or a human
  // label into `description`, so prefer it when present.
  return tx.description || tx.type.toLowerCase();
}

function flashCopied(): void {
  if (Platform.OS === 'android') {
    ToastAndroid.show('Account number copied', ToastAndroid.SHORT);
  } else {
    Alert.alert('Copied', 'Account number copied to clipboard.');
  }
}

export default function WalletScreen(): React.JSX.Element {
  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletApi.getMine(),
    staleTime: 30_000,
  });

  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: () => walletApi.listTransactions({ limit: 50 }),
  });

  const groups = useMemo(() => (transactions ? groupByMonth(transactions) : []), [transactions]);

  const onCopyAccount = (w: Wallet | undefined): void => {
    if (!w) return;
    void Clipboard.setStringAsync(w.virtualAccountNumber).then(flashCopied);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
        >
          <ChevronLeftIcon size={20} color={colors.text.secondaryStrong} />
        </Pressable>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {wallet ? (
          <WalletBalanceCard
            balance={Number(wallet.balance)}
            bankName={wallet.virtualAccountProvider}
            accountNumber={wallet.virtualAccountNumber}
            onCopyAccount={() => onCopyAccount(wallet)}
          />
        ) : (
          <View style={styles.walletSkeleton}>
            <ActivityIndicator color={colors.brand.primary} />
          </View>
        )}

        <Text style={styles.transactionsTitle}>Transactions</Text>

        {txLoading ? (
          <View style={styles.txLoadingBlock}>
            <ActivityIndicator color={colors.text.hint} />
          </View>
        ) : groups.length === 0 ? (
          <Text style={styles.empty}>
            No transactions yet. Top up your wallet or pay for a post to see activity here.
          </Text>
        ) : (
          groups.map((group) => (
            <View key={group.key} style={styles.monthBlock}>
              <Text style={styles.monthHeader}>{group.title}</Text>
              {group.transactions.map((tx, idx) => (
                <Fragment key={tx.id}>
                  <View style={styles.txRow}>
                    <View style={styles.txTextCol}>
                      <Text style={styles.txTitle}>{titleFromTransaction(tx)}</Text>
                      <Text style={styles.txDate}>{formatTransactionDate(tx.createdAt)}</Text>
                    </View>
                    <Text
                      style={[styles.txAmount, transactionDirection(tx) === 'in' && styles.txAmountIncome]}
                    >
                      {formatSignedAmount(tx)}
                    </Text>
                  </View>
                  {idx < group.transactions.length - 1 ? <View style={styles.txDivider} /> : null}
                </Fragment>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.base },

  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPressed: { opacity: 0.7 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 16,
    color: colors.text.primary,
  },
  headerSpacer: { width: 32, height: 32 },

  content: { paddingHorizontal: 20, paddingBottom: 32 },

  walletSkeleton: {
    height: 195,
    borderRadius: 20,
    backgroundColor: colors.surface.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  transactionsTitle: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.text.primary,
    marginTop: 20,
  },

  txLoadingBlock: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  empty: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.text.hint,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },

  monthBlock: { marginTop: 16 },
  monthHeader: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 12,
    letterSpacing: 0.8,
    color: colors.text.hint,
    marginBottom: 14,
    textTransform: 'uppercase',
  },

  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  txTextCol: { flex: 1, paddingRight: 12 },
  txTitle: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text.primary,
  },
  txDate: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    lineHeight: 20,
    color: colors.text.hint,
    marginTop: 4,
  },
  txAmount: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
  },
  txAmountIncome: { color: INCOME_GREEN },

  txDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.surface.muted,
    marginVertical: 8,
  },
});
