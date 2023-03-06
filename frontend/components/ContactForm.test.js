import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm/>)
});

test('renders the contact form header', () => {
    render(<ContactForm/>)

    const headerElement = screen.queryByText(/Contact Form/i);
    
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toBeTruthy();
    expect(headerElement).toHaveTextContent(/contact form/i);

});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);

    const firstNameField = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameField, '123');

    const errorMessage = await screen.findAllByTestId("error");
    expect(errorMessage).toHaveLength(1);

});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);

    const submitButton = screen.getByRole("button")
    userEvent.click(submitButton);

    await waitFor(() => {
        const errorMessages = screen.queryAllByTestId("error");
        expect(errorMessages).toHaveLength(3);
    }) 
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);

    const firstNameField = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameField, 'Johnathan');

    const lastNameField = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lastNameField, 'Smithington');

    const submitButton = screen.getByRole("button")
    userEvent.click(submitButton);

    await waitFor(() => {
        const errorMessage = screen.queryAllByTestId("error");
        expect(errorMessage).toHaveLength(1);
    }) 
    
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>)

    const emailField = screen.getByLabelText(/email*/i);
    userEvent.type(emailField, 'roro.com')

    await waitFor(() => {
        const errorMessage = screen.getByTestId("error");
        expect(errorMessage).toHaveTextContent("email must be a valid email address")
    })
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>)

    const submitButton = screen.getByRole("button")
    userEvent.click(submitButton);

    const errorMessage = await screen.findByText(/lastName is a required field/i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);

    //submitting valid input and leaving "message" field blank
    const firstNameField = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameField, 'Johnathan');

    const lastNameField = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lastNameField, 'Smithington');

    const emailField = screen.getByLabelText(/email*/i);
    userEvent.type(emailField, 'roroyourboat@gmail.com')

    const submitButton = screen.getByRole("button")
    userEvent.click(submitButton);

    //searching for the displayed results and a blank message value
    const firstNameDisplay = await screen.findByTestId("firstnameDisplay");
    expect(firstNameDisplay).toHaveTextContent(/johnathan/i);

    const lastNameDisplay = await screen.findByTestId("lastnameDisplay");
    expect(lastNameDisplay).toHaveTextContent(/smithington/i);

    const emailDisplay = await screen.findByTestId("emailDisplay");
    expect(emailDisplay).toHaveTextContent(/roroyourboat@gmail.com/i);

    const messageDisplay = screen.queryByText("Message: ");
    expect(messageDisplay).not.toBeInTheDocument();

});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);

    //submitting valid input and leaving "message" field blank
    const firstNameField = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameField, 'Johnathan');

    const lastNameField = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lastNameField, 'Smithington');

    const emailField = screen.getByLabelText(/email*/i);
    userEvent.type(emailField, 'roroyourboat@gmail.com')

    const messageField = screen.getByLabelText(/message/i);
    userEvent.type(messageField, 'Foo Bar')

    const submitButton = screen.getByRole("button")
    userEvent.click(submitButton);

    //searching for the displayed results and a blank message value
    const firstNameDisplay = await screen.findByTestId("firstnameDisplay");
    expect(firstNameDisplay).toHaveTextContent(/johnathan/i);

    const lastNameDisplay = await screen.findByTestId("lastnameDisplay");
    expect(lastNameDisplay).toHaveTextContent(/smithington/i);

    const emailDisplay = await screen.findByTestId("emailDisplay");
    expect(emailDisplay).toHaveTextContent(/roroyourboat@gmail.com/i);

    const messageDisplay = await screen.findByTestId("messageDisplay");
    expect(messageDisplay).toHaveTextContent(/foo bar/i);
});
