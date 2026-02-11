import React, { useState } from "react";

const OPTIONS = ["Linux", "DC", "ascott", "SQL"];

export default function AddIP() {
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
    if (!isFieldsValid()) {
      alert("Please fill in all fields before showing the values.");
      return;
    }

    let message = `Selected system: ${selected}\n\n`;

    if (selected === "Linux") {
      linuxRows.forEach((row, index) => {
        message += `Entry ${index + 1}:\n`;
        message += `  Hostname-IP: ${row.hostname}-${row.ip}\n`;
      });
    } else {
      const ips = ipRowsByOption[selected] || [];
      ips.forEach((ip, index) => {
        message += `IP ${index + 1}: ${ip}\n`;
      });
    }

    alert(message);
  };



  const isIPv4Format = (ip) => {
    const input = ip.trim();

    const parts = input.split(".");
    if (parts.length !== 4) return false;

    for (const i of parts) {
      if (i === "") return false; // cannot be empty
      if (!/^\d+$/.test(i)) return false; // must be digits
      if (i.length > 1 && i.startsWith("0")) return false; // no leading zeros
      const num = Number(i);
      if (num < 0 || num > 255) return false; // must be from 1 to 255
    }

    return true;
  }

  const isLinuxRowFilled = (row) =>
    row.hostname.trim() !== "" && isIPv4Format(row.ip);

  const isIpFilled = (ip) => isIPv4Format(ip);


  const isFieldsValid = () => {
    if (selected === "Linux") {
      return linuxRows.length > 0 && linuxRows.every(isLinuxRowFilled);
    }
    const ips = ipRowsByOption[selected] ?? [];
    return ips.length > 0 && ips.every(isIpFilled);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ marginTop: 0, textAlign: "center" }}>Qualys Inputs</h2>

        {/* Radio group for selecting the system */}
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

        {/* Displaying Linux or non-Linux */}
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
                  {row.ip.trim() !== "" && !isIPv4Format(row.ip) && (
                    <div style={styles.errorText}>Invalid IPv4 address (e.g. 10.0.0.1)</div>
                  )}
                </div>

                <div style={styles.deleteCol}>
                  <span style={styles.labelSpacer}>Spacer</span>
                  <button
                    type="button"
                    onClick={() => deleteLinuxRow(idx)}
                    style={styles.deleteButton}
                    aria-label={`Delete Linux entry ${idx + 1}`}
                    title="Delete"
                    disabled={linuxRows.length === 1} // prevent deleting the only row
                  >
                    🗑
                  </button>
                </div>

              </div>
            ))}

            {/* Add new Hostname/IP pair */}
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

            {/* For non-linux:*/}
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
                  {ip.trim() !== "" && !isIPv4Format(ip) && (
                    <div style={styles.errorText}>Invalid IPv4 address (e.g. 10.0.0.1)</div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => deleteIpRow(selected, idx)}
                  style={styles.deleteButton}
                  aria-label={`Delete IP ${idx + 1} for ${selected}`}
                  title="Delete"
                  disabled={(ipRowsByOption[selected]?.length ?? 1) === 1} // prevent deleting the only row
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
          disabled={!isFieldsValid()}
          style={{
            ...styles.submitButton,
            opacity: isFieldsValid() ? 1 : 0.5,
            cursor: isFieldsValid() ? "pointer" : "not-allowed",
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
  legend: {
    padding: "0 6px"
  },
  radioRow: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap"
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer"
  },

  section: {
    marginTop: 12
  },
  sectionTitle: {
    margin: "8px 0 12px",
    textAlign: "center"
  },

  pairRow: {
    display: "flex",
    gap: 12,
    marginBottom: 12,
    flexWrap: "wrap",
    alignItems: "flex-start"
  },
  field: {
    flex: "1 1 280px"
  },
  label: {
    display: "block",
    fontSize: 13,
    marginBottom: 6,
    color: "#333",
    textAlign: "center"
  },
  input: {
    width: "95%",
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
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },

  submitButton: {
    marginTop: 12,
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
    fontSize: 16,
    lineHeight: "20px",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "fit-content",
    height: "auto",
    whiteSpace: "nowrap",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },

  deleteCol: {
    display: "flex",
    flexDirection: "column",
    flex: "0 0 auto",
  },

  labelSpacer: {
    display: "block",
    fontSize: 13,
    marginBottom: 6,
    visibility: "hidden",
  },

  deleteButton: {
    width: 44,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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

  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: "#d00",
  },
};
