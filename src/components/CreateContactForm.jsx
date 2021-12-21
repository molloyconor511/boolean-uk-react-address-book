import { useState, useEffect } from "react";

const CreateContactForm = (props) => {
  const {
    fetchContacts,
    setFetchContacts,
    editContact,
    setEditContact,
    contactToEdit,
    setContactToView,
  } = props;

  const initialContacts = {
    firstName: "",
    lastName: "",
    blockContact: false,
    addressId: null,
  };

  const initialAddresses = {
    street: "",
    city: "",
    postCode: "",
  };

  const [newContact, setNewContact] = useState(initialContacts);

  const [newAddress, setNewAddress] = useState(initialAddresses);

  const [submit, setSubmit] = useState(false);

  //const [contactToView, setContactToView] = useState(null)

  useEffect(() => {
    if (!submit) return;
    contactToEdit ? patchAddress() : postAddress();
  }, [submit]);

  useEffect(() => {
    if (!newContact.addressId || !submit) return;
    contactToEdit ? patchContact() : postContact();
    resetForm();
    setFetchContacts(!fetchContacts);
    setSubmit(false);
    contactToView();
  }, [newContact]);

  console.log("states createForm:", {
    newContact,
    newAddress,
    submit,
    editContact,
    contactToEdit,
  });

  useEffect(() => {
    if (!editContact) return;
    const { address, ...contact } = contactToEdit;
    setNewContact(contact);
    setNewAddress(address);
    setEditContact(false);
  }, [editContact]);

  const handleContactChange = (event) =>
    setNewContact({ ...newContact, [event.target.name]: event.target.value });

  const handleAddressChange = (event) =>
    setNewAddress({ ...newAddress, [event.target.name]: event.target.value });

  const handleCheckboxChange = (event) =>
    setNewContact({ ...newContact, [event.target.name]: event.target.checked });

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmit(true);
  };

  const deleteContactHandler = () => {
    fetch(`http://localhost:3000/addresses/${newContact.addressId}`, {
      method: "DELETE",
    });
    fetch(`http://localhost:3000/contacts/${newContact.id}`, {
      method: "DELETE",
    });
    resetForm();
    setFetchContacts(!fetchContacts);
  };

  const resetForm = () => {
    setNewAddress(initialAddresses);
    setNewContact(initialContacts);
  };

  const contactToView = () => {
    let address = { ...newAddress };
    let viewContact = { ...newContact, address };
    return setContactToView(viewContact);
    console.log(viewContact);
  };

  const postAddress = async () => {
    const response = await fetch("http://localhost:3000/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAddress),
    });
    const data = await response.json();
    setNewContact({ ...newContact, addressId: data.id });
  };

  const postContact = async () => {
    const response = await fetch("http://localhost:3000/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContact),
    });
    const data = await response.json();
  };

  const patchAddress = async () => {
    const response = await fetch(
      `http://localhost:3000/addresses/${newContact.addressId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      }
    );
    const data = await response.json();
  };

  const patchContact = async () => {
    const response = await fetch(
      `http://localhost:3000/contacts/${newContact.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContact),
      }
    );
    const data = await response.json();
  };

  return (
    <form
      className="form-stack light-shadow center contact-form"
      onSubmit={handleSubmit}
    >
      {!editContact && <h1>Create Contact</h1>}
      {editContact && <h1>Edit Contact</h1>}
      <label htmlFor="first-name-input">First Name:</label>
      <input
        id="first-name-input"
        name="firstName"
        type="text"
        onChange={handleContactChange}
        value={newContact.firstName}
      />
      <label htmlFor="last-name-input">Last Name:</label>
      <input
        id="last-name-input"
        name="lastName"
        type="text"
        onChange={handleContactChange}
        value={newContact.lastName}
      />
      <label htmlFor="street-input">Street:</label>
      <input
        id="street-input"
        name="street"
        type="text"
        onChange={handleAddressChange}
        value={newAddress.street}
      />
      <label htmlFor="city-input">City:</label>
      <input
        id="city-input"
        name="city"
        type="text"
        onChange={handleAddressChange}
        value={newAddress.city}
      />
      <label htmlFor="post-code-input">Post Code:</label>
      <input
        id="post-code-input"
        name="postCode"
        type="text"
        onChange={handleAddressChange}
        value={newAddress.postCode}
      />
      <div className="checkbox-section">
        <input
          id="block-checkbox"
          name="blockContact"
          type="checkbox"
          onChange={handleCheckboxChange}
          checked={newContact.blockContact}
        />
        <label htmlFor="block-checkbox">Block</label>
      </div>
      <div className="actions-section">
        {!contactToEdit && (
          <button className="button blue" type="submit">
            Create
          </button>
        )}
        {contactToEdit && (
          <>
            <button className="button blue" type="submit">
              Edit
            </button>
            <button
              className="button blue"
              onClick={() => deleteContactHandler()}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default CreateContactForm;
