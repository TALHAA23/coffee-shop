import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProgressBar from "react-customizable-progressbar";

export default function Track() {
  const { state } = useLocation();
  console.log(state);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(2);
  const [progressText, setProgressText] = useState(
    "Coffee shop takes your order"
  );

  useEffect(() => {
    if (progress == 1) setProgressText("Coffee shop takes your order");
    else if (progress == 2) setProgressText("Prepare your order");
    else setProgressText("Your order is complete. Please pick it up.");
  }, [progress]);

  const now = new Date();
  let estimateTime = new Date(parseInt(state.estimate)).getTime();
  const timeCalculation = (estimateTime - now.getTime()) / 60000;
  console.log(timeCalculation);

  useEffect(() => {
    if (timeCalculation > 10) setProgress(1);
    else if (timeCalculation < 0) setProgress(3);
    else {
      setProgress(2);
    }
  }, []);

  function goToReview() {
    navigate("/review", {
      state: {
        receiptId: state.receiptId,
        productId: state.itemList[0].productId,
      },
    });
  }

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
          <img src="/icons/arrow-left.svg" />
        </Link>
        Tracking Order
      </div>
      <div className="track">
        <div className="track--itemList">{trackElement}</div>
        <hr />
        <div className="track--progress">
          <p className="track--progress--text">
            {progressText}
            <br />
            {timeCalculation >= 0 && (
              <small>Around {Math.floor(timeCalculation)} minutes</small>
            )}
          </p>
          <ProgressBar
            className="progress-bar"
            progress={progress}
            steps={3}
            radius={100}
            transition="3s ease"
            strokeColor={progress == 3 ? "green" : "indianred"}
          />
        </div>
        <hr />
        <button
          className="button track--take-order"
          disabled={progress == 3 ? false : true}
          onClick={goToReview}
        >
          Take Order
        </button>
      </div>
    </div>
  );
}
