import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Alert } from 'reactstrap'
import AutoTableLayout from './AutoTableLayout'
import Json2csvParser from 'json2csv'
import { saveAs } from 'file-saver'

class AutoTable extends React.Component {
  static propTypes = {
    //styles: PropTypes.shape({
    dark: PropTypes.bool,
    bordered: PropTypes.bool,
    borderless: PropTypes.bool,
    size: PropTypes.string,
    hover: PropTypes.bool,
    striped: PropTypes.bool,
    //}),
    export: PropTypes.bool,
    title: PropTypes.string,
    sort: PropTypes.bool,
    filter: PropTypes.bool,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        fieldValue: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
          .isRequired,
        sort: PropTypes.bool,
        filter: PropTypes.bool,
        sortValue: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        filterValue: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        headerClassName: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.func,
        ]),
        cellClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        cellOnClick: PropTypes.func,
      }),
    ).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    rowOnClick: PropTypes.func,
    defaultSort: PropTypes.shape({
      columnTitle: PropTypes.string.isRequired,
      direction: PropTypes.oneOf(['asc', 'desc']).isRequired,
    }),
    defaultFilter: PropTypes.arrayOf(
      PropTypes.shape({
        columnTitle: PropTypes.string.isRequired,
        query: PropTypes.string.isRequired,
      }),
    ),
  }
  static defaultProps = {
    sort: false,
    export: false,
    filter: false,
    defaultSort: {
      columnTitle: '',
      direction: 'asc',
    },
    defaultFilter: [],
  }

  constructor(props) {
    super(props)

    this.state = {
      id: _.uniqueId('autotable_'),
      sortData: { ...props.defaultSort },
      filterData: [...props.defaultFilter],
    }
  }

  onToggleSort = columnTitle => {
    const sortData = { ...this.state.sortData }
    let { direction } = sortData || {}
    direction = direction === 'asc' ? 'desc' : 'asc'
    this.setState({ sortData: { columnTitle, direction } })
  }

  updateFilter = (columnTitle, query) => {
    const filterData = [...this.state.filterData]
    let found = false
    for (let i = 0; i < filterData.length; i++) {
      if (filterData[i].columnTitle === columnTitle) {
        filterData[i].query = query
        found = true
        break
      }
    }
    if (!found) filterData.push({ columnTitle: columnTitle, query: query })
    this.setState({ filterData })
  }

  getRows = () => {
    const { sortData, filterData } = this.state
    const { columns, rows = [] } = this.props
    const enableFilter = this.props.filter && rows.length > 1
    const enableSort = this.props.sort && rows.length > 1
    if (rows.length === 0) return []
    let result = []
    if (enableFilter && filterData.length > 0) {
      result = _.cloneDeep(rows) // don't mutate the rows collection
      result = this.filterRows(result)
    } else {
      result = rows
    }
    if (enableSort && sortData.columnTitle) {
      const col = columns.find(c => c.title === sortData.columnTitle)
      if (!col) return result
      const sortingValue = row => this.resolveSortValue(col, row)
      result = _.orderBy(result, sortingValue, [sortData.direction])
    }
    return result || []
  }

  filterRows = rows => {
    const { filterData } = this.state
    for (let i = 0; i < filterData.length; i++) {
      rows = this.filterApply(filterData[i], rows)
    }
    return rows
  }

  filterApply = (filter, rows) => {
    if (!filter.columnTitle && !filter.query) return rows
    const { columns } = this.props
    const column = columns.find(c => c.title === filter.columnTitle)
    if (column) {
      const expression = new RegExp(RegExp.escape(filter.query), 'i')
      return _.filter(rows, row => {
        const filterValue = this.resolveFilterValue(column, row)
        const match = expression.test(filterValue)
        return match
      })
    } else console.warn(`column ${filter.columnTitle} not found`)
    return rows
  }

  resolveClassName = (className, datum) => {
    try {
      const result =
        typeof className === 'function' ? className(datum) : className
      return result || ''
    } catch (err) {
      console.error('Problem interpreting className', className, datum, err)
    }
  }

  resolveCellValue = (column, datum) => {
    try {
      const { fieldValue } = column
      const result =
        typeof fieldValue === 'function' ? fieldValue(datum) : datum[fieldValue]
      if (typeof result === 'string') return result || ''
      else return result
    } catch (err) {
      console.error('Problem interpreting fieldValue', column.title, datum, err)
    }
  }

  resolveFilterValue = (column, datum) => {
    try {
      const { filterValue } = column
      let filterResult
      if (!filterValue) {
        filterResult = this.resolveCellValue(column, datum)
      } else {
        filterResult =
          typeof filterValue === 'function'
            ? filterValue(datum)
            : datum[filterValue]
      }

      return typeof filterResult === 'string' ||
        typeof filterResult === 'number'
        ? filterResult
        : ''
    } catch (err) {
      console.error(
        'Problem interpreting filterValue',
        column.title,
        datum,
        err,
      )
    }
  }

  resolveSortValue = (column, datum) => {
    try {
      const { sortValue } = column
      if (!sortValue) return this.resolveCellValue(column, datum)

      const result =
        typeof sortValue === 'function' ? sortValue(datum) : datum[sortValue]
      if (typeof result === 'string') return result || ''
      else return result
    } catch (err) {
      console.error('Problem interpreting sortValue', column.title, datum, err)
    }
  }

  exportToCsv = () => {
    try {
      const csv = Json2csvParser.parse(this.getRows())
      const blob = new Blob([csv], {
        type: 'text/plain;charset=utf-8',
      })
      saveAs(blob, `${this.props.title}.csv`)
    } catch (err) {
      console.error(err)
    }
  }

  render = () => {
    const styles = {
      dark: this.props.dark,
      bordered: this.props.bordered,
      borderless: this.props.borderless,
      size: this.props.size,
      hover: this.props.hover,
      striped: this.props.striped,
    }
    const { dark, columns = [], filter, rows } = this.props
    const theadClassName = dark ? 'thead-dark' : 'thead-light'
    const enableFilter = filter && rows.length > 1
    const sortedRows = this.getRows()
    if (columns.length === 0)
      return <Alert color="warning">No columns specified</Alert>

    return (
      <AutoTableLayout
        columns={columns}
        sortedRows={sortedRows}
        theadClassName={theadClassName}
        enableFilter={enableFilter}
        resolveClassName={this.resolveClassName}
        onToggleSort={this.onToggleSort}
        resolveCellValue={this.resolveCellValue}
        updateFilter={this.updateFilter}
        rowOnClick={this.props.rowOnClick}
        rowClassName={this.props.rowClassName}
        filterData={this.state.filterData}
        sortData={this.state.sortData}
        styles={styles}
        sort={this.props.sort}
        id={this.state.id}
        export={this.props.export}
        title={this.props.title}
        exportToCsv={this.exportToCsv}
      />
    )
  }
}
export default AutoTable
