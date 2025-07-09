import React, { useState } from 'react';
import { Search, Eye, EyeOff, Camera, X, Check, AlertTriangle, Sun, Moon } from 'lucide-react';
import Sidebar from '../components/navigation/Sidebar';
import ProfileDropdown from '../components/ProfileDropdown';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import '../styles/settings.css';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { isLightMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  
  // Personal information state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: (user as any)?.firstName || '',
    lastName: (user as any)?.lastName || '',
    email: user?.email || ''
  });
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    showCurrentPassword: false,
    showNewPassword: false
  });
  
  // UI state
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isPersonalInfoChanged, setIsPersonalInfoChanged] = useState(false);

  // Password strength calculation
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (password.length === 0) return { score: 0, label: '', color: '#e5e7eb' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    // Minimum score of 1 for any non-empty password
    score = Math.max(score, 1);
    
    const strengths = [
      { score: 1, label: 'Weak', color: '#dc2626' },
      { score: 2, label: 'Average', color: '#f59e0b' },
      { score: 3, label: 'Average', color: '#f59e0b' },
      { score: 4, label: 'Strong', color: '#10b981' },
      { score: 5, label: 'Really Strong', color: '#059669' }
    ];
    
    return strengths[score - 1] || strengths[0];
  };

  const passwordStrength = calculatePasswordStrength(passwordData.newPassword);

  // Handle profile picture upload
  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile picture
  const removeProfilePicture = () => {
    setProfilePicture(null);
  };

  // Handle personal info changes
  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
    setIsPersonalInfoChanged(true);
  };

  // Save personal information
  const savePersonalInfo = () => {
    // TODO: Implement API call to save personal information
    console.log('Saving personal info:', personalInfo);
    setIsPersonalInfoChanged(false);
    // Show success message
  };

  // Handle password change
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: 'current' | 'new') => {
    if (field === 'current') {
      setPasswordData(prev => ({ ...prev, showCurrentPassword: !prev.showCurrentPassword }));
    } else {
      setPasswordData(prev => ({ ...prev, showNewPassword: !prev.showNewPassword }));
    }
  };

  // Update security settings
  const updateSecuritySettings = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) return;
    setShowPasswordConfirmation(true);
  };

  // Confirm password change
  const confirmPasswordChange = () => {
    // TODO: Implement API call to change password
    console.log('Changing password');
    setShowPasswordConfirmation(false);
    logout();
    navigate('/');
  };

  // Cancel password change
  const cancelPasswordChange = () => {
    setShowPasswordConfirmation(false);
  };

  // Theme selection handlers
  const selectLightMode = () => {
    if (!isLightMode) {
      toggleTheme();
    }
  };

  const selectDarkMode = () => {
    if (isLightMode) {
      toggleTheme();
    }
  };

  // Handle keyboard navigation for theme toggles
  const handleThemeKeyDown = (event: React.KeyboardEvent, handler: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handler();
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        {/* Search + Icons Row */}
        <div className="flex items-center gap-4 mb-6">
          <div className="search-container flex-1">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
            />
          </div>
          <ProfileDropdown />
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="welcome-text">Settings</h1>
          <p className="welcome-description">Customize your experience and preferences.</p>
        </div>

        {/* Settings Content */}
        <div className="settings-container">
          {/* Profile Picture Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Profile Picture</h2>
            </div>
            <div className="settings-section">
              <div className="profile-picture-container">
                <div className="profile-picture-wrapper">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="profile-picture" />
                  ) : (
                    <div className="profile-picture-placeholder">
                      <Camera size={32} className="profile-picture-icon" />
                    </div>
                  )}
                  {profilePicture && (
                    <button 
                      className="remove-picture-btn"
                      onClick={removeProfilePicture}
                      aria-label="Remove profile picture"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="profile-picture-actions">
                  <label className="upload-btn">
                    <Camera size={16} />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="file-input"
                    />
                  </label>
                  {profilePicture && (
                    <button className="remove-btn" onClick={removeProfilePicture}>
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Theme Preferences Section */}
          <div className="settings-card theme-preferences-section">
            <h3 className="settings-title">Theme Preferences</h3>
            <p className="settings-subtitle">Choose your preferred theme for the best viewing experience</p>
            <div className="settings-form">
              <div className="theme-options-grid">
                <div className="theme-mode-option">
                  <div 
                    className={`theme-mode-toggle light-mode ${isLightMode ? 'active' : ''}`}
                    onClick={selectLightMode}
                    onKeyDown={(e) => handleThemeKeyDown(e, selectLightMode)}
                    role="button"
                    tabIndex={0}
                    aria-label="Select light mode"
                  >
                    <Sun size={24} className="theme-mode-icon" />
                    <span className="theme-mode-label">Light Mode</span>
                  </div>
                </div>
                <div className="theme-mode-option">
                  <div 
                    className={`theme-mode-toggle dark-mode ${!isLightMode ? 'active' : ''}`}
                    onClick={selectDarkMode}
                    onKeyDown={(e) => handleThemeKeyDown(e, selectDarkMode)}
                    role="button"
                    tabIndex={0}
                    aria-label="Select dark mode"
                  >
                    <Moon size={24} className="theme-mode-icon" />
                    <span className="theme-mode-label">Dark Mode</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="settings-card">
            <h3 className="settings-title">Personal Information</h3>
            <div className="settings-form">
              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">First Name</label>
                  <input
                    type="text"
                    className="field-input"
                    value={personalInfo.firstName}
                    onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">Last Name</label>
                  <input
                    type="text"
                    className="field-input"
                    value={personalInfo.lastName}
                    onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div className="form-field">
                <label className="field-label">Email Address</label>
                <input
                  type="email"
                  className="field-input"
                  value={personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
              <button className="action-btn save-btn" onClick={savePersonalInfo}>
                Save Changes
              </button>
            </div>
          </div>

          {/* Security Settings Section */}
          <div className="settings-card">
            <h3 className="settings-title">Security Settings</h3>
            <div className="settings-form">
              <div className="form-field">
                <label className="field-label">Current Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={passwordData.showCurrentPassword ? 'text' : 'password'}
                    className="field-input"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('current')}
                    aria-label="Toggle password visibility"
                  >
                    {passwordData.showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-field">
                <label className="field-label">New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={passwordData.showNewPassword ? 'text' : 'password'}
                    className="field-input"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('new')}
                    aria-label="Toggle password visibility"
                  >
                    {passwordData.showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordData.newPassword && (
                  <div className="password-strength">
                    <div className="password-strength-bar">
                      <div 
                        className="password-strength-fill"
                        style={{ 
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      />
                    </div>
                    <span 
                      className="password-strength-label"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>
              <button 
                className="action-btn update-security-btn full-width-btn" 
                onClick={updateSecuritySettings}
                disabled={!passwordData.currentPassword || !passwordData.newPassword}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>

        {/* Password Change Confirmation Modal */}
        {showPasswordConfirmation && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <AlertTriangle size={24} className="modal-icon" />
                <h3 className="modal-title">Confirm Password Change</h3>
              </div>
              <div className="modal-content">
                <p>You will be logged out and redirected to the landing page after changing your password. Do you want to continue?</p>
              </div>
              <div className="modal-actions">
                <button className="modal-btn modal-btn-cancel" onClick={cancelPasswordChange}>
                  Cancel
                </button>
                <button className="modal-btn modal-btn-confirm" onClick={confirmPasswordChange}>
                  Confirm Change
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SettingsPage; 