import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { AvatarAddImagePlaceholder } from '@/components/icons/AvatarAddImagePlaceholder';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useSignupFlow } from '@/store/signupFlow';
import { colors, fontFamilies, spacing, typography } from '@/theme';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

export default function ProfileScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const flow = useSignupFlow();

  const [firstName, setFirst] = useState(flow.firstName);
  const [lastName, setLast] = useState(flow.lastName);
  const [email, setEmail] = useState(flow.email);
  const [password, setPassword] = useState(flow.password);
  const [avatarUri, setAvatarUri] = useState<string | null>(flow.avatarUri);
  const [avatarMime, setAvatarMime] = useState<string | null>(flow.avatarMime);
  const [showPassword, setShowPassword] = useState(false);

  const valid =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    EMAIL_RE.test(email.trim()) &&
    password.length >= MIN_PASSWORD;

  const onPickImage = async (): Promise<void> => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo library access so you can pick a profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
      setAvatarMime(result.assets[0].mimeType ?? null);
    }
  };

  const onContinue = (): void => {
    flow.set({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
      avatarUri,
      avatarMime,
    });
    router.push('/(auth)/goal');
  };

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.padded}>
            <ScreenHeader step={2} totalSteps={3} />

            <Text style={styles.title}>Create a Profile</Text>
            <Text style={styles.subtitle}>
              Let{"'"}s begin with the essentials. Fill in your basic details to get started
            </Text>

            <View style={styles.avatarBlock}>
              <Pressable onPress={onPickImage} hitSlop={8}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                ) : (
                  <AvatarAddImagePlaceholder />
                )}
                <Text style={styles.addImageLink}>{avatarUri ? 'Change image' : 'Add image'}</Text>
              </Pressable>
            </View>

            <View style={styles.row}>
              <Input
                label="First name"
                placeholder="enter name"
                value={firstName}
                onChangeText={setFirst}
                autoCapitalize="words"
                containerStyle={styles.col}
              />
              <Input
                label="Last name"
                placeholder="enter name"
                value={lastName}
                onChangeText={setLast}
                autoCapitalize="words"
                containerStyle={styles.col}
              />
            </View>

            <View style={styles.fieldSpacer}>
              <Input
                label="Email"
                placeholder="enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.fieldSpacer}>
              <Input
                label="Password"
                hint={`${MIN_PASSWORD}+ characters`}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password-new"
                trailing={
                  <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                    {showPassword ? (
                      <EyeIcon size={20} color={colors.text.tertiary} />
                    ) : (
                      <EyeOffIcon size={20} color={colors.text.tertiary} />
                    )}
                  </Pressable>
                }
              />
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Button label="Continue" disabled={!valid} onPress={onContinue} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  padded: { paddingHorizontal: spacing.screenPadding },
  title: { ...typography.h1, color: colors.text.primary, marginTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: spacing.xs },

  avatarBlock: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.lg },
  avatarImage: {
    width: 136,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface.muted,
  },
  addImageLink: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    lineHeight: 21.7,
    letterSpacing: -0.21,
    color: colors.status.linkSoft,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  row: { flexDirection: 'row', gap: spacing.md },
  col: { flex: 1 },
  fieldSpacer: { marginTop: spacing.lg },

  footer: { paddingHorizontal: spacing.screenPadding },
});
