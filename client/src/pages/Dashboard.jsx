import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset as authReset } from '../store/authSlice';
import { getTasks, createTask, deleteTask, updateTask, reset as taskReset } from '../store/taskSlice';
import { LogOut, Plus, Trash2, CheckCircle, Clock, Calendar, CheckSquare, ClipboardList } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading, isError, message } = useSelector((state) => state.task);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    deadline: '',
  });

  const { title, description, category, deadline } = formData;

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate('/login');
    } else {
      dispatch(getTasks());
    }

    return () => {
      dispatch(taskReset());
    };
  }, [user, navigate, isError, message, dispatch]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(authReset());
    navigate('/login');
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createTask({ title, description, category, deadline }));
    setFormData({ title: '', description: '', category: 'General', deadline: '' });
  };

  const toggleStatus = (task) => {
    let newStatus = 'Pending';
    if (task.status === 'Pending') newStatus = 'In Progress';
    else if (task.status === 'In Progress') newStatus = 'Completed';
    else newStatus = 'Pending';

    dispatch(updateTask({ id: task._id, taskData: { status: newStatus } }));
  };

  return (
    <>
      <nav className="dashboard-navbar">
        <div className="nav-brand">TaskMaster</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Welcome, <strong style={{ color: 'var(--text-main)' }}>{user?.username}</strong>
          </span>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <section className="task-form-container glass-card">
          <h3>Create New Task</h3>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="title">Task Title</label>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={onChange}
                placeholder="What needs to be done?"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                value={description}
                onChange={onChange}
                placeholder="Add some details..."
                rows="3"
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select name="category" id="category" value={category} onChange={onChange}>
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="deadline">Deadline</label>
              <input
                type="date"
                name="deadline"
                id="deadline"
                value={deadline}
                onChange={onChange}
              />
            </div>
            <button className="btn" type="submit">
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Plus size={20} /> Add Task
              </span>
            </button>
          </form>
        </section>

        <section className="tasks-container">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task._id} className="task-card glass-card">
                <div className="task-header">
                  <div>
                    <h4 className="task-title" style={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none', color: task.status === 'Completed' ? 'var(--text-muted)' : 'var(--text-main)' }}>
                      {task.title}
                    </h4>
                    <span className="task-category">{task.category}</span>
                  </div>
                  <span className={`status-badge status-${task.status.replace(' ', '')}`}>
                    {task.status}
                  </span>
                </div>
                
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}

                <div className="task-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <Calendar size={14} />
                    {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                  </div>
                  <div className="task-actions">
                    <button 
                      className="action-btn status-toggle" 
                      onClick={() => toggleStatus(task)}
                      title="Update Status"
                    >
                      {task.status === 'Completed' ? <CheckCircle size={18} /> : 
                       task.status === 'In Progress' ? <Clock size={18} /> : <CheckSquare size={18} />}
                    </button>
                    <button 
                      className="action-btn delete" 
                      onClick={() => dispatch(deleteTask(task._id))}
                      title="Delete Task"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card empty-state">
              <ClipboardList size={48} className="empty-state-icon" />
              <h3>No tasks found</h3>
              <p>You have no tasks right now. Create one to get started!</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default Dashboard;
