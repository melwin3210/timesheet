'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { z } from 'zod';
import { fetchTasks, createTask, initializeTasks } from '../store/taskSlice';
import { fetchTimesheets, initializeTimesheets } from '../store/timesheetSlice';
import { fetchUsers, initializeUsers } from '../store/userSlice';
import { logout } from '../store/authSlice';

const taskSchema = z.object({
  description: z.string().min(1, 'Task description is required'),
  estimatedHours: z.number().min(0.5, 'Must be at least 0.5 hours'),
  assignedTo: z.string().min(1, 'Please select an associate'),
  date: z.string().min(1, 'Date is required')
});

export default function ManagerDashboard({ initialTasks = [], initialTimesheets = [], initialUsers = [] }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { items: tasks } = useSelector(state => state.tasks);
  const { items: timesheets } = useSelector(state => state.timesheets);
  const { items: users } = useSelector(state => state.users);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Initialize Redux state with SSR data
    if (initialTasks.length > 0) dispatch(initializeTasks(initialTasks));
    if (initialTimesheets.length > 0) dispatch(initializeTimesheets(initialTimesheets));
    if (initialUsers.length > 0) dispatch(initializeUsers(initialUsers));
    
    // Fetch from API only if no initial data and Redux state is empty
    if (initialTasks.length === 0 && tasks.length === 0) dispatch(fetchTasks());
    if (initialTimesheets.length === 0 && timesheets.length === 0) dispatch(fetchTimesheets());
    if (initialUsers.length === 0 && users.length === 0) dispatch(fetchUsers('associate'));
  }, [dispatch, initialTasks, initialTimesheets, initialUsers, tasks.length, timesheets.length, users.length]);

  const handleCreateTask = async (values, { resetForm }) => {
    const taskData = {
      ...values,
      estimatedHours: parseFloat(values.estimatedHours),
      createdBy: user.id
    };
    await dispatch(createTask(taskData));
    resetForm();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const validate = (values) => {
    try {
      const validationData = {
        ...values,
        estimatedHours: parseFloat(values.estimatedHours) || 0
      };
      taskSchema.parse(validationData);
      return {};
    } catch (err) {
      return err.errors.reduce((acc, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {});
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Manager Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Assignment */}
          <div className="bg-white/70 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="px-6 py-6 sm:p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-2 font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Hours</label>
                    <Field
                      name="estimatedHours"
                      type="number"
                      placeholder="0.5"
                      step="0.5"
                      min="0.5"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70"
                    />
                    <ErrorMessage name="estimatedHours" component="div" className="text-red-500 text-sm mt-2 font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
                    <Field
                      name="assignedTo"
                      as="select"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70"
                    >
                      <option value="">Select Associate</option>
                      {(users.length > 0 ? users : initialUsers).map(u => (
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70"
                    />
                    <ErrorMessage name="date" component="div" className="text-red-500 text-sm mt-2 font-medium" />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Assign Task
                  </button>
                </Form>
              </Formik>
            </div>
          </div>

          {/* Timesheet Overview */}
          <div className="bg-white/70 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="px-6 py-6 sm:p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Submitted Timesheets</h3>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {(timesheets.length > 0 ? timesheets : initialTimesheets).filter(t => t.submitted).map(timesheet => {
                  const associate = (users.length > 0 ? users : initialUsers).find(u => u.id === timesheet.userId);
                  const task = (tasks.length > 0 ? tasks : initialTasks).find(t => t.id === timesheet.taskId);
                  return (
                    <div key={timesheet.id} className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4 hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-900">{associate?.name}</span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{timesheet.date}</span>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Task:</span> {task?.description}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-600 font-medium">Estimated: {task?.estimatedHours}h</span>
                        <span className="text-green-600 font-medium">Actual: {timesheet.actualHours}h</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* All Tasks */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300">
          <div className="px-6 py-6 sm:p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">All Assigned Tasks</h3>
            </div>
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Est. Hours</th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-100">
                  {(tasks.length > 0 ? tasks : initialTasks).map(task => {
                    const assignee = (users.length > 0 ? users : initialUsers).find(u => u.id == task.assignedTo);
                    return (
                      <tr key={task.id} className="hover:bg-white/70 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{assignee?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">{task.date}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">{task.estimatedHours}h</td>
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