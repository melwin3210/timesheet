'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { fetchTasks, createTask, initializeTasks } from '../store/taskSlice';
import { fetchTimesheets, initializeTimesheets } from '../store/timesheetSlice';
import { fetchUsers, initializeUsers } from '../store/userSlice';
import { logout } from '../store/authSlice';

export const validate = (values) => {
  const errors = {};
  if (!values.description) errors.description = 'Required';
  if (!values.estimatedHours || values.estimatedHours < 0.5) errors.estimatedHours = 'Must be at least 0.5 hours';
  if (!values.assignedTo) errors.assignedTo = 'Required';
  if (!values.date) errors.date = 'Required';
  return errors;
};

export default function ManagerDashboard({ initialTasks = [], initialTimesheets = [], initialUsers = [] }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { items: tasks } = useSelector(state => state.tasks);
  const { items: timesheets } = useSelector(state => state.timesheets);
  const { items: users } = useSelector(state => state.users);
  const [showSuccess, setShowSuccess] = useState(false);
  const [filterAssociate, setFilterAssociate] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    if (initialTasks.length) dispatch(initializeTasks(initialTasks));
    if (initialTimesheets.length) dispatch(initializeTimesheets(initialTimesheets));
    if (initialUsers.length) dispatch(initializeUsers(initialUsers));
    
    if (!initialTasks.length && !tasks.length) dispatch(fetchTasks());
    if (!initialTimesheets.length && !timesheets.length) dispatch(fetchTimesheets());
    if (!initialUsers.length && !users.length) dispatch(fetchUsers('associate'));
  }, [dispatch, initialTasks, initialTimesheets, initialUsers, tasks.length, timesheets.length, users.length]);

  const handleCreateTask = async (values, { resetForm }) => {
    await dispatch(createTask({
      ...values,
      estimatedHours: parseFloat(values.estimatedHours),
      createdBy: user.id
    }));
    resetForm();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={() => dispatch(logout())}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assign New Task</h3>
              {showSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-800 text-sm">Task successfully assigned!</p>
                </div>
              )}
              <Formik
                initialValues={{ description: '', estimatedHours: '', assignedTo: '', date: new Date().toISOString().split('T')[0] }}
                validate={validate}
                onSubmit={handleCreateTask}
              >
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Task Description</label>
                    <Field
                      name="description"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                    <Field
                      name="estimatedHours"
                      type="number"
                      step="0.5"
                      min="0.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="estimatedHours" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                    <Field
                      name="assignedTo"
                      as="select"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Associate</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="assignedTo" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <Field
                      name="date"
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="date" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium"
                  >
                    Assign Task
                  </button>
                </Form>
              </Formik>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Submitted Timesheets</h3>
              <div className="mb-4">
                <select
                  value={filterAssociate}
                  onChange={(e) => setFilterAssociate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Associates</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {timesheets
                  .filter(t => t.submitted)
                  .filter(t => !filterAssociate || t.userId == filterAssociate)
                  .map(timesheet => {
                  const associate = users.find(u => u.id === timesheet.userId);
                  const task = tasks.find(t => t.id === timesheet.taskId);
                  return (
                    <div key={timesheet.id} className="border border-gray-200 rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">{associate?.name}</span>
                        <span className="text-sm text-gray-500">{timesheet.date}</span>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Task:</span> {task?.description}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-600">Est: {task?.estimatedHours}h</span>
                        <span className="text-green-600">Actual: {timesheet.actualHours}h</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">All Assigned Tasks</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('task')}>
                      <div className="flex items-center">
                        Task
                        {sortBy === 'task' && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('assignee')}>
                      <div className="flex items-center">
                        Assigned To
                        {sortBy === 'assignee' && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('date')}>
                      <div className="flex items-center">
                        Date
                        {sortBy === 'date' && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('hours')}>
                      <div className="flex items-center">
                        Hours
                        {sortBy === 'hours' && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...tasks].sort((a, b) => {
                    if (!sortBy) return 0;
                    let result = 0;
                    if (sortBy === 'task') result = a.description.localeCompare(b.description);
                    if (sortBy === 'assignee') {
                      const aName = users.find(u => u.id == a.assignedTo)?.name || '';
                      const bName = users.find(u => u.id == b.assignedTo)?.name || '';
                      result = aName.localeCompare(bName);
                    }
                    if (sortBy === 'date') result = new Date(a.date) - new Date(b.date);
                    if (sortBy === 'hours') result = a.estimatedHours - b.estimatedHours;
                    return sortOrder === 'desc' ? -result : result;
                  }).map(task => {
                    const assignee = users.find(u => u.id == task.assignedTo);
                    return (
                      <tr key={task.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-900">{task.description}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">{assignee?.name}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">{task.date}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">{task.estimatedHours}h</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}