import React from "react";
import "./AddForm.css";

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const UserSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    username: Yup.string().required('Required'),
    email: Yup.string().required('Required'),
    phone: Yup.string().required('Required'),
    companyName: Yup.string().required('Required'),
    street: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    lat: Yup.string().required('Required'),
    lng: Yup.string().required('Required')
});

export default function UserForm({ onSubmit }) {
    return (
        <Formik
            initialValues={{
                name: '',
                username: '',
                email: '',
                phone: '',
                website: '',
                companyName: '',
                catchPhrase: '',
                bs: '',
                street: '',
                suite: '',
                city: '',
                zipcode: '',
                lat: '',
                lng: ''
            }}
            validationSchema={UserSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched }) => (
                <Form className="user-form">
                    <Field name="name" placeholder="Name" />
                    <Field name="username" placeholder="Username" />
                    <Field name="email" type="email" placeholder="Email" />
                    <Field name="phone" placeholder="Phone" />
                    <Field name="website" placeholder="Website" />

                    <h4>company:</h4>
                    <Field name="companyName" placeholder="Company Name" />
                    <Field name="catchPhrase" placeholder="Catch Phrase" />
                    <Field name="bs" placeholder="Business Strategy" />

                    <h4>address:</h4>
                    <Field name="street" placeholder="Street" />
                    <Field name="suite" placeholder="Suite" />
                    <Field name="city" placeholder="City" />
                    <Field name="zipcode" placeholder="Zipcode" />

                    <h4>geo:</h4>
                    <Field name="lat" placeholder="Lat" />
                    <Field name="lng" placeholder="Lng" />

                    <button type="submit">Add User</button>
                </Form>
            )}
        </Formik>
    );
}