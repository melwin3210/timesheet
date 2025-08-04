'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { createTask } from '../../store/taskSlice';
import { fetchUsers, initializeUsers } from '../../store/userSlice';
import ManagerHeader from '../../components/ManagerHeader';
import { validate } from '../../components/ManagerDashboard';

export default function AssignTaskPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { items: users } = useSelector(state => state.users);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!users.length) dispatch(fetchUsers('associate'));
  }, [dispatch, users.length]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <ManagerHeader />
      <main className="max-w-4xl mx-auto pt-24 pb-8 px-6">
        <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
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
      </main>
    </div>
  );
}