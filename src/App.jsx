import { Provider } from "react-redux";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "./store/store";
import { checkLogin } from "./store/authSlice";
// import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/DashBoard";
import Users from "./pages/Users";
import RolesPermissions from "./pages/RolesPermissions";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import TokenUsage from "./pages/TokenUsage";

const queryClient = new QueryClient();

// Component to check if user is already logged in on app start
function AuthChecker({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkLogin()); // Check localStorage on app start
  }, [dispatch]);

  return children;
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useSelector((state) => state.auth);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the protected content
  return children;
}

// Public Route Component (for login page)
function PublicRoute({ children }) {
  const { isLoggedIn } = useSelector((state) => state.auth);

  // If already logged in, redirect to dashboard
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // If not logged in, show login page
  return children;
}

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* <Toaster /> */}
        <Sonner />
        <BrowserRouter basename="/superadmin">
          <AuthChecker>
            <Routes>
              {/* Public route - only accessible when NOT logged in */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              {/* Protected routes - only accessible when logged in */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/roles" element={<RolesPermissions />} />
                        <Route path="/feedback" element={<Dashboard />} />
                        <Route path="/tokens" element={<Dashboard />} />
                        <Route path="/sessions" element={<Dashboard />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/settings" element={<Dashboard />} />
                        <Route path="/tokenusage" element={<TokenUsage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthChecker>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
