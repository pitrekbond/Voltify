import { Button, Col, Row, Table } from "react-bootstrap";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../slices/productsApiSlice";
import Loader from "./../../components/Loader";
import Message from "./../../components/Message";
import { FaEdit, FaTrash } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";
import { useEffect } from "react";

function ProductListScreen() {
  const { pageNumber } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    pageNumber,
  });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  async function createProductHandler() {
    if (
      window.confirm("Please confirm that you want to create a new product")
    ) {
      try {
        await createProduct().unwrap();
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  }

  async function deleteProductHandler(id) {
    if (window.confirm("Please confirm that you want to delete this product")) {
      try {
        await deleteProduct(id).unwrap();
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  }

  useEffect(() => {
    document.title = "Admin - Products";
  }, []);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">There was an error fetching products</Message>
  ) : (
    <Row className="justify-content-md-center mx-0">
      <Col xs={12}>
        <Row className="mb-4">
          <Col xs={12} className="position-relative text-center">
            <h1 className="d-inline-block">Products</h1>
            <Button
              className="position-absolute end-0 top-50 translate-middle-y btn-sm px-3 py-2"
              variant="dark"
              onClick={createProductHandler}
            >
              <FaEdit /> Create Product
            </Button>
          </Col>
        </Row>

        <Table bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>PRODUCT ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="dark" className="btn-sm mx-2">
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteProductHandler(product._id)}
                  >
                    <FaTrash style={{ color: "white" }} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Paginate
          pages={data.pages}
          page={Number(pageNumber) || 1}
          isAdmin={true}
        />
        {isDeleting && <Loader />}
        {isCreating && <Loader />}
      </Col>
    </Row>
  );
}

export default ProductListScreen;
