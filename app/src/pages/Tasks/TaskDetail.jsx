import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { taskService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

export default function TaskDetail() {
  const { taskId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await taskService.getTaskById(taskId);
        setTask(response.data.task);
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Failed to load task details. It may have been deleted or you may not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTask();
  }, [taskId]);
  
  const handleCompleteTask = async () => {
    try {
      await taskService.completeTask(taskId);
      setTask({ ...task, status: 'COMPLETED' });
    } catch (err) {
      console.error('Error completing task:', err);
      setError('Failed to complete task. Please try again.');
    }
  };
  
  const handleDeleteTask = async () => {
    try {
      await taskService.deleteTask(taskId);
      navigate('/tasks', { replace: true });
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
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
      <div className="page-container">
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <div className="text-red-700">{error}</div>
        </div>
        <Link to="/tasks" className="text-primary-600 hover:text-primary-800 flex items-center">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Tasks
        </Link>
      </div>
    );
  }
  
  if (!task) {
    return (
      <div className="page-container">
        <div className="bg-yellow-50 p-4 rounded-md mb-6">
          <div className="text-yellow-700">Task not found</div>
        </div>
        <Link to="/tasks" className="text-primary-600 hover:text-primary-800 flex items-center">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Tasks
        </Link>
      </div>
    );
  }
  
  // Helper function for status icon
  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'MISSED':
        return <ExclamationCircleIcon className="h-6 w-6 text-red-500" />;
      default:
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
    }
  };
  
  // Helper function for status badge
  const StatusBadge = ({ status }) => {
    let colorClasses = '';
    switch (status) {
      case 'COMPLETED':
        colorClasses = 'bg-green-100 text-green-800';
        break;
      case 'MISSED':
        colorClasses = 'bg-red-100 text-red-800';
        break;
      default:
        colorClasses = 'bg-yellow-100 text-yellow-800';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-sm ${colorClasses}`}>
        {status}
      </span>
    );
  };
  
  return (
    <div className="page-container">
      <div className="flex items-center mb-6">
        <Link to="/tasks" className="text-primary-600 hover:text-primary-800 flex items-center mr-4">
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Tasks
        </Link>
        
        <h1 className="text-2xl font-bold text-gray-900 flex-grow">{task.title}</h1>
        
        {/* Action buttons - only for appropriate roles */}
        <div className="flex space-x-2">
          {task.status === 'PENDING' && currentUser?.role !== 'FAMILY' && (
            <button
              onClick={handleCompleteTask}
              className="btn-primary inline-flex items-center"
            >
              <CheckCircleIcon className="h-5 w-5 mr-1" />
              Complete
            </button>
          )}
          
          {currentUser?.role === 'FAMILY' && (
            <>
              <Link
                to={`/tasks/edit/${taskId}`}
                className="btn-secondary inline-flex items-center"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </Link>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-50 text-red-600 px-3 py-1 rounded-md hover:bg-red-100 inline-flex items-center"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Task details card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <StatusIcon status={task.status} />
              <div className="ml-2">
                <StatusBadge status={task.status} />
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              Created: {formatDate(task.createdAt)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Scheduled Time</h3>
              <p className="mt-1 text-gray-900">{formatDate(task.scheduledAt)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Reminder</h3>
              <p className="mt-1 text-gray-900">{formatDate(task.reminderAt)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created By</h3>
              <p className="mt-1 text-gray-900">
                {task.createdBy ? `${task.createdBy.firstName} ${task.createdBy.lastName}` : 'Unknown'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
              <p className="mt-1 text-gray-900">
                {task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : 'Unassigned'}
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-gray-900 whitespace-pre-line">
              {task.description || 'No description provided'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 