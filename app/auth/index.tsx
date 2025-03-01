import { Redirect, useLocalSearchParams } from 'expo-router';

// Allow specifying which auth screen to show
export default function Auth() {
  const params = useLocalSearchParams();
  
  console.log("Auth route params:", params);
  
  // If a specific screen is requested, go there
  if (params.screen === 'login') {
    console.log("Redirecting to login");
    return <Redirect href="/auth/login" />;
  }
  
  console.log("Redirecting to signup");
  // Default to signup
  return <Redirect href="/auth/signup" />;
} 