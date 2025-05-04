import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  useAddToFavouritesMutation,
  useRemoveFromFavouritesMutation,
} from "../slices/productsApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Rating from "./Rating";

export default function ProductCard({ product }) {
  const [addToFavourites, { isLoading: isAdding }] =
    useAddToFavouritesMutation();
  const [removeFromFavourites, { isLoading: isRemoving }] =
    useRemoveFromFavouritesMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(
    function () {
      if (userInfo) {
        setIsFavourite(
          product.favouritedBy.some(
            (fav) => fav.user.toString() === userInfo._id.toString()
          )
        );
      }
    },
    [userInfo, product]
  );

  async function handleFavourite() {
    if (isFavourite) {
      try {
        await removeFromFavourites(product._id).unwrap();
        setIsFavourite(false);
        toast.success("Product removed from favourites");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    } else {
      try {
        await addToFavourites(product._id).unwrap();
        setIsFavourite(true);
        toast.success("Product added to favourites");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  }

  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`} className="product-title-link">
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} review${
              product.numReviews === 1 ? "" : "s"
            }`}
          />
        </Card.Text>
        <Card.Text as="h3">${product.price.toFixed(2)}</Card.Text>
        {userInfo && (
          <button
            onClick={handleFavourite}
            className="position-absolute bottom-0 end-0 m-3 bg-transparent border-0"
            style={{ cursor: "pointer" }}
          >
            {isFavourite ? (
              <FaHeart color="red" size={25} />
            ) : (
              <FaRegHeart color="black" size={25} />
            )}
          </button>
        )}
      </Card.Body>
    </Card>
  );
}
