import { NavLink } from "react-router-dom";
export default function Nav() {
  const activeLink = {
    fontWeight: "bold",
    textDecoration: "underline",
  };
  return (
    <nav>
      <NavLink to="/" style={({ isActive }) => (isActive ? activeLink : null)}>
        Home
      </NavLink>
      <NavLink
        to="history"
        style={({ isActive }) => (isActive ? activeLink : null)}
      >
        History
      </NavLink>
      <NavLink
        to="account"
        style={({ isActive }) => (isActive ? activeLink : null)}
      >
        Account
      </NavLink>
    </nav>
  );
}
