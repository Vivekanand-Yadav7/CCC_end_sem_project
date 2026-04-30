import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset as authReset } from '../store/authSlice';
import { getTasks, createTask, deleteTask, updateTask, getTaskStats, reset as taskReset } from '../store/taskSlice';
import { LogOut, Plus, Trash2, CheckCircle, Clock, Calendar, CheckSquare, ClipboardList, Search, Filter, User, AlertCircle } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { tasks, stats, isLoading, isError, message } = useSelector((state) => state.task);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    deadline: '',
  });

  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
  });

  const { title, description, category, deadline } = formData;

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate('/login');
    } else {
      dispatch(getTasks(filters));
      dispatch(getTaskStats());
    }
  }, [user, navigate, isError, message, dispatch, filters]);

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

  const onFilterChange = (e) => {
    setFilters((prevState) => ({
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
    dispatch(getTaskStats());
  };

  const isOverdue = (deadline, status) => {
    if (!deadline || status === 'Completed') return false;
    return new Date(deadline) < new Date().setHours(0,0,0,0);
  };

  return (
    <>
      <nav className="dashboard-navbar">
        <div className="nav-brand">TaskMaster</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} /> Welcome, <strong style={{ color: 'var(--text-main)' }}>{user?.username}</strong>
            </span>
          </Link>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content" style={{ display: 'block', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card glass-card">
            <h4>Total</h4>
            <div className="stat-value">{stats?.total || 0}</div>
          </div>
          <div className="stat-card glass-card">
            <h4>Pending</h4>
            <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats?.pending || 0}</div>
          </div>
          <div className="stat-card glass-card">
            <h4>In Progress</h4>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>{stats?.inProgress || 0}</div>
          </div>
          <div className="stat-card glass-card">
            <h4>Completed</h4>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{stats?.completed || 0}</div>
          </div>
          <div className="stat-card glass-card">
            <h4>Overdue</h4>
            <div className="stat-value" style={{ color: 'var(--danger)' }}>{stats?.overdue || 0}</div>
          </div>
        </div>

        <div className="main-layout" style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }}>
          <aside>
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
          </aside>

          <main>
            {/* Filters Bar */}
            <div className="filters-bar glass-card" style={{ padding: '1rem' }}>
              <div className="search-input" style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  name="search"
                  placeholder="Search tasks..." 
                  value={filters.search}
                  onChange={onFilterChange}
                  style={{ paddingLeft: '40px', marginBottom: 0 }}
                />
              </div>
              <div className="filter-select">
                <select name="status" value={filters.status} onChange={onFilterChange}>
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="filter-select">
                <select name="category" value={filters.category} onChange={onFilterChange}>
                  <option value="">All Categories</option>
                  <option value="General">General</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <section className="tasks-container">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div key={task._id} className={`task-card glass-card ${isOverdue(task.deadline, task.status) ? 'overdue' : ''}`}>
                    <div className="task-header">
                      <div>
                        <h4 className="task-title" style={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none', color: task.status === 'Completed' ? 'var(--text-muted)' : 'var(--text-main)' }}>
                          {task.title}
                          {isOverdue(task.deadline, task.status) && (
                            <span className="overdue-badge"><AlertCircle size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> OVERDUE</span>
                          )}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isOverdue(task.deadline, task.status) ? 'var(--danger)' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: isOverdue(task.deadline, task.status) ? '600' : '400' }}>
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
                          onClick={() => {
                            dispatch(deleteTask(task._id));
                            dispatch(getTaskStats());
                          }}
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
                  <p>Try adjusting your filters or create a new task!</p>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
