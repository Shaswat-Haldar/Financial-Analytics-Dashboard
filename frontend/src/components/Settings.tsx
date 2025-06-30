import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Switch,
  TextField,
  Button,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Notifications,
  Security,
  Palette,
  AccountCircle,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      weeklyReport: true,
      monthlyReport: true,
      transactionAlerts: true,
    },
    security: {
      twoFactorAuth: false,
      biometricLogin: true,
      sessionTimeout: 30,
    },
    preferences: {
      theme: 'dark',
      language: 'en',
      currency: 'USD',
      timezone: 'UTC',
    },
    profile: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '',
      location: '',
      bio: '',
    },
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSettings(prev => ({
      ...prev,
      profile: {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '',
        location: '',
        bio: '',
      },
    }));
  };

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Settings ⚙️
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Customize your experience and manage your account preferences.
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', border: '1px solid #334155' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 48, height: 48, background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' }}>
                    <AccountCircle />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Profile Settings
                  </Typography>
                </Box>
                <IconButton onClick={() => setIsEditing(!isEditing)} sx={{ color: 'text.secondary' }}>
                  {isEditing ? <CancelIcon /> : <EditIcon />}
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="First Name" value={settings.profile.firstName} onChange={(e) => handleSettingChange('profile', 'firstName', e.target.value)} disabled={!isEditing} sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Last Name" value={settings.profile.lastName} onChange={(e) => handleSettingChange('profile', 'lastName', e.target.value)} disabled={!isEditing} sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Email" value={settings.profile.email} onChange={(e) => handleSettingChange('profile', 'email', e.target.value)} disabled={!isEditing} sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Phone" value={settings.profile.phone} onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)} disabled={!isEditing} sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Location" value={settings.profile.location} onChange={(e) => handleSettingChange('profile', 'location', e.target.value)} disabled={!isEditing} sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Bio" multiline rows={3} value={settings.profile.bio} onChange={(e) => handleSettingChange('profile', 'bio', e.target.value)} disabled={!isEditing} sx={{ mb: 2 }} />
                </Grid>
              </Grid>
              {isEditing && (
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveProfile} sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', '&:hover': { background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' } }}>Save Changes</Button>
                  <Button variant="outlined" onClick={handleCancelEdit} sx={{ borderColor: '#334155', color: 'text.primary' }}>Cancel</Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', border: '1px solid #334155' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 48, height: 48, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                  <Palette />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Preferences</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Theme</InputLabel>
                    <Select value={settings.preferences.theme} label="Theme" onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}>
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="auto">Auto</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Language</InputLabel>
                    <Select value={settings.preferences.language} label="Language" onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}>
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Currency</InputLabel>
                    <Select value={settings.preferences.currency} label="Currency" onChange={(e) => handleSettingChange('preferences', 'currency', e.target.value)}>
                      <MenuItem value="USD">USD ($)</MenuItem>
                      <MenuItem value="EUR">EUR (€)</MenuItem>
                      <MenuItem value="GBP">GBP (£)</MenuItem>
                      <MenuItem value="JPY">JPY (¥)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Timezone</InputLabel>
                    <Select value={settings.preferences.timezone} label="Timezone" onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}>
                      <MenuItem value="UTC">UTC</MenuItem>
                      <MenuItem value="EST">EST</MenuItem>
                      <MenuItem value="PST">PST</MenuItem>
                      <MenuItem value="GMT">GMT</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', border: '1px solid #334155' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 48, height: 48, background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
                  <Notifications />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Notifications</Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemText primary="Email Notifications" secondary="Receive notifications via email" />
                  <ListItemSecondaryAction>
                    <Switch checked={settings.notifications.email} onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Push Notifications" secondary="Receive push notifications" />
                  <ListItemSecondaryAction>
                    <Switch checked={settings.notifications.push} onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText primary="SMS Notifications" secondary="Receive notifications via SMS" />
                  <ListItemSecondaryAction>
                    <Switch checked={settings.notifications.sms} onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Weekly Reports" secondary="Get weekly financial summaries" />
                  <ListItemSecondaryAction>
                    <Switch checked={settings.notifications.weeklyReport} onChange={(e) => handleSettingChange('notifications', 'weeklyReport', e.target.checked)} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Transaction Alerts" secondary="Get notified of large transactions" />
                  <ListItemSecondaryAction>
                    <Switch checked={settings.notifications.transactionAlerts} onChange={(e) => handleSettingChange('notifications', 'transactionAlerts', e.target.checked)} />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', border: '1px solid #334155' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 48, height: 48, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                  <Security />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Security</Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemText primary="Two-Factor Authentication" secondary="Add an extra layer of security" />
                  <ListItemSecondaryAction>
                    <Switch checked={settings.security.twoFactorAuth} onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Biometric Login" secondary="Use fingerprint or face ID" />
                  <ListItemSecondaryAction>
                    <Switch checked={settings.security.biometricLogin} onChange={(e) => handleSettingChange('security', 'biometricLogin', e.target.checked)} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Session Timeout" secondary={`${settings.security.sessionTimeout} minutes`} />
                  <ListItemSecondaryAction>
                    <Select value={settings.security.sessionTimeout} onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)} size="small" sx={{ minWidth: 80 }}>
                      <MenuItem value={15}>15 min</MenuItem>
                      <MenuItem value={30}>30 min</MenuItem>
                      <MenuItem value={60}>1 hour</MenuItem>
                      <MenuItem value={120}>2 hours</MenuItem>
                    </Select>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              <Box sx={{ mt: 3 }}>
                <Button variant="outlined" fullWidth sx={{ borderColor: '#ef4444', color: '#ef4444', mb: 2 }}>Change Password</Button>
                <Button variant="outlined" fullWidth sx={{ borderColor: '#ef4444', color: '#ef4444' }}>Delete Account</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings; 