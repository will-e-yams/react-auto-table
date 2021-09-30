import React from "react"
import AutoTable from "./AutoTable"
import { shallow } from "enzyme"
import { Button } from "reactstrap"
import moment from "moment"
import _ from "lodash"

const columns = [
  { title: "Sample Text", fieldValue: "text" },
  { title: "Sample Number", fieldValue: "number" },
  {
    title: "Sample Date",
    fieldValue: obj => moment(obj.date).format("MMMM DD, YYYY"),
  },
  {
    title: "Sample Button",
    fieldValue: obj => {
      return (
        <Button
          size="sm"
          color="light"
          onClick={() => this.toggleConfirmModal(obj)}
        >
          <i className={`fas fa-${obj.icon} text-${obj.color}`} />
          &nbsp;Confirm
        </Button>
      )
    },
    sort: false,
    filter: false,
  },
]

const rows = [
  {
    text: "Halvah gummies marzipan gummies",
    number: 75419,
    date: "2019-08-25T00:00:00",
    icon: "fish",
    color: "info",
  },
  {
    text: "Cookie donut carrot cake",
    number: 56789,
    date: "2019-10-01T00:00:00",
    icon: "frog",
    color: "success",
  },
  {
    text: "Toffee jelly beans chupa chups",
    number: 105943,
    date: "2019-03-05T00:00:00",
    icon: "dragon",
    color: "danger",
  },
]

describe("AutoTable tests", () => {
  let autoTableComponent
  _.uniqueId = jest.fn(() => "autotable_12345")

  beforeEach(() => {
    autoTableComponent = shallow(
      <AutoTable
        headThemeLight
        borderless
        sort
        filter
        columns={columns}
        rows={rows}
      />
    )
  })
  test("setup initial state", () => {
    expect(autoTableComponent.state()).toEqual({
      sortData: {
        columnTitle: "",
        direction: "asc",
      },
      id: "autotable_12345",
      filterData: [],
    })
  })

  test("setup initial state", () => {
    const initialSort = {
      columnTitle: "Sample Text",
      direction: "asc",
    }
    const initialFilter = [
      {
        columnTitle: "Sample Number",
        query: "gummies",
      },
    ]
    const newAutoTable = shallow(
      <AutoTable
        headThemeLight
        borderless
        sort
        filter
        columns={columns}
        rows={rows}
        defaultSort={initialSort}
        defaultFilter={initialFilter}
      />
    )
    expect(newAutoTable.state()).toEqual({
      sortData: {
        columnTitle: "Sample Text",
        direction: "asc",
      },
      id: "autotable_12345",
      filterData: [
        {
          columnTitle: "Sample Number",
          query: "gummies",
        },
      ],
    })
  })
})
