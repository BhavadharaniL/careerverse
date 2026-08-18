import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { Home as HomeIcon, BookOpen, GraduationCap, Briefcase, Newspaper } from 'lucide-react-native';

// Import Screens
import Onboarding from '../screens/Onboarding';
import Login from '../screens/Login';
import Register from '../screens/Register';
import GoalSelection from '../screens/GoalSelection';
import EducationSetup from '../screens/EducationSetup';
import Home from '../screens/Home';
import Learn from '../screens/Learn';
import Tests from '../screens/Tests';
import Opportunities from '../screens/Opportunities';
import News from '../screens/News';
import Profile from '../screens/Profile';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  GoalSelection: undefined;
  EducationSetup: undefined;
  MainApp: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: '#5f6368',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#ffffff'
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500'
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Learn"
        component={Learn}
        options={{
          tabBarLabel: 'Learn',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Tests"
        component={Tests}
        options={{
          tabBarLabel: 'Tests',
          tabBarIcon: ({ color, size }) => <GraduationCap color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Opportunities"
        component={Opportunities}
        options={{
          tabBarLabel: 'Opportunities',
          tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="News"
        component={News}
        options={{
          tabBarLabel: 'News',
          tabBarIcon: ({ color, size }) => <Newspaper color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // Auth Stack
        <>
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      ) : !user.goals || user.goals.length === 0 ? (
        // Profile setup stack
        <>
          <Stack.Screen name="GoalSelection" component={GoalSelection} />
          <Stack.Screen name="EducationSetup" component={EducationSetup} />
        </>
      ) : (
        // Authorized App Stack
        <Stack.Screen name="MainApp" component={BottomTabNavigator} />
      )}
    </Stack.Navigator>
  );
};
