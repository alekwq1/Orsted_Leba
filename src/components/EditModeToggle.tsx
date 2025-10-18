import { useState } from "react";

type EditModeToggleProps = {
  editMode: boolean;
  onEnter: () => void; // wywoływane po poprawnym wpisaniu hasła
  onExit: () => void; // wywoływane przy wyjściu z trybu edycji
  password?: string; // domyślnie "2222"
};

export default function EditModeToggle({
  editMode,
  onEnter,
  onExit,
  password = "2222",
}: EditModeToggleProps) {
  const [askPassword, setAskPassword] = useState(false);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);

  return (
    <>
      {!editMode ? (
        <button
          onClick={() => {
            setPwd("");
            setError(false);
            setAskPassword(true);
          }}
          style={{
            position: "fixed",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            background: "#1971c2",
            color: "#fff",
            border: "none",
            borderRadius: "60px",
            boxShadow: "0 4px 16px #1971c223",
            padding: "14px 28px",
            fontWeight: 700,
            fontSize: 17,
            zIndex: 2222,
            cursor: "pointer",
            letterSpacing: 1,
          }}
          title="Enable edit mode"
        >
          Edit mode
        </button>
      ) : (
        <button
          onClick={onExit}
          style={{
            position: "fixed",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            background: "#dee2e6",
            color: "#1971c2",
            border: "none",
            borderRadius: "60px",
            boxShadow: "0 4px 16px #1971c210",
            padding: "14px 28px",
            fontWeight: 700,
            fontSize: 17,
            zIndex: 2222,
            cursor: "pointer",
            letterSpacing: 1,
          }}
          title="Disable edit mode"
        >
          Exit edit
        </button>
      )}

      {/* Modal z hasłem */}
      {askPassword && !editMode && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.19)",
            zIndex: 2022,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setAskPassword(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 4px 24px #0003",
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignItems: "stretch",
              minWidth: 260,
            }}
            onSubmit={(e) => {
              e.preventDefault();
              if (pwd === password) {
                setAskPassword(false);
                onEnter();
              } else {
                setError(true);
              }
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 18, color: "#185c92" }}>
              Edit mode – password
            </span>
            <input
              type="password"
              placeholder="Enter password"
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value);
                setError(false);
              }}
              style={{
                fontSize: 16,
                padding: "8px 13px",
                borderRadius: 8,
                border: `1px solid ${error ? "#e03131" : "#ccc"}`,
                outline: "none",
              }}
            />
            {error && (
              <span style={{ color: "#e03131", fontSize: 13 }}>
                Invalid password
              </span>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="submit"
                style={{
                  background: "#1d8af2",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 8,
                  border: "none",
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
              >
                Continue
              </button>
              <button
                type="button"
                onClick={() => setAskPassword(false)}
                style={{
                  background: "#f2f4f7",
                  color: "#333",
                  fontSize: 14,
                  borderRadius: 7,
                  border: "none",
                  padding: "7px 12px",
                  cursor: "pointer",
                  marginLeft: "auto",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
