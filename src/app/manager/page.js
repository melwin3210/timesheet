import ManagerDashboard from '../components/ManagerDashboard';

export default async function ManagerPage() {
  const [tasks, timesheets, users] = await Promise.all([
    fetch('http://localhost:3001/tasks').then(res => res.json()),
    fetch('http://localhost:3001/timesheets').then(res => res.json()),
    fetch('http://localhost:3001/users?role=associate').then(res => res.json())
  ]);

  return (
    <ManagerDashboard 
      initialTasks={tasks}
      initialTimesheets={timesheets}
      initialUsers={users}
    />
  );
}