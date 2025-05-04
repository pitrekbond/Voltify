import { Button, Col, Form, Row } from "react-bootstrap";
import Loader from "./../../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Message from "./../../components/Message";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";

function EditUserScreen() {
  const { id: userId } = useParams();
  const { data: user, isLoading, refetch, error } = useGetUserByIdQuery(userId);
  const [editUser, { isLoading: isEditing }] = useUpdateUserMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  // Set initial form values when product data is loaded
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  async function editUserHandler(e) {
    e.preventDefault();

    const updatedUser = {
      userId,
      name,
      email,
      isAdmin,
    };
    try {
      await editUser(updatedUser).unwrap();
      toast.success("User updated successfully");
      refetch();
      navigate("/admin/userList");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  useEffect(() => {
    document.title = "Admin - Edit User";
  }, []);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <Row className="justify-content-md-center mt-5">
      <Col xs={12} md={6}>
        <h1>Edit User</h1>
        <Form className="mt-4" onSubmit={editUserHandler}>
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
          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="gray-focus"
            />
          </Form.Group>
          <Form.Group controlId="isAdmin" className="my-3">
            <Form.Check
              type="checkbox"
              label="Make Admin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            ></Form.Check>
          </Form.Group>

          {isEditing ? (
            <Loader />
          ) : (
            <Button
              type="submit"
              variant="dark"
              className="py-2 px-2"
              style={{ fontSize: "1.2rem" }}
              disabled={!name || !email}
            >
              Update
            </Button>
          )}
        </Form>
      </Col>
    </Row>
  );
}

export default EditUserScreen;
