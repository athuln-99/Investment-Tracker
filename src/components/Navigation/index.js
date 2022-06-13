import React from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

import * as URI from '../../constants/uri'

import { useAuth } from '../../contexts/AuthContext'

const Navigation = () => {
  // Returns a function that lets you navigate programmatically
  const navigate = useNavigate()

  // deconstructing components defined in useContext hook
  const { currentUser, logout } = useAuth()

  // logout using firebase function and the navigate to the log in page
  const handleSignOut = () => {
    logout()
    navigate(URI.LOG_IN)
  }

  return (
    <Navbar
      collapseOnSelect
      bg='light'
      variant='light'
      expand='lg'
      className='container-fluid'
    >
      {currentUser ? ( // if user is logged in
        <>
          <Navbar.Brand>Investment Tracker</Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Nav justify className='mr-auto'>
            <Nav.Link to={URI.HOME} href={URI.HOME}>
              Home
            </Nav.Link>
          </Nav>
          <Button variant='outline-info' onClick={handleSignOut}>
            Sign Out
          </Button>
        </>
      ) : (
        // if user is not logged in yet
        <>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Brand>Investment Tracker</Navbar.Brand>
          <Nav className='mr-auto'>
            <Nav.Link as={Link} to={URI.LOG_IN} href={URI.LOG_IN}>
              Log In
            </Nav.Link>
          </Nav>
        </>
      )}
    </Navbar>
  )
}

export default Navigation
