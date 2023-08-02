import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProgressBar from "react-customizable-progressbar";

export default function Track() {
  const { state } = useLocation();
  const [progress, setProgress] = useState(1);
  const now = new Date();
  let estimateTime = state.estimate;
  console.log(progress);

  if (estimateTime.length > 7) estimateTime = new Date(parseInt(estimateTime));
  else {
    const [hr, mint] = estimateTime.split(":");
    estimateTime = new Date(new Date().setHours(hr));
    estimateTime = estimateTime.setMinutes(mint);
  }

  const timeCalculation = estimateTime - now.getTime();

  if (timeCalculation < 0) useEffect(() => setProgress(3), []);

  const trackElement = state.itemList.map((item) => (
    <div key={item.item}>
      <div>
        <h4>{item.item}</h4>
        <p>{item.desc}</p>
      </div>
      <p>
        <b>
          x{JSON.parse(localStorage.getItem("perItemQuantityRef"))[item.item]}
        </b>
      </p>
    </div>
  ));
  return (
    <div className="checkout-wrapper">
      <div className="productDetails--header">
        <Link to=".." relative="path">
          <img src="/icons/arrow-left .svg" />
        </Link>
        Tracking Order
      </div>
      <div className="track">
        <div className="track--itemList">{trackElement}</div>
        <hr />
        <div className="track--progress">
          <ProgressBar
            progress={progress}
            steps={3}
            radius={100}
            transition="3s ease"
            strokeColor={progress == 3 ? "green" : "indianred"}
          />
        </div>
        <hr />
        <button className="button track--take-order">Take Order</button>
      </div>
    </div>
  );
}
