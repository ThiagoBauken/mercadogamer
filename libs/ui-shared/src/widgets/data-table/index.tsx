import styled from 'styled-components';
import { useTable } from 'react-table';
import { DataTableProps } from '@ui-shared/types/data-table';

const Container = styled.div`
  --mercado-data-table-height: ${({ height }) =>
    typeof height === 'string' ? height : `${height}px`};
`;

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  height = 'fit-content',
  className,
  LastElement,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <Container className={'mercado-data-table ' + (className || '')} height={height}>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, headerGroupIndex) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
              {headerGroup.headers.map((column, headerColumnIndex) => (
                <th
                  {...column.getHeaderProps({
                    style: {
                      minWidth: column.minWidth,
                      width: columns[headerColumnIndex]?.width ? column.width : 'auto',
                    },
                  })}
                  key={headerColumnIndex}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={rowIndex}>
                {row.cells.map((cell, cellIndex) => {
                  return (
                    <td {...cell.getCellProps()} key={cellIndex}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {LastElement && <LastElement />}
    </Container>
  );
};
