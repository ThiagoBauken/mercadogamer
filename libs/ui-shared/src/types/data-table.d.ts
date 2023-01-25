import { ReactComponentElement } from 'react';
import { Column } from 'react-table';

interface DataTableProps {
  height?: string | number;
  columns: Column[];
  data: any;
  className?: string;
  LastElement?: ReactComponentElement;
}
