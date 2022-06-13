import React from 'react'
import { TableCell, TableRow } from '@material-ui/core'

// each table row
const MarketInfo = ({ data, labelId }) => {
  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell align='left' component='th' id={labelId} scope='row'>
          {data.symbol}
        </TableCell>
        <TableCell align='left'>{data.name}</TableCell>
        <TableCell align='right'>{data.coins}</TableCell>
        <TableCell align='right'>{data.purchased_price}</TableCell>
        <TableCell align='right'>{data.current_price}</TableCell>
        <TableCell align='right'>{data.total_price}</TableCell>
        <TableCell align='right'>{data.change}</TableCell>
        <TableCell align='right'>{data.change_percent}</TableCell>
      </TableRow>
    </>
  )
}

export default MarketInfo
