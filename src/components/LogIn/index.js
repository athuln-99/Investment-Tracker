import React from 'react'
import { useState } from 'react'
import { Card, Form, Button, Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

import * as URI from '../../constants/uri'

import { useAuth } from '../../contexts/AuthContext'

const LogIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Returns a function that lets you navigate programmatically
  const navigate = useNavigate()

  // deconstructing components defined in useContext hook
  const { login } = useAuth()

  // login using firebase function and the navigate to the homepage
  const handleSubmit = () => {
    login(email, password).then(() => {
      setTimeout(() => {
        navigate(URI.HOME)
      }, 1)
    })
  }

  return (
    <Container
      fluid
      className='justify-content-center d-flex align-items-center'
      style={{
        height: '87vh',
      }}
    >
      <br></br>
      <Card style={{ minWidth: '35%' }}>
        <Card.Body>
          <h2 className='text-center mb-4'>Log In</h2>
          <Form>
            <Form.Group className='mb-3' controlId='logInEmail'>
              <Form.Control
                type='email'
                name='email'
                placeholder='Email Address'
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='logInPassword'>
              <Form.Control
                type='password'
                name='password'
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button className='w-100' onClick={handleSubmit}>
              Log In
            </Button>
          </Form>
          <div className='w-100 text-center mt-3'>
            <Link to={URI.PASSWORD_RESET}>Reset Password</Link>/
            <Link to={URI.SIGN_UP}>Sign Up</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default LogIn
