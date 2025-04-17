import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Main Pages
import Dashboard from './pages/Dashboard';

// Task Pages
import TaskList from './pages/Tasks/TaskList';
import CreateTask from './pages/Tasks/CreateTask';
import TaskDetail from './pages/Tasks/TaskDetail';

// Chat Pages
import ChatPage from './pages/Chat/ChatPage';

// Emergency Pages
import EmergencyPage from './pages/Emergency/EmergencyPage';

// Other feature pages would be imported similarly

// Placeholder for pages not yet implemented
const UnderConstruction = () => (
  <div className="page-container">
    <div className="p-8 bg-yellow-50 rounded-lg text-center">
      <h2 className="text-2xl font-bold text-yellow-800 mb-4">Page Under Construction</h2>
      <p className="text-yellow-700">
        This feature is coming soon! We're working hard to bring you the best experience.
      </p>
    </div>
  </div>
);

// Not found page
const NotFound = () => (
  <div className="page-container">
    <div className="p-8 bg-red-50 rounded-lg text-center">
      <h2 className="text-2xl font-bold text-red-800 mb-4">Page Not Found</h2>
      <p className="text-red-700">
        The page you are looking for doesn't exist or has been moved.
      </p>
    </div>
  </div>
);

// Unauthorized page
const Unauthorized = () => (
  <div className="page-container">
    <div className="p-8 bg-red-50 rounded-lg text-center">
      <h2 className="text-2xl font-bold text-red-800 mb-4">Access Denied</h2>
      <p className="text-red-700">
        You don't have permission to access this page.
      </p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Task routes */}
              <Route 
                path="/tasks" 
                element={
                  <ProtectedRoute>
                    <TaskList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks/new" 
                element={
                  <ProtectedRoute allowedRoles={['FAMILY']}>
                    <CreateTask />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks/:taskId" 
                element={
                  <ProtectedRoute>
                    <TaskDetail />
                  </ProtectedRoute>
                } 
              />
              
              {/* Chat routes */}
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Emergency routes */}
              <Route 
                path="/emergency" 
                element={
                  <ProtectedRoute>
                    <EmergencyPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Placeholder routes for features not yet implemented */}
              <Route 
                path="/prescriptions" 
                element={
                  <ProtectedRoute>
                    <UnderConstruction />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/grocery" 
                element={
                  <ProtectedRoute>
                    <UnderConstruction />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/health" 
                element={
                  <ProtectedRoute>
                    <UnderConstruction />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/forum" 
                element={
                  <ProtectedRoute>
                    <UnderConstruction />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/checkins" 
                element={
                  <ProtectedRoute allowedRoles={['FAMILY']}>
                    <UnderConstruction />
                  </ProtectedRoute>
                } 
              />
              
              {/* Utility routes */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/not-found" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/not-found" replace />} />
            </Routes>
          </main>
          <footer className="bg-white shadow-inner py-4 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} ElderlyCare. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
