import { nanoid } from "nanoid";
export default function ReviewsSection(props) {
  const reviewsElements = props.reviews.map((review) => (
    <div key={nanoid()} className="review--user-review">
      <small>
        <img src="/icons/star-yellow.svg" /> {review.rating}
      </small>
      <p>{review.review}</p>
    </div>
  ));
  return (
    <>
      <p
        className="reviews--header"
        onClick={() => props.toggleReviewSection(false)}
      >
        collapse
      </p>
      {reviewsElements.length ? (
        <div className="reviews--body">{reviewsElements}</div>
      ) : (
        <h3>No Review</h3>
      )}
    </>
  );
}
