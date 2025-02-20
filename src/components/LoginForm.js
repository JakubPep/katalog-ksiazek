import { Field, Form, Formik } from 'formik';
import React from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Nieprawidłowy email')
    .required('Email jest wymagany'),
  password: Yup.string()
    .min(6, 'Hasło musi mieć min. 6 znaków')
    .required('Hasło jest wymagane'),
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

function LoginForm({ onSwitchToRegister }) {
  return (
    <FormContainer>
      <h2>Logowanie</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          // Logika logowania
          console.log(values);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <FormField name="email" type="email" placeholder="Email" />
            {errors.email && touched.email ? <div>{errors.email}</div> : null}

            <FormField name="password" type="password" placeholder="Hasło" />
            {errors.password && touched.password ? (
              <div>{errors.password}</div>
            ) : null}

            <SubmitButton type="submit">Zaloguj się</SubmitButton>
          </Form>
        )}
      </Formik>
      <p>
        Nie masz konta?
        <button onClick={onSwitchToRegister}>Zarejestruj się</button>
      </p>
    </FormContainer>
  );
}

export default LoginForm;
