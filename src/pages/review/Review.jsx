import { useState } from "react";
import {
  Link,
  useLocation,
  Form,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { addReview, isReviewDone, updateReview } from "../../utils";
import { useEffect } from "react";

export async function action({ request }) {
  const formData = await request.formData();
  const existingReview = formData.get("existingReviewRef");
  const rating = formData.get("rating");
  const review = formData.get("review");
  const from = formData.get("from");
  const to = formData.get("to");

  const data = {
    rating,
    review,
    from,
    to,
  };
  console.log(review);

  try {
    if (review == "" || rating == "-1")
      throw new Error("Review or Rating can't be null");
    if (existingReview) await updateReview(existingReview, data);
    else await addReview(data);
    return redirect("/history/done");
  } catch (err) {
    return { error: err.message, receiptId: from, productId: to };
  }
}

export default function Review() {
  const action = useActionData();
  console.log(action);
  const navigation = useNavigation();
  const { receiptId, productId } = useLocation().state || action;
  const [rating, setRating] = useState(-1);
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    (async () => {
      const checkReview = await isReviewDone(receiptId, productId);
      if (checkReview) {
        setExistingReview(checkReview);
        setRating(parseInt(checkReview.rating));
      }
    })();
  }, []);

  const outlineStarElement = new Array(5).fill(
    <img
      src="/icons/star-outline-big.svg"
      onClick={(event) => {
        const ratingEl = Array.from(event.target.parentNode.children);
        ratingEl.forEach((img) => (img.src = "/icons/star-outline-small.svg"));
        const ratingIndex = ratingEl.indexOf(event.target);
        setRating(ratingIndex + 1);
        ratingEl.forEach((img, index) => {
          if (index <= ratingIndex) img.src = "/icons/star-fill-small.svg";
        });
      }}
    />
  );

  return (
    <div className="checkout-wrapper">
      <div className="productDetails--header">
        <Link to="/history/done" relative="path">
          <img src="/icons/arrow-left.svg" />
        </Link>
        Review
      </div>
      <Form method="post" className="review">
        {action?.error && (
          <p className={action.error ? "form--error" : "form-success"}>
            {action.error}
          </p>
        )}
        {navigation.state == "submitting" && (
          <p className="form--waiting order-form-state">Please Wait...</p>
        )}
        <div className="review--header">
          <img src="/other-images/review-hero-img.png" alt="" />
        </div>
        <div className="review--rating">
          <small>Rating</small>
          <div className="review--rating--stars">
            {rating > -1 && (
              <img
                className="rating--face"
                src={`/other-images/rating-${rating}.png`}
              />
            )}
            <div className="rating--stars">{outlineStarElement}</div>
          </div>
        </div>
        <div className="review--written">
          <small>Review</small>
          <textarea
            className="review-written-box"
            placeholder={
              existingReview
                ? `existing Review: ${existingReview.review}`
                : "Tell us about your order experience"
            }
            name="review"
          ></textarea>
          <small className="review--written-warning">
            Reviews will be visible to the public
          </small>
        </div>
        <button className="button review--send">Send a review</button>

        <div>
          <input hidden readOnly name="rating" value={rating} />
          <input hidden readOnly name="to" value={productId} />
          <input hidden readOnly name="from" value={receiptId} />
          <input
            hidden
            readOnly
            name="existingReviewRef"
            value={existingReview?.docRef}
          />
        </div>
      </Form>
    </div>
  );
}
