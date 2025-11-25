import { Link, useLocation } from "react-router-dom";

export default function DockNav() {
  const { pathname } = useLocation();
  const isActive = (to) => pathname.startsWith(to);

  return (
    <nav className="dock" aria-label="하단 내비게이션">
      <Link className={`dock-item ${pathname === "/" ? "is-active" : ""}`} to="/">
        <span className="dock-icon">아이콘</span>
        <span className="dock-label">HOME</span>
      </Link>
      <Link className={`dock-item ${isActive("/map") ? "is-active" : ""}`} to="/map">
        <span className="dock-icon">아이콘</span>
        <span className="dock-label">MAP</span>
      </Link>
      <Link className={`dock-item ${isActive("/events") ? "is-active" : ""}`} to="/search">
        <span className="dock-icon">아이콘</span>
        <span className="dock-label">SEARCH</span>
      </Link>
    </nav>
  );
}
