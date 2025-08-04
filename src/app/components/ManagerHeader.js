'use client';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import Link from 'next/link';

export default function ManagerHeader() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Manager Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center space-x-6">
            <nav className="flex space-x-6">
              <Link href="/manager/assign-task" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Assign Task
              </Link>
              <Link href="/manager/timesheets" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Timesheets
              </Link>
              <Link href="/manager/tasks" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                All Tasks
              </Link>
            </nav>
            <button
              onClick={() => dispatch(logout())}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}