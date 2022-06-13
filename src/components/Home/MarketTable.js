// https://v4.mui.com/components/tables/#sorting-amp-selecting

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
} from '@material-ui/core'

import MarketInfo from './MarketInfo'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const headCells = [
  {
    id: 'symbol',
    numeric: false,
    disablePadding: false,
    label: 'Symbol',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'coins',
    numeric: true,
    disablePadding: false,
    label: 'Total Coins',
  },
  {
    id: 'purchased_price',
    numeric: true,
    disablePadding: false,
    label: 'Purchased Price',
  },
  {
    id: 'current_price',
    numeric: true,
    disablePadding: false,
    label: 'Current Price',
  },
  {
    id: 'total_price',
    numeric: true,
    disablePadding: false,
    label: 'Total Price',
  },
  {
    id: 'change',
    numeric: true,
    disablePadding: false,
    label: 'Change',
  },
  {
    id: 'change_percent',
    numeric: true,
    disablePadding: false,
    label: 'Change Percent',
  },
]

function MarketTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

MarketTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}))

const MarketTable = ({ marketSummary }) => {
  const classes = useStyles()
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('createdAt')
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [dataPerPage, setDataPerPage] = useState(5)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeDataPerPage = (event) => {
    setDataPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event) => {
    setDense(event.target.checked)
  }

  const emptyRows =
    dataPerPage -
    Math.min(dataPerPage, marketSummary.length - page * dataPerPage)

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolbar>
          <Typography variant='h6' id='tableTitle' component='div'>
            Market Summary
          </Typography>
        </Toolbar>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby='tableTitle'
            size={dense ? 'small' : 'medium'}
            aria-label='enhanced table'
          >
            <MarketTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(marketSummary, getComparator(order, orderBy))
                .slice(page * dataPerPage, page * dataPerPage + dataPerPage)
                .map((data, index) => {
                  const labelId = `enhanced-table-${index}`
                  return (
                    <MarketInfo key={index} data={data} labelId={labelId} />
                  )
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={marketSummary.length}
          rowsPerPage={dataPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeDataPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label='Dense padding'
      />
    </div>
  )
}

export default MarketTable
