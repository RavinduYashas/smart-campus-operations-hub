import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import TicketPage from './pages/TicketPage';
import ReportsPage from './pages/ReportsPage';
import Unauthorized from './pages/Unauthorized';

const TokenHandler = () => {
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            login(token);
            // Clean up the URL
            window.history.replaceState({}, document.title, "/dashboard");
        }
    }, [token, login]);

    if (token) return <Navigate to="/dashboard" replace />;
    return <Login />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/login" element={<TokenHandler />} />
                            <Route path="/" element={<Navigate to="/login" replace />} />
                            
                            {/* Generic Protected Dashboard */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/unauthorized" element={<Unauthorized />} />
                            </Route>

                            {/* Role-Specific Protected Routes */}
                            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                                <Route path="/admin" element={<AdminPanel />} />
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={['TECHNICIAN']} />}>
                                <Route path="/tickets" element={<TicketPage />} />
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
                                <Route path="/reports" element={<ReportsPage />} />
                            </Route>
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
