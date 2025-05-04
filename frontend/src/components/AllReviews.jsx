import { Card, ProgressBar } from "react-bootstrap";
import { StarFill } from "react-bootstrap-icons";

const AllReviews = ({ reviews }) => {
  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Count reviews for each star rating
  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]; // Index 0 = 1-star, 1 = 2-star, etc.
    reviews.forEach((review) => {
      distribution[review.rating - 1]++; // rating-1 to match array index
    });
    return distribution;
  };

  const averageRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();
  const totalReviews = reviews.length;

  return (
    <Card className="p-4">
      <Card.Title className="text-center" style={{ fontSize: "1.5rem" }}>
        All reviews
      </Card.Title>
      <div className="d-flex align-items-center mb-3">
        <div className="text-center pe-3 d-grid gap-2">
          <strong>
            {averageRating >= 4.8
              ? "Excellent"
              : averageRating >= 3.8 && averageRating < 4.8
              ? "Very Good"
              : averageRating >= 2.8 && averageRating < 3.8
              ? "Good"
              : averageRating >= 1.8 && averageRating < 2.8
              ? "Fair"
              : "Poor"}
          </strong>
          <h2 className="m-0">{averageRating}</h2>
          <span>
            {totalReviews} review{totalReviews > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex-grow-1 ps-3 border-start">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="d-flex align-items-center mb-2">
              <div className="me-2">
                {rating} <StarFill color="gold" />
              </div>
              <ProgressBar
                now={(ratingDistribution[rating - 1] / totalReviews) * 100}
                className="flex-grow-1"
                variant="dark"
              />
              <div className="ms-2">{ratingDistribution[rating - 1]}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AllReviews;
