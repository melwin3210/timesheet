'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask } from '../store/taskSlice';
import { fetchTimesheets } from '../store/timesheetSlice';
import { fetchUsers } from '../store/userSlice';
import { logout } from '../store/authSlice';

export default function ManagerDashboard({ initialTasks = [], initialTimesheets = [], initialUsers = [] }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { items: tasks } = useSelector(state => state.tasks);
  const { items: timesheets } = useSelector(state => state.timesheets);
  const { items: users } = useSelector(state => state.users);
  const [newTask, setNewTask] = useState({ description: '', estimatedHours: '', assignedTo: '', date: '' });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (initialTasks.length === 0) dispatch(fetchTasks());
    if (initialTimesheets.length === 0) dispatch(fetchTimesheets());
    if (initialUsers.length === 0) dispatch(fetchUsers('associate'));
  }, [dispatch, initialTasks.length, initialTimesheets.length, initialUsers.length]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    await dispatch(createTask({ ...newTask, createdBy: user.id }));
    setNewTask({ description: '', estimatedHours: '', assignedTo: '', date: '' });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Assignment */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Assign New Task</h3>
              {showSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 text-sm font-medium">✓ Task successfully assigned!</p>
                </div>
              )}
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Task description"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Estimated hours"
                    required
                    step="0.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({...newTask, estimatedHours: e.target.value})}
                  />
                </div>
                <div>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  >
                    <option value="">Select Associate</option>
                    {(users.length > 0 ? users : initialUsers).map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={newTask.date}
                    onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                >
                  Assign Task
                </button>
              </form>
            </div>
          </div>

          {/* Timesheet Overview */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Submitted Timesheets</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(timesheets.length > 0 ? timesheets : initialTimesheets).filter(t => t.submitted).map(timesheet => {
                  const associate = (users.length > 0 ? users : initialUsers).find(u => u.id === timesheet.userId);
                  const task = (tasks.length > 0 ? tasks : initialTasks).find(t => t.id === timesheet.taskId);
                  return (
                    <div key={timesheet.id} className="border rounded p-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{associate?.name}</span>
                        <span className="text-sm text-gray-500">{timesheet.date}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Task: {task?.description}
                      </div>
                      <div className="text-sm">
                        Estimated: {task?.estimatedHours}h | Actual: {timesheet.actualHours}h
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* All Tasks */}
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">All Assigned Tasks</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Hours</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(tasks.length > 0 ? tasks : initialTasks).map(task => {
                    const assignee = (users.length > 0 ? users : initialUsers).find(u => u.id == task.assignedTo);
                    return (
                      <tr key={task.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignee?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.estimatedHours}h</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}