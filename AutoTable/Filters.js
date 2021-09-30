import React from "react"
import { Input } from "reactstrap"

Filters.propTypes = {}

export default function Filters(props) {
  return (
    <tr>
      {props.columns.map((column, colIndex) => {
        const resolvedClassName = props.resolveClassName(
          column.headerClassName,
          column
        )
        // we don't allow filtering if the field value is a function without a filter value because
        // we don't want to try and filter on JSX
        if (
          column.filter === false ||
          (typeof column.fieldValue === "function" && !column.filterValue)
        )
          return <th key={`${props.id}_f_${colIndex}`}>&nbsp;</th>

        const colFilter = props.filter.find(
          filter => filter.columnTitle === column.title
        ) || { query: "" }
        return (
          <th key={`${props.id}_f_${colIndex}`} className={resolvedClassName}>
            <div>
              <Input
                type="text"
                value={colFilter.query}
                onChange={e => props.updateFilter(column.title, e.target.value)}
              />
              <i className="fas fa-filter" />
            </div>
            <style jsx>
              {`
                th {
                  padding-top: 0;
                }
                div {
                  position: relative;
                }
                .fa-filter {
                  position: absolute;
                  top: 0.6rem;
                  right: 0.5rem;
                  font-size: 1.25rem;
                  color: ${colFilter.query.length > 0 ? "#5d9f00" : "#dee2e6"};
                }
              `}
            </style>
          </th>
        )
      })}
    </tr>
  )
}
