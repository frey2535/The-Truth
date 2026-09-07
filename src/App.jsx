import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { OwnerProvider } from '@/lib/OwnerContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ResumePath from './components/ResumePath';
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import StudyPlanView from "@/pages/StudyPlanView";
import WordStudy from "@/pages/WordStudy";
import Assistant from "@/pages/Assistant";
import Evidence from "@/pages/Evidence";
import EvidenceHolidays from "@/pages/EvidenceHolidays";
import ModernFulfillment from "@/pages/ModernFulfillment";
import Scientific from "@/pages/Scientific";
import Government from "@/pages/Government";
import Library from "@/pages/Library";
import Customs from "@/pages/Customs";
import Investigate from "@/pages/Investigate";
import Learn from "@/pages/Learn";
import Install from "@/pages/Install";
import Privacy from "@/pages/Privacy";
import DataSafety from "@/pages/DataSafety";
import Account from "@/pages/Account";
import Search from "@/pages/Search";
import MyStudy from "@/pages/MyStudy";
import MapExplore from "@/pages/MapExplore";
import Calendar from "@/pages/Calendar";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import OwnerLogin from "@/pages/OwnerLogin";
import OwnerDownloads from "@/pages/OwnerDownloads";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center truth-app">
        <div className="w-8 h-8 border-4 border-[#e8c97a]/30 border-t-[#e8c97a] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/owner" element={<OwnerLogin />} />
      <Route path="/owner/downloads" element={<OwnerDownloads />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/plan/:id" element={<StudyPlanView />} />
        <Route path="/word-study" element={<WordStudy />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/evidence" element={<Evidence />} />
        <Route path="/evidence/holidays" element={<EvidenceHolidays />} />
        <Route path="/prophecy" element={<ModernFulfillment />} />
        <Route path="/modern" element={<Navigate to="/prophecy" replace />} />
        <Route path="/science" element={<Scientific />} />
        <Route path="/government" element={<Government />} />
        <Route path="/library" element={<Library />} />
        <Route path="/search" element={<Search />} />
        <Route path="/notebook" element={<MyStudy />} />
        <Route path="/map" element={<MapExplore />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/customs" element={<Customs />} />
        <Route path="/customs/symbol/:symbolId" element={<Customs />} />
        <Route path="/customs/name/:nameId" element={<Customs />} />
        <Route path="/customs/:customId" element={<Customs />} />
        <Route path="/investigate" element={<Investigate />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/install" element={<Install />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/data-safety" element={<DataSafety />} />
        <Route path="/account" element={<Account />} />
        </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

function App() {

  return (
    <AuthProvider>
      <OwnerProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router basename={routerBasename}>
            <ScrollToTop />
            <ResumePath />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </OwnerProvider>
    </AuthProvider>
  )
}

export default App