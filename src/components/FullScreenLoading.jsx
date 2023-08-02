import { PushSpinner } from "react-spinners-kit";

export default function FullScreenLoading() {
  return (
    <div className="loading-wrapper">
      <PushSpinner size={50} />
      <h3>Loading</h3>
    </div>
  );
}
