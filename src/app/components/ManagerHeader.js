'use client';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ManagerHeader() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Manager Dashboard
              </h1>
              <p className="text-purple-200 text-sm">Welcome back, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <nav className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-2xl p-2">
              <Link href="/manager/assign-task" className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm ${
                pathname === '/manager/assign-task' 
                  ? 'text-white bg-white/30 shadow-lg' 
                  : 'text-white/80 hover:text-white hover:bg-white/20'
              }`}>
                Assign Task
              </Link>
              <Link href="/manager/timesheets" className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm ${
                pathname === '/manager/timesheets' 
                  ? 'text-white bg-white/30 shadow-lg' 
                  : 'text-white/80 hover:text-white hover:bg-white/20'
              }`}>
                Timesheets
              </Link>
              <Link href="/manager/tasks" className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm ${
                pathname === '/manager/tasks' 
                  ? 'text-white bg-white/30 shadow-lg' 
                  : 'text-white/80 hover:text-white hover:bg-white/20'
              }`}>
                All Tasks
              </Link>
            </nav>
            <button
              onClick={() => dispatch(logout())}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}