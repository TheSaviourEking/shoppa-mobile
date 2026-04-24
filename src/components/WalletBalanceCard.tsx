import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';
import { CopyIcon } from '@/components/icons/CopyIcon';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';
import { colors, fontFamilies, typography } from '@/theme';

interface Props {
  balance: number;
  bankName: string;
  accountNumber: string;
  onPressCard?: () => void;
  onCopyAccount?: () => void;
  style?: StyleProp<ViewStyle>;
}

const CARD_PURPLE = '#905FF8';
const CARD_BLOB = '#9667F8';
const BANK_BG = '#F5F5F5';

function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function WalletBalanceCard({
  balance,
  bankName,
  accountNumber,
  onPressCard,
  onCopyAccount,
  style,
}: Props): React.JSX.Element {
  const [hidden, setHidden] = useState(false);

  const cardBody = (
    <>
      {/* Soft blobs painted inside the card (lighter purple). */}
      <Svg
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        viewBox="0 0 350 139"
        preserveAspectRatio="xMidYMid slice"
      >
        <Ellipse cx={30} cy={22} rx={60} ry={40} fill={CARD_BLOB} opacity={0.55} />
        <Ellipse cx={320} cy={118} rx={70} ry={44} fill={CARD_BLOB} opacity={0.55} />
        <Ellipse cx={240} cy={14} rx={48} ry={26} fill={CARD_BLOB} opacity={0.45} />
        <Ellipse cx={100} cy={130} rx={54} ry={32} fill={CARD_BLOB} opacity={0.45} />
      </Svg>

      <Text style={styles.label}>WALLET BALANCE</Text>
      <View style={styles.balanceRow}>
        <Text style={styles.balance}>{hidden ? '₦••••••' : formatNaira(balance)}</Text>
        <Pressable
          hitSlop={10}
          onPress={() => setHidden((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={hidden ? 'Show balance' : 'Hide balance'}
          style={styles.eyeBtn}
        >
          <EyeOffIcon size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </>
  );

  return (
    <View style={style}>
      {onPressCard ? (
        <Pressable
          accessibilityRole="button"
          onPress={onPressCard}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          {cardBody}
        </Pressable>
      ) : (
        <View style={styles.card}>{cardBody}</View>
      )}

      <View style={styles.bank}>
        <Text style={styles.bankName}>{bankName}</Text>
        <View style={styles.bankDivider} />
        <Text style={styles.bankAccount}>{accountNumber}</Text>
        <Pressable
          hitSlop={8}
          onPress={onCopyAccount}
          accessibilityRole="button"
          accessibilityLabel="Copy account number"
          style={styles.copyBtn}
        >
          <CopyIcon size={18} color={colors.text.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 139,
    borderRadius: 20,
    backgroundColor: CARD_PURPLE,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cardPressed: { opacity: 0.94 },

  label: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 13,
    letterSpacing: 0.6,
    color: 'rgba(255,255,255,0.92)',
    textTransform: 'uppercase',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 10,
  },
  balance: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: -0.6,
    color: '#FFFFFF',
  },
  eyeBtn: { padding: 2 },

  bank: {
    marginTop: 6,
    height: 46,
    borderRadius: 23,
    backgroundColor: BANK_BG,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  bankName: {
    ...typography.bodyMediumSemibold,
    color: colors.text.primary,
  },
  bankDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border.strong,
  },
  bankAccount: {
    ...typography.bodyMediumSemibold,
    color: colors.text.primary,
  },
  copyBtn: { marginLeft: 4 },
});
