import React from 'react'
import { useState } from 'react'
import { Form, Button, Card, Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

import * as URI from '../../constants/uri'

import { useAuth } from '../../contexts/AuthContext'

const ResetPassword = () => {
  const [email, setEmail] = useState('')

  // deconstructing components defined in useContext hook
  const { resetPassword } = useAuth()

  // Returns a function that lets you navigate programmatically
  const navigate = useNavigate()

  // reset password using firebase function and then navigate to the log in page
  const handleSubmit = (e) => {
    resetPassword(email).then(() => {
      navigate(URI.LOG_IN)
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
          <h2 className='text-center mb-4'>Password Reset</h2>
          <Form>
            <Form.Group className='mb-3' controlId='email'>
              <Form.Control
                type='email'
                name='email'
                placeholder='Email'
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button className='w-100' onClick={handleSubmit}>
              Reset Password
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

export default ResetPassword
