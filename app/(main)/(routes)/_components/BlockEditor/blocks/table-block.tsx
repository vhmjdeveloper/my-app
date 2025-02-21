import React, { useEffect, useRef } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.min.css';
import { HyperFormula } from 'hyperformula';

// Registrar todos los módulos y el idioma español de Handsontable
registerAllModules();

// Registrar el idioma español
import { registerLanguageDictionary } from 'handsontable/i18n';
import esMX from 'handsontable/i18n/languages/es-MX';
registerLanguageDictionary(esMX);

// Configuración de HyperFormula
const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: 'internal-use-in-handsontable',
});

interface TableBlockProps {
    id: string;
    content: string;
    onChange: (content: string) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    onFocus?: () => void;
}

interface TableData {
    data: (string | number | null)[][];
    colHeaders: boolean;
    rowHeaders: boolean;
    formulas: boolean;
    settings?: Record<string, unknown>;
}

const TableBlock = React.forwardRef<HTMLDivElement, TableBlockProps>(
    ({ id, content, onChange, onKeyDown, onFocus }, ref) => {
        const hotRef = useRef<Handsontable | null>(null);

        const defaultData: TableData = {
            data: [
                ['', '', ''],
                ['', '', ''],
                ['', '', ''],
            ],
            colHeaders: true,
            rowHeaders: true,
            formulas: true,
            settings: {},
        };

        // Parsear el contenido inicial
        const initialData = React.useMemo(() => {
            try {
                return JSON.parse(content) || defaultData;
            } catch {
                return defaultData;
            }
        }, [content]);

        // Configuración de la tabla
        const tableSettings: Handsontable.GridSettings = {
            data: initialData.data,
            colHeaders: initialData.colHeaders,
            rowHeaders: initialData.rowHeaders,
            height: 'auto',
            width: '100%',
            licenseKey: 'non-commercial-and-evaluation',
            language: 'es-MX',
            locale: 'es-MX', // Para la configuración regional
            contextMenu: {
                items: {
                    row_above: { name: 'Insertar fila arriba' },
                    row_below: { name: 'Insertar fila abajo' },
                    col_left: { name: 'Insertar columna izquierda' },
                    col_right: { name: 'Insertar columna derecha' },
                    separator1: { name: '---------' },
                    remove_row: { name: 'Eliminar fila' },
                    remove_col: { name: 'Eliminar columna' },
                    separator2: { name: '---------' },
                    copy: { name: 'Copiar' },
                    cut: { name: 'Cortar' },
                    separator3: { name: '---------' },
                    alignment: { name: 'Alineación' },
                    separator4: { name: '---------' },
                    clear_formula: {
                        name: 'Limpiar fórmula',
                        callback: function(this: Handsontable) {
                            const range = this.getSelectedRange();
                            if (range && range[0]) {
                                const { from, to } = range[0];
                                for (let row = from.row; row <= to.row; row++) {
                                    for (let col = from.col; col <= to.col; col++) {
                                        this.setDataAtCell(row, col, '');
                                    }
                                }
                            }
                        },
                    },
                },
            },
            minSpareRows: 1,
            minSpareCols: 1,
            stretchH: 'all',
            className: 'htDark',
            formulas: {
                engine: hyperformulaInstance,
            },
            cells() {
                return {
                    type: 'numeric',
                    numericFormat: {
                        pattern: '0,0.00',
                        culture: 'es-MX', // Para el formato de números
                    },
                };
            },
            afterChange: (changes: Handsontable.CellChange[] | null) => {
                if (!changes) return;

                const hot = hotRef.current;
                if (!hot) return;

                const newData = {
                    data: hot.getData(),
                    colHeaders: initialData.colHeaders,
                    rowHeaders: initialData.rowHeaders,
                    formulas: true,
                    settings: {
                        ...initialData.settings,
                    },
                };

                onChange(JSON.stringify(newData));
            },
            beforeKeyDown: (event: KeyboardEvent) => {
                const hot = hotRef.current;
                if (!hot) return;

                // Obtener la celda seleccionada actual
                const selectedCell = hot.getSelected()?.[0];
                if (!selectedCell) return;

                const [row, col] = selectedCell;
                const totalRows = hot.countRows();
                const isFirstRow = row === 0;
                const isLastRow = row === totalRows - 1;

                // Manejar la navegación con flechas
                if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    // Si estamos en la primera fila y vamos hacia arriba, o
                    // en la última fila y vamos hacia abajo, permitir la propagación
                    if ((event.key === 'ArrowUp' && !isFirstRow) ||
                        (event.key === 'ArrowDown' && !isLastRow)) {
                        event.stopPropagation();
                    }
                }

                // Manejar el Enter para fórmulas
                if (event.key === 'Enter' && !event.shiftKey) {
                    const value = hot.getDataAtCell(row, col);
                    if (typeof value === 'string' && value.startsWith('=')) {
                        event.stopImmediatePropagation();
                    }
                }
            },
        };

        // Efecto para ajustar el tema oscuro
        useEffect(() => {
            const handleThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
                const isDark = e.matches;
                const hot = hotRef.current;
                if (hot) {
                    const element = hot.rootElement;
                    if (element) {
                        element.classList.toggle('htDark', isDark);
                    }
                }
            };

            const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
            handleThemeChange(darkModeMedia);
            darkModeMedia.addListener(handleThemeChange);

            return () => darkModeMedia.removeListener(handleThemeChange);
        }, []);

        return (
            <div
                ref={ref}
                className="w-full my-4 border rounded-lg dark:border-gray-700 overflow-hidden"
                onKeyDown={onKeyDown}
                onFocus={onFocus}
            >
                <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                        Tip: Usa = para comenzar una fórmula. Ejemplo: =SUM(A1:A5)
                    </span>
                </div>
                <div className="p-2">
                    <HotTable
                        ref={(el) => {
                            if (el) {
                                hotRef.current = el.hotInstance;
                            }
                        }}
                        settings={tableSettings}
                        className="dark:bg-gray-800"
                    />
                </div>
            </div>
        );
    }
);

TableBlock.displayName = 'TableBlock';

export default TableBlock;