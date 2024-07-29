import { AbleColumn, AbleColumnGroup } from "../types/AbleColumn";
import { mapKeyedColumns } from "../utilities/mapKeyedColumns";

const testColumns: (AbleColumn<{}> | AbleColumnGroup<{}>)[] = [
  {
    header: "1",
    columns: [
      {
        header: "1A",
        columns: [
          {
            header: "1Aa",
            columns: [
              { header: "1Aa1", render: "" },
              { header: "1Aa2", render: "" },
              { header: "1Aa3", render: "" },
            ],
          },
          { header: "1Ab", render: "" },
          { header: "1Ac", render: "" },
        ],
      },
      { header: "1B", render: "" },
    ],
  },
  {
    header: "2",
    columns: [
      {
        header: "2A",
        columns: [
          { header: "2Aa", render: "" },
          { header: "2Ab", render: "" },
          { header: "2Ac", render: "" },
        ],
      },
      { header: "2B", render: "" },
    ],
  },
  { header: "3", render: "" },
  { header: "4", render: "" },
  {
    header: "5",
    columns: [
      {
        header: "5A",
        columns: [
          { header: "5Aa", render: "" },
          { header: "5Ab", render: "" },
        ],
      },
      { header: "5B", render: "" },
    ],
  },
];

const withHiddenColumns: (AbleColumn<{}> | AbleColumnGroup<{}>)[] = [
  {
    header: "1",
    columns: [
      {
        header: "1A",
        columns: [
          {
            header: "1Aa",
            columns: [
              { header: "1Aa1", render: "", hidden: true },
              { header: "1Aa2", render: "" },
              { header: "1Aa3", render: "" },
            ],
          },
          { header: "1Ab", render: "" },
          { header: "1Ac", render: "" },
        ],
      },
      { header: "1B", render: "" },
    ],
  },
  {
    header: "2",
    columns: [
      {
        header: "2A",
        hidden: true,
        columns: [
          { header: "2Aa", render: "" },
          { header: "2Ab", render: "" },
          { header: "2Ac", render: "" },
        ],
      },
      { header: "2B", render: "" },
    ],
  },
  { header: "3", render: "", hidden: true },
  { header: "4", render: "" },
  {
    header: "5",
    columns: [
      {
        header: "5A",
        columns: [
          { header: "5Aa", render: "" },
          { header: "5Ab", render: "" },
        ],
      },
      { header: "5B", render: "", hidden: true },
    ],
  },
];

describe("mapKeyedColumns", () => {
  it("maps the correct depth", () => {
    const keyedColumns = mapKeyedColumns(testColumns, true);
    const maxLevel = Math.max(...keyedColumns.map((c) => c.level));
    expect(maxLevel).toEqual(3);
  });

  it("maps the correct colspan", () => {
    const expectedColspans = [6, 4, 1, 1, 3];
    const keyedColumns = mapKeyedColumns(testColumns, true);
    const colspans = keyedColumns.map((c) => c.span);

    expect(colspans.length).toEqual(expectedColspans.length);

    colspans.forEach((span, i) => {
      expect(span).toEqual(expectedColspans[i]);
    });
  });

  it("maps the correct colspan with hidden columns", () => {
    const expectedColspans = [5, 1, 0, 1, 2];
    const keyedColumns = mapKeyedColumns(withHiddenColumns, true);
    const colspans = keyedColumns.map((c) => c.span);

    expect(colspans.length).toEqual(expectedColspans.length);

    colspans.forEach((span, i) => {
      expect(span).toEqual(expectedColspans[i]);
    });
  });
});
