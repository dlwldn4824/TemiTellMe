import { Outlet, NavLink } from "react-router-dom";

export default function RootLayout() {
  return (
    <>
      <div className="top-reveal" />
      <header
        className="topbar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
        }}
      >
        <NavLink
          to="/"
          style={{
            fontWeight: 800,
            fontSize: "40px",
            textDecoration: "none",
            color: "#000",
            cursor: "pointer",
          }}
        >
          Temi-Tell-Me
        </NavLink>

        <nav style={{ display: "flex", gap: 30 }}>
          {[
            ["홈", "/"],
            ["전시장 안내", "/guide"],
            ["경진대회 일정", "/schedule"],
            ["이벤트 참여", "/quizIntro"],
            ["현장 줄서기", "/line"],
            ["포토존", "/photo"],
            ["문의", "/inquiry"],
            ["평가 남기기", "/review"],
          ].map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => {
                const baseStyle = {
                  padding: "8px 20px",
                  borderRadius: 8,
                  background: isActive ? "rgba(0,0,0,0.06)" : "transparent",
                  fontWeight: 1600,
                  fontSize: "25px",
                  transition: "0.25s",
                };

                if (label === "평가 남기기") {
                  return {
                    ...baseStyle,
                    color: "#ff4e4e",
                    background: isActive
                      ? "rgba(255,0,0,0.1)"
                      : "rgba(255,200,200,0.25)",
                    border: "2px solid rgba(255,0,0,0.35)",
                    borderRadius: "12px",
                    padding: "8px 26px",
                    fontWeight: 900,
                  };
                }

                return {
                  ...baseStyle,
                  fontFamily: "nanumRound",
                  fontWeight: 500,
                  fontSize: "28px",
                };
              }}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}
