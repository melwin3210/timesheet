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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Associate Dashboard</h1>
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
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">My Tasks</h3>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {tasksForDate.length === 0 ? (
              <p className="text-gray-500">No tasks assigned for this date.</p>
            ) : (
              <div className="space-y-4">
                {tasksForDate.map(task => {
                  const timesheet = timesheets.find(t => t.taskId === task.id && t.date === selectedDate);
                  return (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{task.description}</h4>
                        <span className="text-sm text-gray-500">Est: {task.estimatedHours}h</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium text-gray-700">Actual Hours:</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={timesheet?.actualHours || ''}
                          onChange={(e) => handleHoursChange(task.id, e.target.value)}
                          disabled={timesheet?.submitted}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                        />
                        {timesheet?.submitted && (
                          <span className="text-sm text-green-600 font-medium">Submitted</span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {!isSubmitted && tasksForDate.length > 0 && (
                  <button
                    onClick={handleSubmitTimesheet}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                  >
                    Submit Timesheet for {selectedDate}
                  </button>
                )}

                {isSubmitted && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 text-sm">Timesheet for {selectedDate} has been submitted and is now read-only.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Previous Timesheets */}
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Previous Timesheets</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {timesheets
                .filter(t => t.submitted)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(timesheet => {
                  const task = tasks.find(t => t.id === timesheet.taskId);
                  return (
                    <div key={timesheet.id} className="border rounded p-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{task?.description}</span>
                        <span className="text-sm text-gray-500">{timesheet.date}</span>
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
    </div>
  );
}