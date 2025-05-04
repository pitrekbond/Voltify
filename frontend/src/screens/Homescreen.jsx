import { Col, Dropdown, Row } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import {
  useGetCategoriesQuery,
  useGetProductsQuery,
} from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import { useEffect } from "react";

export default function Homescreen() {
  const { pageNumber, keyword, category } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    pageNumber,
    keyword,
    category,
  });
  const { data: categoriesData } = useGetCategoriesQuery();

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Voltify - Homepage";
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy");

  function handleSort(value) {
    searchParams.set("sortBy", value);
    setSearchParams(searchParams);
  }

  function handleFilter(value) {
    navigate(`/filter/${value}`);
  }

  const uniqueCategories = categoriesData || [];

  let sortedProducts = [];

  if (!isLoading && !error && data) {
    if (sortBy === "priceAsc") {
      sortedProducts = [...data.products].sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      sortedProducts = [...data.products].sort((a, b) => b.price - a.price);
    } else {
      sortedProducts = data.products;
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
          {!keyword && <ProductCarousel />}
          <Row className="align-items-center">
            <Col>
              <h1>Our products</h1>
            </Col>

            <Col className="text-end">
              <div className="d-flex justify-content-end gap-2">
                <Dropdown>
                  <Dropdown.Toggle variant="dark" id="dropdown-basic">
                    {`${category ? category : "Filter by:"}`}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {uniqueCategories.map((cat) => (
                      <Dropdown.Item
                        onClick={() => handleFilter(`${cat}`)}
                        key={cat}
                      >
                        {cat}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown>
                  <Dropdown.Toggle variant="dark" id="dropdown-basic">
                    {`Sort by: ${
                      sortBy
                        ? sortBy === "priceAsc"
                          ? "Price - Low to High"
                          : "Price - High to Low"
                        : ""
                    }`}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleSort("priceAsc")}>
                      Price: Low to High
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSort("priceDesc")}>
                      Price: High to Low
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
          </Row>
          {sortedProducts.length === 0 ? (
            <Message variant="danger">
              There are no products with the searched criteria
            </Message>
          ) : (
            <Row>
              {sortedProducts.map((product) => (
                <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}

          <Paginate
            pages={data.pages}
            page={Number(pageNumber) || 1}
            keyword={keyword}
          />
        </>
      )}
    </>
  );
}
