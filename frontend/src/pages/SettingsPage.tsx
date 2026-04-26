import { useState, useEffect } from 'react';
import { Save, Shield, Bell, Globe, Key, Mail, MessageSquare, Loader2 } from 'lucide-react';
import { enterpriseApi } from '../api/enterprise';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    site_name: 'GPU Intelligence',
    maintenance_mode: false,
    slack_notifications: true,
    email_notifications: true,
    rate_limiting_enabled: true,
    max_keys_per_user: 5
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await enterpriseApi.getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await enterpriseApi.updateSettings(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Globe size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'integrations', label: 'Integrations', icon: <Key size={18} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 text-gray-500">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight">System Settings</h1>
          <p className="text-gray-500 mt-1">Manage platform configuration and security policies.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#76b900] hover:bg-[#86d200] text-black px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#76b900]/20 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#76b900]/10 text-[#76b900] border border-[#76b900]/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-[#0d0d0f] border border-[#1e1e22] rounded-2xl p-8">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">General Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Platform Name</label>
                  <input 
                    type="text" 
                    value={settings.site_name}
                    onChange={(e) => setSettings({...settings, site_name: e.target.value})}
                    className="w-full bg-[#161618] border border-[#2a2a2e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#76b900]/50 transition-all"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <div className="font-medium">Maintenance Mode</div>
                    <div className="text-xs text-gray-500">Put the platform in read-only mode for maintenance.</div>
                  </div>
                  <Toggle 
                    enabled={settings.maintenance_mode} 
                    onChange={(val) => setSettings({...settings, maintenance_mode: val})} 
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">Security Policies</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <div className="font-medium">Global Rate Limiting</div>
                    <div className="text-xs text-gray-500">Apply request throttling to all API endpoints.</div>
                  </div>
                  <Toggle 
                    enabled={settings.rate_limiting_enabled} 
                    onChange={(val) => setSettings({...settings, rate_limiting_enabled: val})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Max API Keys Per User</label>
                  <input 
                    type="number" 
                    value={settings.max_keys_per_user}
                    onChange={(e) => setSettings({...settings, max_keys_per_user: parseInt(e.target.value)})}
                    className="w-full bg-[#161618] border border-[#2a2a2e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#76b900]/50 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">Notification Channels</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="text-purple-500" />
                    <div>
                      <div className="font-medium">Slack Notifications</div>
                      <div className="text-xs text-gray-500">Send critical alerts to configured Slack channels.</div>
                    </div>
                  </div>
                  <Toggle 
                    enabled={settings.slack_notifications} 
                    onChange={(val) => setSettings({...settings, slack_notifications: val})} 
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <Mail className="text-blue-500" />
                    <div>
                      <div className="font-medium">Email Alerts</div>
                      <div className="text-xs text-gray-500">Send daily reports and security alerts via email.</div>
                    </div>
                  </div>
                  <Toggle 
                    enabled={settings.email_notifications} 
                    onChange={(val) => setSettings({...settings, email_notifications: val})} 
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6 text-center py-12">
              <Key className="mx-auto text-gray-600 mb-4" size={48} />
              <h3 className="text-lg font-medium">SSO & Auth Providers</h3>
              <p className="text-gray-500 max-w-sm mx-auto">Configure Enterprise SSO (SAML/OIDC) and external identity providers.</p>
              <button className="mt-4 px-6 py-2 border border-[#1e1e22] rounded-xl text-sm font-medium hover:bg-white/5 transition-all">
                Request SSO Setup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ enabled, onChange }: { enabled: boolean, onChange: (val: boolean) => void }) => (
  <button 
    onClick={() => onChange(!enabled)}
    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
      enabled ? 'bg-[#76b900]' : 'bg-[#2a2a2e]'
    }`}
  >
    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
      enabled ? 'left-7' : 'left-1'
    }`} />
  </button>
);

export default SettingsPage;
