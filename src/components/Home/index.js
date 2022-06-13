import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Container,
  Col,
  Row,
  ListGroup,
  Button,
  Modal,
  Form,
} from 'react-bootstrap'

import MarketTable from './MarketTable'

import { useFirebase } from '../../contexts/FirebaseContext'
import { useAuth } from '../../contexts/AuthContext'

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [marketSummary, setMarketSummary] = useState([])
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState([])
  const [data, setData] = useState()
  const [show, setShow] = useState(false)
  const [purchasedPrice, setPurchasedPrice] = useState()
  const [coins, setCoins] = useState()

  // deconstructing components defined in useContext hook
  const { addData, getData, updateData, getAllData } = useFirebase()
  const { currentUser } = useAuth()

  // useEffect runs after every render
  // it first sets loading to true, but after the fetching is complete, it sets loading to false
  useEffect(() => {
    setLoading(true)
    fetchMarketSummary()
    setLoading(false)
  }, [])

  // retrieves the current user's favorites from the database
  // parameter data is the coins data retrieved from making the API call
  const fetchFavorites = async (data) => {
    const querySnapshot = await getAllData(currentUser.uid) // firebase function that retrieves data using the current user's id

    let tempArray = []

    // iterate through all retrieved documents
    await querySnapshot.forEach((doc) => {
      const currency = doc.data() // access document data

      // creates a new array with all elements that has the same id as the current document's id
      // this array will always have one element since id is unique
      // that element can be accessed by index 0
      const filtered = data.filter(({ id }) => currency.id === id)

      // temporary object that stores current currency
      let temp = {}

      // these data are retrieved from the database
      temp['purchased_price'] = currency['purchasedPrice']
      temp['coins'] = currency['totalCoins']
      temp['total_price'] = currency['totalPrice']

      // these data are retrieved from the api call
      temp['symbol'] = filtered[0]['symbol']
      temp['name'] = filtered[0]['name']
      temp['current_price'] = filtered[0]['current_price']

      // change and change percent are calculated by using data from both database and api call
      temp['change'] = temp['current_price'] - temp['purchased_price']
      temp['change_percent'] = (
        ((temp['current_price'] - temp['purchased_price']) /
          temp['current_price']) *
        100
      ).toFixed(5) // rounds the number to a 5 number of decimals

      tempArray.push(temp) // push the temporary object to the array
    })

    setFavorites(tempArray) // set array as favorites
  }

  // makes an API call by GET HTTP request
  const fetchMarketSummary = async () => {
    // Use this to obtain all the coins market data (price, market cap, volume)
    var options = {
      method: 'GET',
      url: 'https://api.coingecko.com/api/v3/coins/markets',
      params: {
        vs_currency: 'eur',
        order: 'market_cap_desc',
        per_page: '250',
        page: '1',
        sparkline: 'false',
      },
    }

    // make HTTP request with axios
    // set the data provided as market summary and call fetchFavorites function to retrieve user's stored favorites
    await axios
      .request(options)
      .then((response) => {
        setMarketSummary(response.data)
        fetchFavorites(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // sets data as search
  const handleSearch = (data) => {
    setSearch(data)
  }

  // set show to false
  // closes the modal
  const handleClose = () => {
    setShow(false)
  }

  // set show to true
  // set data as data
  // opens the modal
  const handleShow = (data) => {
    setShow(true)
    setData(data)
  }

  // this function handles when 'save changes' button is clicked
  const handleSubmit = async () => {
    // saves the typed-in data to 'data' object
    data['purchased_price'] = purchasedPrice
    data['coins'] = coins
    data['total_price'] = purchasedPrice * coins
    data['change'] = data['current_price'] - purchasedPrice
    data['change_percent'] = (
      ((data['current_price'] - purchasedPrice) / data['current_price']) *
      100
    ).toFixed(5)

    // retrieve documents that have the same id as the selected currency from the database
    // there will be max 1 document retrieved from the database since currency id is unique
    const querySnapshot = await getData(data['id'], currentUser.uid)

    // checks if any documents were retrieved from the database
    // if none, add a document with data
    // otherwise, update the document with new data
    if (querySnapshot.empty) {
      addData(
        data['id'],
        data['coins'],
        data['purchased_price'],
        data['total_price'],
        currentUser.uid
      )
    } else {
      updateData(
        data['id'],
        data['coins'],
        data['purchased_price'],
        data['total_price'],
        currentUser.uid
      )
    }

    // creates a new array with all elements that has the same name as the selected currency's name
    // this array will always have one element since id is unique
    // that element can be accessed by index 0
    const filtered = favorites.filter(({ name }) => data['name'] === name)
    const idx = favorites.indexOf(filtered[0]) // index of filtered element

    let newList = favorites // copy array

    // if filtered array is empty, then push new element to array
    // otherwise, replace the data with new data
    if (filtered.length == 0) {
      newList = favorites.concat(data)
    } else {
      newList[idx] = data
    }

    setFavorites(newList) // set newList as favorites
    handleClose() // close modal
  }

  return (
    <Container>
      <br></br>
      <Row>
        <Col>
          <div>
            <input
              type='text'
              placeholder='Search...'
              className='search'
              onChange={(e) => handleSearch(e.target.value)}
            />
            {search !== '' && ( // show only if search is not an empty string
              <ListGroup className='overflow-auto' style={{ height: '550px' }}>
                {marketSummary && // perform only if marketSummary is already retrieved
                  marketSummary
                    .filter((currency) =>
                      currency.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((currency) => (
                      <ListGroup.Item
                        action
                        key={currency.id}
                        className='listCurrency'
                        onClick={() => handleShow(currency)}
                      >
                        {currency.name}
                      </ListGroup.Item>
                    ))}
              </ListGroup>
            )}
          </div>
        </Col>
        <Col>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <MarketTable marketSummary={favorites} />
          )}
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{data && data.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3' controlId='formPurchasedPrice'>
              <Form.Label>Purchased Price for 1 coin</Form.Label>
              <Form.Control
                type='number'
                placeholder='e.g. 12.5'
                onChange={(e) => setPurchasedPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='formNumberOfCoins'>
              <Form.Label>Total number of coins</Form.Label>
              <Form.Control
                type='number'
                placeholder='e.g. 1'
                onChange={(e) => setCoins(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary' onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Home
