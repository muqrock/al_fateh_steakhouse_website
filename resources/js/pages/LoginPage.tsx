import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignInClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication here
    alert(`Username: ${username}\nPassword: ${password}`);
    setShowModal(false);
  };

  return (
    <div>
      {/* Sign In Box at Top Right */}
      <div style={{
        position: "absolute",
        top: 20,
        right: 40,
        zIndex: 1000
      }}>
        <input
          type="text"
          placeholder="Sign In"
          readOnly
          style={{ cursor: "pointer", padding: 8, borderRadius: 4 }}
          onClick={handleSignInClick}
        />
      </div>

      {/* Popup Modal */}
      {showModal && (
        <div
          style={{
            display: "flex",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000
          }}
          onClick={handleClose}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minWidth: 300,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3>Sign In</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ width: "100%", marginBottom: 10, padding: 8 }}
                required
              /><br />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: "100%", marginBottom: 10, padding: 8 }}
                required
              /><br />
              <button
                type="submit"
                style={{ width: "100%", padding: 8 }}
              >
                Sign In
              </button>
            </form>
            <button
              onClick={handleClose}
              style={{ marginTop: 10, width: "100%" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;