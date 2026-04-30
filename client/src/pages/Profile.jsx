import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getProfile, updateProfile, reset } from '../store/userSlice';
import { ArrowLeft, Save, User as UserIcon, Mail } from 'lucide-react';

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading, isError, isSuccess, message } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(getProfile());
    }
  }, [user, navigate, dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        email: profile.email || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (isSuccess) {
      // Show success message if needed
    }
    dispatch(reset());
  }, [isSuccess, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
  };

  return (
    <div className="profile-container glass-card">
      <Link to="/dashboard" className="logout-btn" style={{ width: 'fit-content', marginBottom: '2rem', textDecoration: 'none' }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div className="profile-header">
        <div className="profile-avatar">
          {formData.username.charAt(0).toUpperCase()}
        </div>
        <h2>User Profile</h2>
        <p className="auth-subtitle">Manage your account information</p>
      </div>

      {isError && <div className="error-msg">{message}</div>}
      {isSuccess && <div className="error-msg" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>Profile updated successfully!</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <div style={{ position: 'relative' }}>
            <UserIcon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={onChange}
              style={{ paddingLeft: '40px' }}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              style={{ paddingLeft: '40px' }}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn" disabled={isLoading}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Save size={20} /> {isLoading ? 'Updating...' : 'Save Changes'}
          </span>
        </button>
      </form>
    </div>
  );
}

export default Profile;
