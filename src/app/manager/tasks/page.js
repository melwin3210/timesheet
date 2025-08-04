'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, initializeTasks } from '../../store/taskSlice';
import { fetchUsers, initializeUsers } from '../../store/userSlice';
import ManagerHeader from '../../components/ManagerHeader';

export default function TasksPage() {
  const dispatch = useDispatch();
  const { items: tasks } = useSelector(state => state.tasks);
  const { items: users } = useSelector(state => state.users);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTask, setSearchTask] = useState('');

  useEffect(() => {
    if (!tasks.length) dispatch(fetchTasks());
    if (!users.length) dispatch(fetchUsers('associate'));
  }, [dispatch, tasks.length, users.length]);

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
      <ManagerHeader />
      <main className="max-w-7xl mx-auto pt-24 pb-8 px-6">
        <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
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