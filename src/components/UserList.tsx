import {
  Formik,
  Form,
  type FormikHelpers,
  Field,
  ErrorMessage,
  type FormikProps,
} from "formik";
import { useRef, useState } from "react";
import * as Yup from "yup";
import React from "react";

function UserList() {
  const [userList, setUserList] = useState<FormValues[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [sortField, setSortField] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const formikRef = useRef<FormikProps<FormValues>>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  interface FormValues {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    mobile: number;
    address: string;
  }
  const initialValues: FormValues = {
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    mobile: 0,
    address: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(3, "Minimum 3 characters")
      .max(10, "Maximum 10 characters")
      .required("Required"),
    lastName: Yup.string()
      .min(3, "Minimum 3 characters")
      .max(10, "Maximum 10 characters"),
    email: Yup.string().email("Invalid email").required("Required"),
    mobile: Yup.number()
      .min(1000000000, "Invalid mobile number")
      .required("Required"),
    address: Yup.string()
      .min(5, "Minimum 5 characters")
      .max(50, "Maximum 50 characters"),
  });

  const handleSort = (field: keyof FormValues) => {
    const sorted = [...userList].sort((a, b) =>
      String(a[field]).localeCompare(String(b[field]))
    );
    setUserList(sorted);
    setSortField(field);
  };
  const handleSubmit = (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    setError(null);
    try {
      console.log("editingId", editingId);
      if (editingId !== null) {
        setUserList((prev) =>
          prev.map((rec) =>
            rec.id === editingId ? { ...rec, ...values, id: editingId } : rec
          )
        );
        setEditingId(null);
      } else {
        setUserList((prev) => [...prev, { ...values, id: prev.length + 1 }]);
      }

      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
    resetForm();
    setSubmitting(false);
  };
  const handleDelete = (id: number) => {
    setUserList((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEdit = (user: FormValues & { id: number }) => {
    setEditingId(user.id);

    if (formikRef.current) {
      formikRef.current.setValues({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
      });
    }
  };
  const handleSelect = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredList.map((user) => user.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const filteredList = userList.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.mobile.toString().includes(term)
    );
  });
  return (
    <>
      <header id="header">
        <h2>User List</h2>
      </header>

      <Formik<FormValues>
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <section id="user-input">
          <Form className="input-group">
            <p>
              <label>First Name</label>

              <Field name="firstName" className="form-control" />
              <ErrorMessage
                name="firstName"
                component="span"
                className="text-danger"
              />
            </p>
            <p>
              <label>Last Name</label>

              <Field name="lastName" className="form-control" />
              <ErrorMessage
                name="lastName"
                component="span"
                className="text-danger"
              />
            </p>
            <p>
              <label>Email</label>

              <Field name="email" className="form-control" />
              <ErrorMessage
                name="email"
                component="span"
                className="text-danger"
              />
            </p>
            <p>
              <label>Mobile Number</label>

              <Field name="mobile" className="form-control" />
              <ErrorMessage
                name="mobile"
                component="span"
                className="text-danger"
              />
            </p>
            <p>
              <label>Address</label>
              <Field name="address" className="form-control" />
              <ErrorMessage
                name="address"
                component="span"
                className="text-danger"
              />
            </p>
            <p>
              <button type="submit">
                {editingId !== null ? "Update" : "Add"}
              </button>
            </p>
            <p>
              <input
                type="text"
                placeholder="Search by name, email, or mobile"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </p>
          </Form>
        </section>
      </Formik>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table id="result">
        <thead>
          <tr>
            <input
              type="checkbox"
              checked={
                filteredList.length > 0 &&
                selectedIds.length === filteredList.length
              }
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <th>Id</th>
            <th
              onClick={() => handleSort("firstName")}
              style={{ cursor: "pointer" }}
            >
              First Name {sortField === "firstName" ? "↓" : ""}
            </th>
            <th
              onClick={() => handleSort("lastName")}
              style={{ cursor: "pointer" }}
            >
              Last Name {sortField === "lastName" ? "↓" : ""}
            </th>
            <th
              onClick={() => handleSort("email")}
              style={{ cursor: "pointer" }}
            >
              Email {sortField === "email" ? "↓" : ""}
            </th>
            <th>Mobile</th>
            <th
              onClick={() => handleSort("address")}
              style={{ cursor: "pointer" }}
            >
              Address {sortField === "address" ? "↓" : ""}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((item) => {
            return (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={(e) => handleSelect(item.id, e.target.checked)}
                  />
                </td>
                <td>{item.id}</td>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.email}</td>
                <td>{item.mobile}</td>
                <td>{item.address}</td>
                <td>
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
          {userList.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default UserList;
