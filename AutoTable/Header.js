import React from "react"
import PropTypes from "prop-types"
import Arrow from "./Arrow"

Header.propTypes = {
  columns: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  sort: PropTypes.bool.isRequired,
  sortData: PropTypes.object.isRequired,
  resolveClassName: PropTypes.func.isRequired,
  onToggleSort: PropTypes.func.isRequired,
}

export default function Header(props) {
  return (
    <tr>
      {props.columns.map((column, colIndex) => {
        const resolvedClassName = props.resolveClassName(
          column.headerClassName,
          column
        )
        let isSorted = false
        const canSort = props.sort && column.sort !== false && column.title
        if (canSort) {
          isSorted = props.sortData.columnTitle === column.title
        }

        return (
          <th
            key={`${props.id}_th_${colIndex}`}
            className={resolvedClassName}
            onClick={() => {
              if (canSort) props.onToggleSort(column.title)
            }}
          >
            {column.title}
            {props.sort && column.sort !== false && (
              <span className="sort-controls">
                <Arrow
                  active={isSorted && props.sortData.direction === "asc"}
                  direction="up"
                />
                <Arrow
                  active={isSorted && props.sortData.direction === "desc"}
                  direction="down"
                />
              </span>
            )}
            <style jsx>
              {`
                th {
                  padding-right: 1.75rem;
                  position: relative;
                  cursor: ${props.sort && column.sort !== false
                    ? "pointer"
                    : "default"};
                }

                .sort-controls {
                  position: absolute;
                  right: 0.75rem;
                  white-space: nowrap;
                }
              `}
            </style>
          </th>
        )
      })}
    </tr>
  )
}
