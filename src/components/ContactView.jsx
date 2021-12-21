import { useState } from "react";

const ContactView = (props) => {
  const { contactToView } = props;
  console.log(contactToView);
  return (
    <>
      <h1>
        {contactToView.firstName} {contactToView.lastName}
      </h1>
      <h2>Address</h2>
      <h3>{contactToView.address.street}</h3>
      <h3>{contactToView.address.city}</h3>
      <h3>{contactToView.address.postCode}</h3>
    </>
  );
};

export default ContactView;
