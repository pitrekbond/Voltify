import { Col, Row } from "react-bootstrap";
import { useGetFavouriteProductsQuery } from "../slices/productsApiSlice";
import Loader from "./../components/Loader";
import Message from "./../components/Message";
import ProductCard from "../components/ProductCard";
import { useEffect } from "react";

function WishListScreen() {
  const { data: products, isLoading, error } = useGetFavouriteProductsQuery();

  useEffect(() => {
    document.title = "Favourites";
  }, []);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <h1>Favourites</h1>
          {products.length === 0 ? (
            <Message variant="danger">
              You haven't added any favourite products yet.
            </Message>
          ) : (
            <Row>
              {products.map((product) => (
                <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </>
  );
}

export default WishListScreen;
