import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TableData {
    headers: string[];
    rows: string[][];
}

interface TableBlockProps {
    id: string;
    content: string;
    onChange: (content: string) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    onFocus?: () => void;
}

const TableBlock = React.forwardRef<HTMLDivElement, TableBlockProps>(
    ({ id, content, onChange, onKeyDown, onFocus }, ref) => {
        const [tableData, setTableData] = useState<TableData>(() => {
            try {
                return JSON.parse(content) || { headers: [''], rows: [['']] };
            } catch {
                return { headers: [''], rows: [['']] };
            }
        });

        const updateTable = (newData: TableData) => {
            setTableData(newData);
            onChange(JSON.stringify(newData));
        };

        const addColumn = () => {
            const newHeaders = [...tableData.headers, ''];
            const newRows = tableData.rows.map(row => [...row, '']);
            updateTable({ headers: newHeaders, rows: newRows });
        };

        const addRow = () => {
            const newRow = new Array(tableData.headers.length).fill('');
            updateTable({
                headers: tableData.headers,
                rows: [...tableData.rows, newRow]
            });
        };

        const deleteColumn = (colIndex: number) => {
            const newHeaders = tableData.headers.filter((_, i) => i !== colIndex);
            const newRows = tableData.rows.map(row =>
                row.filter((_, i) => i !== colIndex)
            );
            updateTable({ headers: newHeaders, rows: newRows });
        };

        const deleteRow = (rowIndex: number) => {
            const newRows = tableData.rows.filter((_, i) => i !== rowIndex);
            updateTable({ headers: tableData.headers, rows: newRows });
        };

        const updateCell = (rowIndex: number, colIndex: number, value: string) => {
            if (rowIndex === -1) {
                // Update header
                const newHeaders = [...tableData.headers];
                newHeaders[colIndex] = value;
                updateTable({ ...tableData, headers: newHeaders });
            } else {
                // Update regular cell
                const newRows = [...tableData.rows];
                newRows[rowIndex] = [...newRows[rowIndex]];
                newRows[rowIndex][colIndex] = value;
                updateTable({ ...tableData, rows: newRows });
            }
        };

        return (
            <div
                className="w-full overflow-x-auto border rounded-lg dark:border-gray-700"
                ref={ref}
                onKeyDown={onKeyDown}
                onFocus={onFocus}
            >
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        {tableData.headers.map((header, colIndex) => (
                            <th key={colIndex} className="relative p-2 border dark:border-gray-700">
                                <input
                                    value={header}
                                    onChange={(e) => updateCell(-1, colIndex, e.target.value)}
                                    className="w-full bg-transparent focus:outline-none"
                                    placeholder="Header"
                                />
                                {tableData.headers.length > 1 && (
                                    <button
                                        onClick={() => deleteColumn(colIndex)}
                                        className="absolute -top-3 -right-3 p-1 text-red-500 opacity-0 hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {tableData.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="relative">
                            {row.map((cell, colIndex) => (
                                <td key={colIndex} className="p-2 border dark:border-gray-700">
                                    <input
                                        value={cell}
                                        onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                                        className="w-full bg-transparent focus:outline-none"
                                        placeholder="Cell"
                                    />
                                </td>
                            ))}
                            {tableData.rows.length > 1 && (
                                <button
                                    onClick={() => deleteRow(rowIndex)}
                                    className="absolute -left-3 top-1/2 transform -translate-y-1/2 p-1 text-red-500 opacity-0 hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="flex justify-end gap-2 p-2 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700">
                    <Button
                        onClick={addRow}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                    >
                        <Plus className="w-4 h-4" />
                        Add Row
                    </Button>
                    <Button
                        onClick={addColumn}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                    >
                        <Plus className="w-4 h-4" />
                        Add Column
                    </Button>
                </div>
            </div>
        );
    }
);

TableBlock.displayName = "TableBlock";

export default TableBlock;