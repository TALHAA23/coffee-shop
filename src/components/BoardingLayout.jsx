import { Link, Outlet, NavLink, useLocation } from "react-router-dom";

export default function BoardingLayout() {
  let nextPage = parseInt(useLocation().pathname.split("/")[2]);
  nextPage = nextPage == "3" ? "/login" : nextPage ? nextPage + 1 : 2;

  const activeDotStyle = {
    width: "24px",
    borderRadius: "10px",
    backgroundColor: "#6e3931",
  };

  return (
    <section className="boardingLayout">
      <Link to="/" className="boardingLayout--skip">
        Skip
      </Link>
      <Outlet />
      <div className="boardingLayout--footer">
        <div className="boardingLayout--dots">
          <NavLink
            to="/onboarding"
            end
            style={({ isActive }) => (isActive ? activeDotStyle : null)}
          ></NavLink>
          <NavLink
            to="2"
            style={({ isActive }) => (isActive ? activeDotStyle : null)}
          ></NavLink>
          <NavLink
            to="3"
            style={({ isActive }) => (isActive ? activeDotStyle : null)}
          ></NavLink>
        </div>
        <Link to={`${nextPage}`} className="boardingLayout--next">
          {nextPage == "/login" ? "Login/Register" : "Next"}
          <img src="/icons/arrow-right.svg" alt="" />
        </Link>
      </div>
    </section>
  );
}
