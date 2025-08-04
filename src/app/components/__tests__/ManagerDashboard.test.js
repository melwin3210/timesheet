import { render, screen } from '@testing-library/react';
import ManagerDashboard, { validate } from '../ManagerDashboard';

// Mock all Redux hooks
jest.mock('react-redux', () => ({
  useSelector: jest.fn((selector) => {
    const state = {
      auth: { user: { id: 1, name: 'Test User' } },
      tasks: { items: [] },
      timesheets: { items: [] },
      users: { items: [] }
    };
    return selector(state);
  }),
  useDispatch: () => jest.fn()
}));



describe('ManagerDashboard', () => {
  test('renders dashboard title', () => {
    render(<ManagerDashboard />);
    expect(screen.getByText('Manager Dashboard')).toBeInTheDocument();
  });

  test('renders form elements', () => {
    render(<ManagerDashboard />);
    expect(screen.getByText('Assign New Task')).toBeInTheDocument();
    expect(screen.getByText('Assign Task')).toBeInTheDocument();
  });

  test('validate function returns errors for empty fields', () => {
    const errors = validate({ description: '', estimatedHours: '', assignedTo: '', date: '' });
    expect(errors.description).toBe('Required');
    expect(errors.assignedTo).toBe('Required');
    expect(errors.date).toBe('Required');
  });

  test('validate function returns no errors for valid input', () => {
    const errors = validate({ 
      description: 'Test', 
      estimatedHours: '2', 
      assignedTo: '1', 
      date: '2024-01-01' 
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  test('validate function checks minimum hours', () => {
    const errors = validate({ 
      description: 'Test', 
      estimatedHours: '0.2', 
      assignedTo: '1', 
      date: '2024-01-01' 
    });
    expect(errors.estimatedHours).toBe('Must be at least 0.5 hours');
  });
});