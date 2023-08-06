import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="notfound--wrapper">
      <h1>Page Not Found</h1>
      <img src="/gifs/not-found.gif" />
      <Link to="/" className="notfound--back-to-home">
        Back To Home
      </Link>
    </div>
  );
}
