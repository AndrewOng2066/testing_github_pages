import React, { useMemo, useState } from "react";

const OPTIONS = ["Linux", "DC", "ascott", "SQL"];

export default function App() {
  const [selected, setSelected] = useState("Linux");

  // Linux: array of pairs { hostname, ip }
  const [linuxRows, setLinuxRows] = useState([{ hostname: "", ip: "" }]);

  // Others: map option -> array of ip strings
  const [ipRowsByOption, setIpRowsByOption] = useState({
    DC: [""],
    ascott: [""],
    SQL: [""],
  });

  const isLinux = selected === "Linux";

  const otherOptions = useMemo(() => OPTIONS.filter((o) => o !== "Linux"), []);

  const addLinuxRow = () =>
    setLinuxRows((prev) => [...prev, { hostname: "", ip: "" }]);

  const updateLinuxRow = (index, key, value) => {
    setLinuxRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
  };

  const deleteLinuxRow = (index) => {
    setLinuxRows((prev) => prev.filter((_, i) => i !== index));
  };

  const addIpRow = (option) => {
    setIpRowsByOption((prev) => ({
      ...prev,
      [option]: [...prev[option], ""],
    }));
  };

  const updateIpRow = (option, index, value) => {
    setIpRowsByOption((prev) => ({
      ...prev,
      [option]: prev[option].map((ip, i) => (i === index ? value : ip)),
    }));
  };

  const deleteIpRow = (option, index) => {
    setIpRowsByOption((prev) => ({
      ...prev,
      [option]: prev[option].filter((_, i) => i !== index),
    }));
  };

  const showAlert = () => {
    if (!getIsCurrentSelectionValid()) {
      alert("Please fill in all fields before showing the values.");
      return;
    }

    let message = `Selected system: ${selected}\n\n`;

    if (selected === "Linux") {
      linuxRows.forEach((row, index) => {
        message += `Entry ${index + 1}:\n`;
        message += `  Hostname: ${row.hostname}\n`;
        message += `  IP: ${row.ip}\n\n`;
      });
    } else {
      const ips = ipRowsByOption[selected] || [];
      ips.forEach((ip, index) => {
        message += `IP ${index + 1}: ${ip}\n`;
      });
    }

    alert(message);
  };


  const isLinuxRowFilled = (row) =>
    row.hostname.trim() !== "" && row.ip.trim() !== "";

  const isIpFilled = (ip) => ip.trim() !== "";

  const getIsCurrentSelectionValid = () => {
    if (selected === "Linux") {
      return linuxRows.length > 0 && linuxRows.every(isLinuxRowFilled);
    }
    const ips = ipRowsByOption[selected] ?? [];
    return ips.length > 0 && ips.every(isIpFilled);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Qualys Inputs</h2>

        {/* Radio group */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Select System</legend>
          <div style={styles.radioRow}>
            {OPTIONS.map((opt) => (
              <label key={opt} style={styles.radioLabel}>
                <input
                  type="radio"
                  name="system"
                  value={opt}
                  checked={selected === opt}
                  onChange={() => setSelected(opt)}
                />
                <span style={{ marginLeft: 8 }}>{opt}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Conditional inputs */}
        {isLinux ? (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Linux</h3>

            {linuxRows.map((row, idx) => (
              <div key={idx} style={styles.pairRow}>
                <div style={styles.field}>
                  <label style={styles.label}>Hostname</label>
                  <input
                    style={styles.input}
                    type="text"
                    value={row.hostname}
                    onChange={(e) =>
                      updateLinuxRow(idx, "hostname", e.target.value)
                    }
                    placeholder="e.g. server-01"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>IP address</label>
                  <input
                    style={styles.input}
                    type="text"
                    value={row.ip}
                    onChange={(e) => updateLinuxRow(idx, "ip", e.target.value)}
                    placeholder="e.g. 10.0.0.12"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => deleteLinuxRow(idx)}
                  style={styles.deleteButton}
                  aria-label={`Delete Linux entry ${idx + 1}`}
                  title="Delete"
                  disabled={linuxRows.length === 1} // optional: prevent deleting the last row
                >
                  🗑
                </button>

              </div>
            ))}

            {/* plus icon BELOW the pairs */}
            <button
              type="button"
              onClick={addLinuxRow}
              style={styles.addButton}
              aria-label="Add another Hostname/IP pair"
              title="Add another Hostname/IP pair"
            >
              ＋
            </button>
          </div>
        ) : (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>{selected}</h3>

            {/* For DC / ascott / SQL:
                plus icon BEFORE the text field, and adds more fields */}
            {(ipRowsByOption[selected] ?? [""]).map((ip, idx) => (
              <div key={idx} style={styles.singleRow}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>IP address</label>
                  <input
                    style={styles.input}
                    type="text"
                    value={ip}
                    onChange={(e) => updateIpRow(selected, idx, e.target.value)}
                    placeholder="e.g. 10.0.0.12"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => deleteIpRow(selected, idx)}
                  style={styles.deleteButton}
                  aria-label={`Delete IP ${idx + 1} for ${selected}`}
                  title="Delete"
                  disabled={(ipRowsByOption[selected]?.length ?? 1) === 1} // optional: prevent deleting last row
                >
                  🗑
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addIpRow(selected)}
              style={styles.addButton}
              aria-label={`Add another IP address for ${selected}`}
              title="Add another IP address"
            >
              ＋
            </button>

          </div>
        )}

        <button
          type="button"
          onClick={showAlert}
          disabled={!getIsCurrentSelectionValid()}
          style={{
            ...styles.submitButton,
            opacity: getIsCurrentSelectionValid() ? 1 : 0.5,
            cursor: getIsCurrentSelectionValid ? "pointer" : "not-allowed",
          }}
          title={`Submit for ${selected}`}
        >
          Submit {selected}
        </button>

        {/* Optional: quick debug output */}
        <details style={{ marginTop: 16 }}>
          <summary>Debug values</summary>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(
              { selected, linuxRows, ipRowsByOption },
              null,
              2
            )}
          </pre>
        </details>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 24,
    display: "flex",
    justifyContent: "center",
    background: "#f6f7fb",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  card: {
    width: "min(900px, 100%)",
    background: "white",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  fieldset: {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  legend: { padding: "0 6px" },
  radioRow: { display: "flex", gap: 16, flexWrap: "wrap" },
  radioLabel: { display: "flex", alignItems: "center", cursor: "pointer" },

  section: { marginTop: 12 },
  sectionTitle: { margin: "8px 0 12px" },

  pairRow: { display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" },
  field: { flex: "1 1 280px" },
  label: { display: "block", fontSize: 13, marginBottom: 6, color: "#333" },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ccc",
    outline: "none",
  },

  addButton: {
    marginTop: 6,
    width: 44,
    height: 44,
    borderRadius: 999,
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
    fontSize: 22,
    lineHeight: "22px",
  },

  submitButton: {
    marginTop: 6,
    width: 44,
    height: 44,
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
    fontSize: 22,
    lineHeight: "22px",
  },

  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
    fontSize: 18,
    alignSelf: "flex-end",
  },

  singleRow: {
    display: "flex",
    gap: 10,
    alignItems: "flex-end",
    marginBottom: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
    fontSize: 20,
  },
};
