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
  const [searchTask, setSearchTask] = useState('');

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Manager Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={() => dispatch(logout())}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Assign New Task</h3>
              </div>
              {showSuccess && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-green-800 font-medium">Task successfully assigned!</p>
                  </div>
                </div>
              )}
              <Formik
                initialValues={{ description: '', estimatedHours: '', assignedTo: '', date: new Date().toISOString().split('T')[0] }}
                validate={validate}
                onSubmit={handleCreateTask}
              >
                <Form className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Task Description</label>
                    <Field
                      name="description"
                      type="text"
                      placeholder="Enter task description"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-2 font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Hours</label>
                    <Field
                      name="estimatedHours"
                      type="number"
                      step="0.5"
                      min="0.5"
                      placeholder="0.5"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70"
                    />
                    <ErrorMessage name="estimatedHours" component="div" className="text-red-500 text-sm mt-2 font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
                    <Field
                      name="assignedTo"
                      as="select"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70"
                    >
                      <option value="">Select Associate</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="assignedTo" component="div" className="text-red-500 text-sm mt-2 font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                    <Field
                      name="date"
                      type="date"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70"
                    />
                    <ErrorMessage name="date" component="div" className="text-red-500 text-sm mt-2 font-medium" />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Assign Task
                  </button>
                </Form>
              </Formik>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Submitted Timesheets</h3>
              </div>
              <div className="mb-6">
                <select
                  value={filterAssociate}
                  onChange={(e) => setFilterAssociate(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70"
                >
                  <option value="">All Associates</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {timesheets
                  .filter(t => t.submitted)
                  .filter(t => !filterAssociate || t.userId == filterAssociate)
                  .map(timesheet => {
                  const associate = users.find(u => u.id === timesheet.userId);
                  const task = tasks.find(t => t.id === timesheet.taskId);
                  return (
                    <div key={timesheet.id} className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4 hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-semibold text-gray-900">{associate?.name}</span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">{timesheet.date}</span>
                      </div>
                      <div className="text-sm text-gray-700 mb-3">
                        <span className="font-medium">Task:</span> {task?.description}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-600 font-medium">Est: {task?.estimatedHours}h</span>
                        <span className="text-green-600 font-medium">Actual: {timesheet.actualHours}h</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">All Assigned Tasks</h3>
            </div>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTask}
                onChange={(e) => setSearchTask(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70 w-full max-w-md"
              />
            </div>
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200" onClick={() => handleSort('task')}>
                      <div className="flex items-center">
                        Task
                        {sortBy === 'task' && (
                          <span className="ml-2 text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200" onClick={() => handleSort('assignee')}>
                      <div className="flex items-center">
                        Assigned To
                        {sortBy === 'assignee' && (
                          <span className="ml-2 text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200" onClick={() => handleSort('date')}>
                      <div className="flex items-center">
                        Date
                        {sortBy === 'date' && (
                          <span className="ml-2 text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200" onClick={() => handleSort('hours')}>
                      <div className="flex items-center">
                        Hours
                        {sortBy === 'hours' && (
                          <span className="ml-2 text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-100">
                  {[...tasks]
                    .filter(task => task.description.toLowerCase().includes(searchTask.toLowerCase()))
                    .sort((a, b) => {
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
                      <tr key={task.id} className="hover:bg-white/70 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{assignee?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-xs font-medium">{task.date}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600">{task.estimatedHours}h</td>
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