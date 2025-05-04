import { Link, useParams } from "react-router-dom";
import {
  useCreateReviewMutation,
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
} from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Button, Col, Form, Image, ListGroup, Row } from "react-bootstrap";
import { useState } from "react";
import Rating from "../components/Rating";
import AllReviews from "../components/AllReviews";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { toast } from "react-toastify";
import AddToCartModal from "../components/AddToCartModal";
import ProductCard from "../components/ProductCard";

export default function ProductScreen() {
  const { id: productId } = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showCartModal, setShowCartModal] = useState(false);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductByIdQuery(productId);
  const [createReview, { isLoading: isCreatingReview }] =
    useCreateReviewMutation();
  const { data: relatedProducts, isLoading: isLoadingRelated } =
    useGetRelatedProductsQuery(productId);

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  function addToCartHandler() {
    dispatch(addToCart({ ...product, qty }));
    setShowCartModal(true);
    // navigate("/cart");
  }

  async function addReviewHandler(e) {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review added");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Link to="/" className="btn btn-dark my-3">
            Go Back
          </Link>

          {/* Product main info section */}
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item className="py-4">
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item className="py-3">
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item className="py-3">
                  Price: ${product.price}
                </ListGroup.Item>
                <ListGroup.Item className="py-3">
                  {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <ListGroup>
                <ListGroup.Item className="py-3">
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="py-3">
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      <span
                        style={{
                          color: product.countInStock > 0 ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item className="py-3">
                    <Row>
                      <Col>Quantity:</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          disabled={product.countInStock === 0}
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                          className="gray-focus"
                        >
                          {[
                            ...Array(product.countInStock).slice(0, 10).keys(),
                          ].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item className="py-3">
                  <Button
                    variant="dark"
                    style={{
                      width: "70%",
                      margin: "0 auto",
                      display: "block",
                      fontSize: "1.2rem",
                    }}
                    className="py-2"
                    type="button"
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>

          {/* Reviews and Related Products section */}
          <Row className="mt-5">
            {/* Reviews Column */}
            <Col md={9}>
              <h2>Reviews</h2>
              {product.reviews.length !== 0 && (
                <AllReviews reviews={product.reviews} />
              )}

              {product.reviews.length === 0 && (
                <Message>No Reviews Yet</Message>
              )}

              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>
                      {review.name}
                      {review.user.toString() === userInfo._id.toString() &&
                        " (You)"}
                    </strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                {!product.reviews.find(
                  (review) => review.user.toString() === userInfo._id.toString()
                ) && (
                  <ListGroup.Item className="mt-4">
                    <h2>Write your review</h2>
                    {isCreatingReview && <Loader />}
                    {userInfo ? (
                      <Form onSubmit={addReviewHandler}>
                        <Form.Group controlId="rating" className="my-2">
                          <Form.Label>Rating</Form.Label>
                          <Form.Control
                            as="select"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="gray-focus"
                          >
                            <option value="">Select...</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="comment" className="my-2">
                          <Form.Label>Comment</Form.Label>
                          <Form.Control
                            as="textarea"
                            row="3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="gray-focus"
                          ></Form.Control>
                        </Form.Group>
                        <Button
                          disabled={isCreatingReview}
                          type="submit"
                          variant="dark"
                          className="py-2 px-2"
                          style={{ fontSize: "1.2rem" }}
                        >
                          Submit
                        </Button>
                      </Form>
                    ) : (
                      <Message>
                        Please <Link to="/login">sign in</Link> to write a
                        review
                      </Message>
                    )}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>

            {/* Related Products Column */}
            <Col md={3}>
              {isLoadingRelated ? (
                <Loader />
              ) : (
                relatedProducts.length !== 0 && (
                  <div>
                    <h3 className="text-center">You may also like:</h3>
                    {relatedProducts.map((product) => (
                      <ProductCard product={product} key={product._id} />
                    ))}
                  </div>
                )
              )}
            </Col>
          </Row>

          <AddToCartModal
            show={showCartModal}
            onHide={() => setShowCartModal(false)}
            product={product}
            qty={qty}
          />
        </>
      )}
    </>
  );
}
