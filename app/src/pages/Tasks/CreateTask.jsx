import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CreateTask() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledAt: new Date(),
    reminderAt: new Date(),
    assignedTo: '',
  });
  
  const [elderlyUsers, setElderlyUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    // In a real app, fetch elderly users from backend
    // For now, we'll use mock data
    setElderlyUsers([
      { _id: 'user1', firstName: 'Emma', lastName: 'Johnson' },
      { _id: 'user2', firstName: 'Robert', lastName: 'Smith' },
      { _id: 'user3', firstName: 'David', lastName: 'Williams' }
    ]);
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };
  
  const validateForm = () => {
    if (!formData.title || !formData.assignedTo || !formData.scheduledAt || !formData.reminderAt) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (formData.reminderAt > formData.scheduledAt) {
      setError('Reminder time cannot be after the scheduled time');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const taskData = {
        ...formData,
        createdBy: currentUser.userId,
      };
      
      const response = await taskService.createTask(taskData);
      
      if (response.data.success) {
        setSuccessMessage('Task created successfully!');
        setTimeout(() => {
          navigate('/tasks');
        }, 2000);
      } else {
        setError('Failed to create task. Please try again.');
      }
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.message || 'An error occurred while creating the task');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h1>
        
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
        
        <div className="bg-white shadow rounded-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Task Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field mt-1"
                placeholder="Enter task title"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="input-field mt-1"
                placeholder="Enter task description"
              />
            </div>
            
            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
                Assign To *
              </label>
              <select
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                required
                className="input-field mt-1"
              >
                <option value="">Select Elderly Person</option>
                {elderlyUsers.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700">
                  Scheduled Date & Time *
                </label>
                <DatePicker
                  selected={formData.scheduledAt}
                  onChange={(date) => handleDateChange(date, 'scheduledAt')}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="input-field mt-1 w-full"
                />
              </div>
              
              <div>
                <label htmlFor="reminderAt" className="block text-sm font-medium text-gray-700">
                  Reminder Date & Time *
                </label>
                <DatePicker
                  selected={formData.reminderAt}
                  onChange={(date) => handleDateChange(date, 'reminderAt')}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="input-field mt-1 w-full"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/tasks')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mx-auto"></div>
                ) : (
                  'Create Task'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 