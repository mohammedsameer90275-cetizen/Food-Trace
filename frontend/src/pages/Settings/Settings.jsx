import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useRequireAuth } from "../../utils/auth";
import { api } from "../../utils/api";
import styles from "./Settings.module.css";

const defaultSettings = {
  notify: false,
  autoRefresh: false,
};

export default function Settings() {
  useRequireAuth();

  const [settings, setSettings] = useState(defaultSettings);
  const [lastSaved, setLastSaved] = useState("Never");

  useEffect(() => {
    api
      .get("/settings/me")
      .then((data) => {
        setSettings({
          notify: !!data.notify,
          autoRefresh: !!data.autoRefresh,
        });
        if (data.updated_at) {
          setLastSaved(new Date(data.updated_at).toLocaleString());
        }
      })
      .catch(() => setSettings(defaultSettings));
  }, []);

  const toggle = (field) => (e) => {
    setSettings({
      ...settings,
      [field]: e.target.checked,
    });
  };

  const saveSettings = async () => {
    try {
      const updated = await api.put("/settings/me", settings);

      setLastSaved(
        updated.updated_at
          ? new Date(updated.updated_at).toLocaleString()
          : new Date().toLocaleString()
      );

      alert("Settings Saved Successfully");
    } catch (err) {
      alert(err.message || "Failed to save settings");
    }
  };

  const resetSettings = async () => {
    if (window.confirm("Reset all settings?")) {
      try {
        await api.put("/settings/me", defaultSettings);
        setSettings(defaultSettings);
        alert("Settings Reset Successfully");
      } catch (err) {
        alert(err.message || "Failed to reset settings");
      }
    }
  };

  return (
    <Layout>
      <div className={styles.page}>

        <h1>System Settings</h1>

        <div className={styles.box}>

          <label>
            <input
              type="checkbox"
              checked={settings.notify}
              onChange={toggle("notify")}
            />
            Enable Notifications
          </label>

          <label>
            <input
              type="checkbox"
              checked={settings.autoRefresh}
              onChange={toggle("autoRefresh")}
            />
            Auto Refresh Dashboard
          </label>

          <button onClick={saveSettings}>
            Save Settings
          </button>

          <button
            className={styles.reset}
            onClick={resetSettings}
          >
            Reset Settings
          </button>

        </div>

        <div className={styles.infoBox}>

          <h2>System Information</h2>

          <p>
            <strong>Application :</strong> FoodTrace
          </p>

          <p>
            <strong>Version :</strong> 1.0
          </p>

          <p>
            <strong>Developer :</strong> Sameer
          </p>

          <p>
            <strong>Database :</strong> SQLite (via API)
          </p>

          <p>
            <strong>Last Saved :</strong> {lastSaved}
          </p>

        </div>

      </div>
    </Layout>
  );
}
