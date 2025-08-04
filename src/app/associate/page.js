import AssociateDashboard from '../components/AssociateDashboard';

export default async function AssociatePage({ searchParams }) {
  const userId = searchParams.userId;
  const [tasks, timesheets] = await Promise.all([
    fetch(`http://localhost:3001/tasks?assignedTo=${userId}`).then(res => res.json()),
    fetch(`http://localhost:3001/timesheets?userId=${userId}`).then(res => res.json())
  ]);

  return (
    <AssociateDashboard 
      initialTasks={tasks}
      initialTimesheets={timesheets}
    />
  );
}