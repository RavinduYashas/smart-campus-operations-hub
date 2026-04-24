import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import RoleHeaderAlert from './components/RoleHeaderAlert';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/admin/AdminPanel';
import TicketPage from './pages/technician/TicketPage';
import ReportsPage from './pages/manager/ReportsPage';
import Unauthorized from './pages/Unauthorized';

// ============ IMPORTS ============
// User pages
import AssetCatalogue from './pages/user/AssetCatalogue';     // Module A - Your module
import BookingManagement from './pages/user/BookingManagement';     // Module B
import IncidentTicketing from './pages/user/IncidentTicketing';     // Module C
import NotificationHub from './pages/NotificationHub';              // Module D

// Admin pages
import AdminBookingQueue from './pages/admin/AdminBookingQueue';
import AssetManagement from './pages/admin/AssetsManagement';     // Module A Admin - Your module
import GlobalTicketView from './pages/admin/GlobalTicketView';
import TechnicianQueue from './pages/technician/TechnicianQueue';

// Manager
import ResourceInventoryReports from './pages/manager/ResourceInventoryReports';
import ManagerDashboard from './pages/manager/ManagerDashboard';

// ============ ADD THESE PLACEHOLDER COMPONENTS ============
const Attachments = () => <div className="p-8">Attachments Page - Coming Soon</div>;
const TechnicianUpdates = () => <div className="p-8">Technician Updates - Coming Soon</div>;
const IncidentTickets = () => <div className="p-8">Incident Tickets - Coming Soon</div>;
// ========================================================

const TokenHandler = () => {
    const [searchParams] = useSearchParams();
    const { login, user, loading } = useAuth();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_SUCCESS', token }, '*');
                window.close();
                return;
            } else {
                login(token);
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }, [token, login]);

    useEffect(() => {
        if (user && !loading) {
            switch (user.role) {
                case 'ADMIN':
                    navigate('/admin', { replace: true });
                    break;
                case 'MANAGER':
                    navigate('/reports', { replace: true });
                    break;
                case 'TECHNICIAN':
                    navigate('/tickets', { replace: true });
                    break;
                default:
                    navigate('/dashboard', { replace: true });
                    break;
            }
        }
    }, [user, loading, navigate]);

    if (token || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark"></div>
            </div>
        );
    }

    return <Login />;
};

function App() {
    return (
        <AuthProvider>
            <Toaster position="top-right" reverseOrder={false} />
            <Router>
                <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                    <Navbar />
                    <RoleHeaderAlert />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/login" element={<TokenHandler />} />
                            <Route path="/" element={<Home />} />
                            <Route path="/unauthorized" element={<Unauthorized />} />

                            <Route element={<ProtectedRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/notifications" element={<NotificationHub />} />
                                <Route path="/attachments" element={<Attachments />} />
                                <Route path="/technician-updates" element={<TechnicianUpdates />} />
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={['USER', 'MANAGER']} />}>
                                <Route path="/incident-tickets" element={<IncidentTickets />} />
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
                                <Route path="/user/AssetCatalogue" element={<AssetCatalogue />} />
                                <Route path="/my-bookings" element={<BookingManagement />} />
                                <Route path="/report-fault" element={<IncidentTicketing />} />
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                                <Route path="/admin" element={<AdminPanel />} />
                                <Route path="/admin/bookings" element={<AdminBookingQueue />} />
                                <Route path="/admin/assets" element={<AssetManagement />} />
                                <Route path="/admin/tickets" element={<GlobalTicketView />} />
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={['TECHNICIAN']} />}>
                                <Route path="/tickets" element={<TicketPage />} />
                                <Route path="/technician/tasks" element={<TechnicianQueue />} />
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