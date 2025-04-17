import { useState, useEffect } from 'react';
import { emergencyService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  subscribeToEmergencyAlerts, 
  unsubscribeFromEmergencyAlerts 
} from '../../services/socket';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function EmergencyPage() {
  const { currentUser } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [emergencyData, setEmergencyData] = useState({
    type: 'MEDICAL',
    message: '',
    location: '',
  });
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchEmergencyAlerts = async () => {
      try {
        setLoading(true);
        const response = await emergencyService.getEmergencyAlerts();
        setAlerts(response.data.alerts || []);
      } catch (err) {
        console.error('Error fetching emergency alerts:', err);
        setError('Failed to load emergency alerts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyAlerts();

    // Subscribe to real-time emergency alerts
    subscribeToEmergencyAlerts((newAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);
    });

    return () => {
      unsubscribeFromEmergencyAlerts();
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmergencyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEmergency = async (e) => {
    e.preventDefault();
    
    if (!emergencyData.type || !emergencyData.message) {
      setError('Please provide emergency type and message.');
      return;
    }

    setSending(true);
    setError(null);

    try {
      const response = await emergencyService.createEmergencyAlert({
        ...emergencyData,
        elderlyId: currentUser.userId,
      });

      if (response.data.success) {
        setEmergencyData({
          type: 'MEDICAL',
          message: '',
          location: '',
        });
        setShowEmergencyForm(false);
        setSuccessMessage('Emergency alert sent successfully! Help is on the way.');
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }
    } catch (err) {
      console.error('Error sending emergency alert:', err);
      setError('Failed to send emergency alert. Please try again or call emergency services directly.');
    } finally {
      setSending(false);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await emergencyService.resolveEmergencyAlert(alertId);
      
      // Update the alert status in the UI
      setAlerts(alerts.map(alert => 
        alert._id === alertId ? { ...alert, resolved: true } : alert
      ));
      
    } catch (err) {
      console.error('Error resolving alert:', err);
      setError('Failed to resolve alert. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isElderlyUser = currentUser?.role === 'ELDERLY';

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Emergency Assistance</h1>
        
        {isElderlyUser && (
          <button
            onClick={() => setShowEmergencyForm(!showEmergencyForm)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors inline-flex items-center"
          >
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            Request Emergency Help
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <div className="text-red-700">{error}</div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 p-4 rounded-md mb-6">
          <div className="text-green-700">{successMessage}</div>
        </div>
      )}

      {/* Emergency Request Form for Elderly Users */}
      {showEmergencyForm && isElderlyUser && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-red-800 mb-4">Request Emergency Help</h2>
          
          <form onSubmit={handleSubmitEmergency} className="space-y-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Type
              </label>
              <select
                id="type"
                name="type"
                value={emergencyData.type}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="MEDICAL">Medical Emergency</option>
                <option value="FALL">Fall</option>
                <option value="SECURITY">Security Concern</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Describe Your Emergency
              </label>
              <textarea
                id="message"
                name="message"
                value={emergencyData.message}
                onChange={handleInputChange}
                rows={3}
                className="input-field"
                placeholder="Please describe what's happening..."
                required
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Your Location (if not at home)
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={emergencyData.location}
                onChange={handleInputChange}
                className="input-field"
                placeholder="E.g., Living room, Nearby park, etc."
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEmergencyForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                {sending ? (
                  <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mx-auto"></div>
                ) : (
                  'Send Emergency Alert'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Contact Information */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Emergency Contact Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start">
            <PhoneIcon className="h-6 w-6 text-red-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium">Emergency Services</h3>
              <p className="text-lg font-bold">911</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <PhoneIcon className="h-6 w-6 text-primary-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium">Family Contact</h3>
              <p>(555) 123-4567</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPinIcon className="h-6 w-6 text-green-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium">Nearest Hospital</h3>
              <p>City General Hospital (2.3 miles)</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Emergency Alerts List - For caregivers or volunteers */}
      {!isElderlyUser && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Emergency Alerts</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No emergency alerts at this time</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {alerts.map((alert) => (
                <li key={alert._id} className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div 
                          className={`h-3 w-3 rounded-full mr-2 ${
                            alert.resolved ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        ></div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {alert.type} Emergency
                        </h3>
                        {alert.resolved && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Resolved
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-2">{alert.message}</p>
                      
                      <div className="flex flex-wrap text-sm text-gray-500 gap-x-4">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>{alert.location || 'Home address'}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>{formatDate(alert.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {!alert.resolved && (
                      <div className="mt-4 md:mt-0 md:ml-4">
                        <button
                          onClick={() => handleResolveAlert(alert._id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <CheckCircleIcon className="h-5 w-5 mr-2" />
                          Mark as Resolved
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
} 