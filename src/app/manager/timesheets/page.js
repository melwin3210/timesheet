'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTimesheets, initializeTimesheets } from '../../store/timesheetSlice';
import { fetchUsers, initializeUsers } from '../../store/userSlice';
import { fetchTasks, initializeTasks } from '../../store/taskSlice';
import ManagerHeader from '../../components/ManagerHeader';

export default function TimesheetsPage() {
  const dispatch = useDispatch();
  const { items: timesheets } = useSelector(state => state.timesheets);
  const { items: users } = useSelector(state => state.users);
  const { items: tasks } = useSelector(state => state.tasks);
  const [filterAssociate, setFilterAssociate] = useState('');

  useEffect(() => {
    if (!timesheets.length) dispatch(fetchTimesheets());
    if (!users.length) dispatch(fetchUsers('associate'));
    if (!tasks.length) dispatch(fetchTasks());
  }, [dispatch, timesheets.length, users.length, tasks.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <ManagerHeader />
      <main className="max-w-6xl mx-auto pt-24 pb-8 px-6">
        <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
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
      </main>
    </div>
  );
}