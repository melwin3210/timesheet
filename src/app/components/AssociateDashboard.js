'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../store/taskSlice';
import { fetchTimesheets, updateTimesheet, submitTimesheet } from '../store/timesheetSlice';
import { logout } from '../store/authSlice';

export default function AssociateDashboard({ initialTasks = [], initialTimesheets = [] }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { items: allTasks } = useSelector(state => state.tasks);
  const { items: allTimesheets } = useSelector(state => state.timesheets);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const tasks = allTasks.length > 0 ? allTasks.filter(t => t.assignedTo == user?.id) : initialTasks;
  const timesheets = allTimesheets.length > 0 ? allTimesheets.filter(t => t.userId === user?.id) : initialTimesheets;

  useEffect(() => {
    if (user && initialTasks.length === 0) dispatch(fetchTasks(user.id));
    if (user && initialTimesheets.length === 0) dispatch(fetchTimesheets(user.id));
  }, [dispatch, user, initialTasks.length, initialTimesheets.length]);

  const handleHoursChange = (taskId, hours) => {
    dispatch(updateTimesheet({
      userId: user.id,
      taskId,
      date: selectedDate,
      actualHours: parseFloat(hours) || 0
    }));
  };

  const handleSubmitTimesheet = () => {
    dispatch(submitTimesheet({ userId: user.id, date: selectedDate }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const tasksForDate = tasks.filter(t => t.date === selectedDate);
  const isSubmitted = timesheets.some(t => t.date === selectedDate && t.submitted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Associate Dashboard</h1>
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
        <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300">
          <div className="px-6 py-6 sm:p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">My Tasks</h3>
              </div>
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <label className="text-sm font-semibold text-gray-700">Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/90 font-medium"
                />
              </div>
            </div>

            {tasksForDate.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No tasks assigned for this date.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {tasksForDate.map(task => {
                  const timesheet = timesheets.find(t => t.taskId === task.id && t.date === selectedDate);
                  return (
                    <div key={task.id} className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-6 hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-gray-900 text-lg">{task.description}</h4>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-semibold">Est: {task.estimatedHours}h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <label className="text-sm font-semibold text-gray-700">Actual Hours:</label>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={timesheet?.actualHours || ''}
                            onChange={(e) => handleHoursChange(task.id, e.target.value)}
                            disabled={timesheet?.submitted}
                            className="w-28 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70 font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="0.0"
                          />
                        </div>
                        {timesheet?.submitted && (
                          <div className="flex items-center bg-green-50 px-4 py-2 rounded-xl">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-green-700 font-semibold">Submitted</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="pt-6 border-t border-gray-200">
                  {!isSubmitted && tasksForDate.length > 0 && (
                    <button
                      onClick={handleSubmitTimesheet}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      Submit Timesheet for {selectedDate}
                    </button>
                  )}

                  {isSubmitted && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-green-800 font-medium">Timesheet for {selectedDate} has been submitted and is now read-only.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Previous Timesheets */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300">
          <div className="px-6 py-6 sm:p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Previous Timesheets</h3>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {timesheets
                .filter(t => t.submitted)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(timesheet => {
                  const task = tasks.find(t => t.id === timesheet.taskId);
                  return (
                    <div key={timesheet.id} className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4 hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-900">{task?.description}</span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{timesheet.date}</span>
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
    </div>
  );
}