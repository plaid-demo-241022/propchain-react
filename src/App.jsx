import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';

import HomePage           from '@/pages/HomePage';
import AboutPage          from '@/pages/AboutPage';
import HowItWorksPage     from '@/pages/HowItWorksPage';
import PropertiesPage     from '@/pages/PropertiesPage';
import PropertyDetailPage from '@/pages/PropertyDetailPage';
import PortfolioPage      from '@/pages/PortfolioPage';
import DashboardPage      from '@/pages/DashboardPage';
import RegisterPage       from '@/pages/RegisterPage';
import SignInPage         from '@/pages/SignInPage';
import WhitepaperPage     from '@/pages/WhitepaperPage';
import NotFoundPage       from '@/pages/NotFoundPage';
import BitcoinPage        from '@/pages/BitcoinPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } },
});

function AuthProvider({ children }) {
  const { setFirebaseUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });
    return unsub;
  }, [setFirebaseUser, setLoading]);

  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/"                    element={<HomePage />}           />
            <Route path="/about"               element={<AboutPage />}          />
            <Route path="/how-it-works"        element={<HowItWorksPage />}     />
            <Route path="/properties"          element={<PropertiesPage />}     />
            <Route path="/properties/:id"      element={<PropertyDetailPage />} />
            <Route path="/portfolio"           element={<PortfolioPage />}      />
            <Route path="/dashboard"           element={<DashboardPage />}      />
            <Route path="/register"            element={<RegisterPage />}       />
            <Route path="/signin"              element={<SignInPage />}         />
            <Route path="/whitepaper"          element={<WhitepaperPage />}     />
            <Route path="/bitcoin"             element={<BitcoinPage />}        />
            <Route path="*"                    element={<NotFoundPage />}       />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
