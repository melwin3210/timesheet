'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const validate = (values) => {
  const errors = {};
  if (!values.description) errors.description = 'Required';
  if (!values.estimatedHours || values.estimatedHours < 0.5) errors.estimatedHours = 'Must be at least 0.5 hours';
  if (!values.assignedTo) errors.assignedTo = 'Required';
  if (!values.date) errors.date = 'Required';
  return errors;
};

export default function ManagerDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.push('/manager/assign-task');
  }, [router]);

  return null;
}