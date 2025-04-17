import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function TaskList() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await taskService.getAllTasks();
        setTasks(response.data.tasks || []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, []);
  
  const handleCompleteTask = async (taskId) => {
    try {
      await taskService.completeTask(taskId);
      // Update task status in state
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, status: 'COMPLETED' } : task
      ));
    } catch (err) {
      console.error('Error completing task:', err);
      setError('Failed to update task. Please try again.');
    }
  };
  
  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'PENDING';
    if (filter === 'completed') return task.status === 'COMPLETED';
    if (filter === 'missed') return task.status === 'MISSED';
    return true;
  });
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Status icon based on task status
  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'MISSED':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        
        {/* Only show create button for FAMILY role */}
        {currentUser?.role === 'FAMILY' && (
          <Link 
            to="/tasks/new" 
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            New Task
          </Link>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <div className="text-red-700">{error}</div>
        </div>
      )}
      
      {/* Filter controls */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md ${
              filter === 'all' 
                ? 'bg-primary-100 text-primary-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-md ${
              filter === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-md ${
              filter === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('missed')}
            className={`px-3 py-1 rounded-md ${
              filter === 'missed' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Missed
          </button>
        </div>
      </div>
      
      {/* Tasks list */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-md shadow p-6 text-center">
          <p className="text-gray-500">No tasks found</p>
          {currentUser?.role === 'FAMILY' && (
            <Link to="/tasks/new" className="text-primary-600 hover:text-primary-800 mt-2 inline-block">
              Create your first task
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-md shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <li key={task._id} className="p-4 hover:bg-gray-50">
                <Link to={`/tasks/${task._id}`} className="block">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="mt-1 mr-3">
                        <StatusIcon status={task.status} />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{task.description}</p>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <span>Scheduled for: {formatDate(task.scheduledAt)}</span>
                          <span className="mx-2">•</span>
                          <span>Reminder: {formatDate(task.reminderAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {task.status === 'PENDING' && currentUser?.role !== 'FAMILY' && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCompleteTask(task._id);
                        }}
                        className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
                      >
                        Complete
                      </button>
                    )}
                    
                    <div className="ml-4">
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
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 