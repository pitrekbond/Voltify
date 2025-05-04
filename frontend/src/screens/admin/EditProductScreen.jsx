import { Button, Col, Form, Row } from "react-bootstrap";
import Loader from "./../../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import {
  useEditProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Message from "./../../components/Message";

function EditProductScreen() {
  const { id } = useParams();
  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductByIdQuery(id);
  const [updateProduct, { isLoading: isUpdating }] = useEditProductMutation();
  const [uploadImage, { isLoading: isUploadingImage }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  // Set initial form values when product data is loaded
  useEffect(() => {
    if (product) {
      setName(product.name);
      setBrand(product.brand);
      setCategory(product.category);
      setPrice(product.price);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setImage(product.image);
    }
  }, [product]);

  async function uploadFileHandler(e) {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  }

  async function editProductHandler(e) {
    e.preventDefault();
    const updatedProduct = {
      id,
      name,
      brand,
      category,
      price,
      countInStock,
      description,
      image,
    };

    try {
      await updateProduct(updatedProduct).unwrap();
      toast.success("Product updated successfully");
      refetch();
      navigate("/admin/productList");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  useEffect(() => {
    document.title = "Admin - Edit Product";
  }, []);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <Row className="justify-content-md-center mt-5">
      <Col xs={12} md={6}>
        <h1>Edit Product</h1>
        <Form className="mt-4" onSubmit={editProductHandler}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="gray-focus"
            />
          </Form.Group>
          <Form.Group controlId="image" className="my-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="gray-focus"
            />
            <Form.Control
              type="file"
              label="Choose File"
              onChange={uploadFileHandler}
            />
            {isUploadingImage && <Loader />}
          </Form.Group>
          <Form.Group controlId="brand" className="my-3">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="gray-focus"
            />
          </Form.Group>
          <Form.Group controlId="category" className="my-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="gray-focus"
            />
          </Form.Group>
          <Form.Group controlId="price" className="my-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="gray-focus"
            />
          </Form.Group>
          <Form.Group controlId="countInStock" className="my-3">
            <Form.Label>Count in Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter countInStock"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              className="gray-focus"
            />
          </Form.Group>
          <Form.Group controlId="description" className="my-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4} // Adjust the number of rows as needed
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="gray-focus"
            />
          </Form.Group>
          {isUpdating ? (
            <Loader />
          ) : (
            <Button
              type="submit"
              variant="dark"
              className="py-2 px-2"
              style={{ fontSize: "1.2rem" }}
              disabled={!name || !brand || !category || !price || !description}
            >
              Update
            </Button>
          )}
        </Form>
      </Col>
    </Row>
  );
}

export default EditProductScreen;
