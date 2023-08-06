import { NavLink } from "react-router-dom";
import { useUserUid } from "../hooks/UserProvider";
import { signOutUser } from "../auth";
export default function Nav() {
  const { userUid } = useUserUid();

  function handleSignOut() {
    if (userUid) signOutUser();
  }

  return (
    <nav>
      <NavLink to="/" style={{ fontWeight: "b" }}>
        Home
      </NavLink>
      <NavLink
        to={{
          pathname: "/history",
          search: userUid ? `?auth=${userUid}` : "",
        }}
      >
        History
      </NavLink>
      <NavLink
        to={{
          pathname: "/checkout",
          search: userUid ? `?auth=${userUid}` : "",
        }}
      >
        Cart
      </NavLink>
      <NavLink
        to={userUid ? "#" : "/login"}
        onClick={handleSignOut}
        title={useUserUid ? "sign out" : "sign in"}
      >
        <img
          style={{ scale: "0.8" }}
          src={`/other-images/user-${userUid ? "minus" : "plus"}-white.png`}
          alt=""
        />
      </NavLink>
    </nav>
  );
}
