import AppHeader from './AppHeader';

const managerNavItems = [
  { href: '/manager/assign-task', label: 'Assign Task' },
  { href: '/manager/timesheets', label: 'Timesheets' },
  { href: '/manager/tasks', label: 'All Tasks' }
];

export default function ManagerHeader() {
  return <AppHeader navItems={managerNavItems} />;
}