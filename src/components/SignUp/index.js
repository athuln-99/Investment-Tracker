import React, { useState } from 'react'
import { Card, Form, Button, Container } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'

import * as URI from '../../constants/uri'

import { useAuth } from '../../contexts/AuthContext'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Returns a function that lets you navigate programmatically
  const navigate = useNavigate()

  // deconstructing components defined in useContext hook
  const { signUp } = useAuth()

  // sign up using firebase function and the navigate to the homepage
  const handleSignUp = () => {
    signUp(email, password).then(() => {
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
      <Card style={{ minWidth: '35%' }}>
        <Card.Body>
          <h2 className='text-center mb-4'>Sign Up</h2>
          <Form>
            <Form.Group className='mb-3' controlId='signUpEmail'>
              <Form.Control
                type='email'
                name='email'
                placeholder='Email'
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='signUpPassword'>
              <Form.Control
                type='password'
                name='password'
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button className='w-100' onClick={handleSignUp}>
              Sign Up
            </Button>
          </Form>
          <div className='w-100 text-center mt-2'>
            <Link to={URI.LOG_IN}>Log In</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default SignUp
