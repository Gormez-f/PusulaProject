import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { HelpScreen } from './src/screens/HelpScreen';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { CycleScreen } from './src/screens/CycleScreen';
import { MeScreen } from './src/screens/MeScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { hasOnboarded } from './src/consent';
import { registerOnboardingReset } from './src/appState';
import { colors, fonts } from './src/theme';

const Tab = createBottomTabNavigator();

type FeatherName = keyof typeof Feather.glyphMap;
function tabIcon(name: FeatherName) {
  return ({ color, size }: { color: string; size: number }) => (
    <Feather name={name} size={size ?? 22} color={color} />
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tealText,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.line, height: 88, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 12, fontFamily: fonts.semibold },
      }}
    >
      <Tab.Screen name="Şimdi" component={HelpScreen} options={{ tabBarIcon: tabIcon('compass') }} />
      <Tab.Screen name="Takvim" component={CalendarScreen} options={{ tabBarIcon: tabIcon('calendar') }} />
      <Tab.Screen name="Döngü" component={CycleScreen} options={{ tabBarIcon: tabIcon('moon') }} />
      <Tab.Screen name="Ben" component={MeScreen} options={{ tabBarIcon: tabIcon('user') }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [status, setStatus] = useState<'loading' | 'onboarding' | 'app'>('loading');
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    hasOnboarded().then((ok) => setStatus(ok ? 'app' : 'onboarding'));
    // Ben sekmesindeki "Tanitimi tekrar gor" buraya baglanir.
    registerOnboardingReset(() => setStatus('onboarding'));
  }, []);

  const ready = fontsLoaded && status !== 'loading';

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {!ready ? (
        <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.teal} />
        </View>
      ) : status === 'onboarding' ? (
        <OnboardingScreen onDone={() => setStatus('app')} />
      ) : (
        <NavigationContainer>
          <Tabs />
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}
