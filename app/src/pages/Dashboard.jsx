import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { taskService, emergencyService, healthService } from '../services/api';
import { initializeSocket, subscribeToEmergencyAlerts } from '../services/socket';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch tasks
        const tasksResponse = await taskService.getAllTasks();
        setTasks(tasksResponse.data.tasks || []);
        
        // Fetch emergencies for family members and volunteers
        if (currentUser?.role === 'FAMILY' || currentUser?.role === 'VOLUNTEER') {
          const emergenciesResponse = await emergencyService.getEmergencyAlerts();
          setEmergencies(emergenciesResponse.data.alerts || []);
        }
        
        // Fetch health logs for elderly and family members
        if (currentUser?.role === 'ELDERLY' || currentUser?.role === 'FAMILY') {
          const userId = currentUser.role === 'ELDERLY' ? currentUser.userId : null;
          const healthResponse = await healthService.getHealthLogs(userId);
          setHealthLogs(healthResponse.data.healthLogs || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchDashboardData();
      
      // Set up Socket.IO for real-time alerts
      const socket = initializeSocket();
      
      if (currentUser.role === 'FAMILY' || currentUser.role === 'VOLUNTEER') {
        subscribeToEmergencyAlerts((alert) => {
          setEmergencies((prev) => [alert, ...prev]);
        });
      }
    }
  }, [currentUser]);

  // Helper to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Welcome Card */}
        <div className="card col-span-full bg-primary-50 border border-primary-200">
          <h2 className="text-2xl font-bold text-primary-800 mb-2">Welcome, {currentUser?.firstName || 'User'}!</h2>
          <p className="text-primary-700">
            {currentUser?.role === 'ELDERLY' && 'Manage your tasks, health records, and stay connected with your family.'}
            {currentUser?.role === 'FAMILY' && 'Monitor and support your elderly family members.'}
            {currentUser?.role === 'VOLUNTEER' && 'Find opportunities to help elderly community members.'}
          </p>
        </div>

        {/* Tasks Overview */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Tasks</h2>
            <Link to="/tasks" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              View All
            </Link>
          </div>
          
          {tasks.length === 0 ? (
            <p className="text-gray-500">No upcoming tasks</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.slice(0, 3).map((task) => (
                <li key={task._id} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-500">{formatDate(task.scheduledAt)}</p>
                    </div>
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-800' 
                          : task.status === 'MISSED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Emergency Alerts - Only for Family/Volunteer */}
        {(currentUser?.role === 'FAMILY' || currentUser?.role === 'VOLUNTEER') && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Emergency Alerts</h2>
              <Link to="/emergency" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                View All
              </Link>
            </div>
            
            {emergencies.length === 0 ? (
              <p className="text-gray-500">No active emergencies</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {emergencies.slice(0, 3).map((alert) => (
                  <li key={alert._id} className="py-3">
                    <div>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${alert.resolved ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                        <p className="font-medium text-gray-800">
                          {alert.elderlyName || 'Elderly User'} - {alert.type}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(alert.createdAt)}</p>
                      <p className="text-sm mt-1">{alert.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Health Overview - Only for Elderly/Family */}
        {(currentUser?.role === 'ELDERLY' || currentUser?.role === 'FAMILY') && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Health Overview</h2>
              <Link to="/health" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                View Details
              </Link>
            </div>
            
            {healthLogs.length === 0 ? (
              <p className="text-gray-500">No health data recorded</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {healthLogs.slice(0, 3).map((log) => (
                  <li key={log._id} className="py-3">
                    <div>
                      <p className="font-medium text-gray-800">{log.activityType}</p>
                      <p className="text-sm text-gray-500">{formatDate(log.timestamp)}</p>
                      <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
                        {log.heartRate && (
                          <div>
                            <span className="text-gray-500">Heart Rate:</span> {log.heartRate} bpm
                          </div>
                        )}
                        {log.bloodPressure && (
                          <div>
                            <span className="text-gray-500">BP:</span> {log.bloodPressure}
                          </div>
                        )}
                        {log.steps && (
                          <div>
                            <span className="text-gray-500">Steps:</span> {log.steps}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Quick Actions Card */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {currentUser?.role === 'ELDERLY' && (
              <>
                <Link to="/emergency/new" className="btn-primary text-center">
                  Request Help
                </Link>
                <Link to="/health/new" className="btn-secondary text-center">
                  Log Health Data
                </Link>
                <Link to="/chat" className="btn-secondary text-center">
                  Chat with Family
                </Link>
                <Link to="/forum" className="btn-secondary text-center">
                  Community Forum
                </Link>
              </>
            )}
            
            {currentUser?.role === 'FAMILY' && (
              <>
                <Link to="/tasks/new" className="btn-primary text-center">
                  Create Task
                </Link>
                <Link to="/checkins/new" className="btn-secondary text-center">
                  Check In
                </Link>
                <Link to="/chat" className="btn-secondary text-center">
                  Chat
                </Link>
                <Link to="/prescriptions/new" className="btn-secondary text-center">
                  Add Prescription
                </Link>
              </>
            )}
            
            {currentUser?.role === 'VOLUNTEER' && (
              <>
                <Link to="/tasks" className="btn-primary text-center">
                  Available Tasks
                </Link>
                <Link to="/emergency" className="btn-secondary text-center">
                  Emergency Alerts
                </Link>
                <Link to="/forum" className="btn-secondary text-center">
                  Community Forum
                </Link>
                <Link to="/chat" className="btn-secondary text-center">
                  Chat
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 