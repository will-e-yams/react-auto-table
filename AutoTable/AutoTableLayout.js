import React from 'react'
import PropTypes from 'prop-types'
import { Row, Button, Table } from 'reactstrap'
import Header from './Header'
import TableRow from './Row'
import Filters from './Filters'

AutoTableLayout.propTypes = {
  columns: PropTypes.array.isRequired,
  sortedRows: PropTypes.array.isRequired,
  theadClassName: PropTypes.string.isRequired,
  enableFilter: PropTypes.bool.isRequired,
  resolveClassName: PropTypes.func.isRequired,
  onToggleSort: PropTypes.func.isRequired,
  resolveCellValue: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
  rowOnClick: PropTypes.func,
  rowClassName: PropTypes.string,
  filterData: PropTypes.array.isRequired,
  sortData: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
  sort: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
}

export default function AutoTableLayout(props) {
  return (
    <div style={{ width: '100%' }}>
      {(props.export || props.title) && (
        <Row className="d-flex m-2">
          {props.title && (
            <h3 className="d-flex align-items-center mr-auto mb-0">
              {props.title}
            </h3>
          )}
          {props.export && (
            <Button
              outline
              color="secondary"
              onClick={props.exportToCsv}
              className="ml-auto"
            >
              <i className="fas fa-file-excel" />
              &nbsp;Export to CSV
            </Button>
          )}
        </Row>
      )}
      <Table {...props.styles}>
        <thead className={props.theadClassName}>
          <Header
            columns={props.columns}
            id={props.id}
            sort={props.sort && props.sortedRows.length > 1}
            sortData={props.sortData}
            resolveClassName={props.resolveClassName}
            onToggleSort={props.onToggleSort}
          />
          {props.enableFilter && (
            <Filters
              columns={props.columns}
              filter={props.filterData}
              id={props.id}
              resolveClassName={props.resolveClassName}
              updateFilter={props.updateFilter}
            />
          )}
        </thead>
        <tbody>
          {props.sortedRows.map((row, rowIndex) => (
            <TableRow
              rowData={row}
              id={props.id}
              key={rowIndex}
              columns={props.columns}
              rowIndex={rowIndex}
              rowOnClick={props.rowOnClick}
              rowClassName={props.rowClassName}
              resolveCellValue={props.resolveCellValue}
              resolveClassName={props.resolveClassName}
            />
          ))}
        </tbody>
      </Table>
      <style jsx>
        {`
          .table {
            margin-bottom: 0;
          }
        `}
      </style>
    </div>
  )
}
