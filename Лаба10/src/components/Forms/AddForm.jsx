import React from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "./AddForm.css";

const AddForm = ({ headers, onSubmit }) => {

    const validationSchema = Yup.object().shape(
        headers.reduce((acc, header) => {
            // acc[header] = Yup.string().required(`${header} is required`);
            return acc;
        }, {})
    );

    return (
        <Formik
            initialValues={headers.reduce((acc, header) => {
                acc[header] = '';
                return acc;
            }, {})}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
                onSubmit(values);
                resetForm();
            }}
        >
            {({ errors, touched }) => (
                <Form className="add-form">
                    {headers.map(header => (
                        <div key={header} className="form-group">
                            {/* <label htmlFor={header}>{header}</label> */}
                            <Field
                                type="text"
                                name={header}
                                placeholder={header}
                                className={errors[header] && touched[header] ? 'error' : ''
                                }
                            />
                            <ErrorMessage name={header} component="div" className="error-message" />
                        </div>
                    ))}
                    <button type="submit">Add</button>
                </Form>
            )}
        </Formik>
    );
};

export default AddForm;