import { Field, Form, Formik } from 'formik';
import React from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Nazwa użytkownika musi mieć min. 3 znaki')
    .max(50, 'Nazwa użytkownika jest za długa')
    .required('Nazwa użytkownika jest wymagana'),
  email: Yup.string()
    .email('Nieprawidłowy email')
    .required('Email jest wymagany'),
  password: Yup.string()
    .min(6, 'Hasło musi mieć min. 6 znaków')
    .matches(/[0-9]/, 'Hasło musi zawierać cyfrę')
    .matches(/[a-z]/, 'Hasło musi zawierać małą literę')
    .matches(/[A-Z]/, 'Hasło musi zawierać dużą literę')
    .required('Hasło jest wymagane'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Hasła muszą być takie same')
    .required('Potwierdź hasło'),
});

const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
`;

const FormField = styled(Field)`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.8rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
`;

function RegisterForm({ onSwitchToLogin }) {
  return (
    <FormContainer>
      <h2>Rejestracja</h2>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          // Logika rejestracji
          console.log(values);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <FormField
              name="username"
              type="text"
              placeholder="Nazwa użytkownika"
            />
            {errors.username && touched.username ? (
              <ErrorMessage>{errors.username}</ErrorMessage>
            ) : null}

            <FormField name="email" type="email" placeholder="Email" />
            {errors.email && touched.email ? (
              <ErrorMessage>{errors.email}</ErrorMessage>
            ) : null}

            <FormField name="password" type="password" placeholder="Hasło" />
            {errors.password && touched.password ? (
              <ErrorMessage>{errors.password}</ErrorMessage>
            ) : null}

            <FormField
              name="confirmPassword"
              type="password"
              placeholder="Potwierdź hasło"
            />
            {errors.confirmPassword && touched.confirmPassword ? (
              <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
            ) : null}

            <SubmitButton type="submit">Zarejestruj się</SubmitButton>
          </Form>
        )}
      </Formik>
      <p>
        Masz już konto?
        <button onClick={onSwitchToLogin}>Zaloguj się</button>
      </p>
    </FormContainer>
  );
}

export default RegisterForm;
