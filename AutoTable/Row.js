import React from "react"
import PropTypes from "prop-types"

TableRow.propTypes = {
  rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  rowData: PropTypes.object.isRequired,
  rowOnClick: PropTypes.func,
  resolveCellValue: PropTypes.func,
  resolveClassName: PropTypes.func,
  cellOnClick: PropTypes.func,
}

export default function TableRow(props) {
  const resolvedClassName = props.resolveClassName(
    props.rowClassName,
    props.rowData
  )
  const hasRowClick = !!props.rowOnClick
  return (
    <tr
      key={`${props.id}_tr_${props.rowIndex}`}
      className={resolvedClassName}
      onClick={() => (hasRowClick ? props.rowOnClick(props.rowData) : null)}
      style={hasRowClick ? { cursor: "pointer" } : {}}
    >
      {props.columns.map((column, colIndex) => {
        const resolvedCellData = props.resolveCellValue(column, props.rowData)
        const resolvedCellClassName = props.resolveClassName(
          column.cellClassName,
          props.rowData
        )
        return (
          <td
            key={`${props.id}_td_${(props.rowIndex + 1) * colIndex}`}
            className={resolvedCellClassName}
            onClick={
              column.cellOnClick
                ? () =>
                    column.cellOnClick(props.rowData, column, resolvedCellData)
                : null
            }
          >
            {resolvedCellData}
          </td>
        )
      })}
      <style jsx>
        {`
          tr {
            padding-top: ${props.rowOnClick ? "pointer" : "default"};
          }
        `}
      </style>
    </tr>
  )
}
