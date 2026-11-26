import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: '홈' }} />
      <Tabs.Screen name="teachtok" options={{ title: '티치톡' }} />
      <Tabs.Screen name="my" options={{ title: 'MY' }} />
    </Tabs>
  );
}
