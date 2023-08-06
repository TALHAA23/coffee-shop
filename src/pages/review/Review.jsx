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
import { useUserUid } from "../../hooks/UserProvider";
import { nanoid } from "nanoid";

export async function action({ request }) {
  console.log("action");
  const formData = await request.formData();
  const existingReview = formData.get("existingReviewRef");
  const userUid = formData.get("userUid");
  const rating = formData.get("rating");
  const review = formData.get("review");
  const from = formData.get("from");
  const to = formData.get("to");

  const data = {
    userUid,
    rating,
    review,
    from,
    to,
  };

  try {
    if (review == "" || rating == "-1")
      throw new Error("Review or Rating can't be null");
    if (existingReview) await updateReview(existingReview, data);
    else await addReview(data);
    return redirect(`/history/done?auth=${userUid}`);
  } catch (err) {
    return { message: err.message };
  }
}

export default function Review() {
  const { userUid } = useUserUid();
  const action = useActionData();
  const navigation = useNavigation();
  const { receiptId, productId } = JSON.parse(
    localStorage.getItem("reviewOrigin")
  );

  const [rating, setRating] = useState(-1);
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    (async () => {
      if (!userUid) return;
      const checkReview = await isReviewDone(userUid, receiptId, productId);
      if (checkReview) {
        setExistingReview(checkReview);
        setRating(parseInt(checkReview.rating));
      }
    })();
  }, [userUid]);

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
        <Link
          to={{
            pathname: "/history/done",
            search: userUid ? `?auth=${userUid}` : "",
          }}
          relative="path"
        >
          <img src="/icons/arrow-left.svg" />
        </Link>
        Review
      </div>
      <Form method="post" className="review">
        {action && (
          <p className={action.message ? "form--error" : "form-success"}>
            {action.message}
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
          <input hidden readOnly name="userUid" value={userUid} />
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
