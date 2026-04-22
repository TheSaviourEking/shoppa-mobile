import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth';

export default function RootIndex(): React.JSX.Element {
  const accessToken = useAuthStore((s) => s.accessToken);
  return <Redirect href={accessToken ? '/(tabs)' : '/(auth)/splash'} />;
}
