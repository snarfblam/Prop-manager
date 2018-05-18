/*
    Table component to display a list of objects.

    Props:
        data: {
            columns: {              - Array of columns
                name: string,       - Name of property to read from each object
                label: string       - Label to display in the table header
            } [],
            items: {                - Array of objects to display as rows
                *: any              - Properties references by column names. Should be string or react element
            } []
        }
        transform?: function(colName, value)
                                    - Optional function to transform values displayed
*/

import React from 'react';
import './Table.css';

export default props => (
    <div className='table-cmp-container'>
        <table className='table-cmp'>
            <thead>
                <tr>
                    {props.data.columns.map((column, i) => (
                        <th key={i}>
                            {column.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {props.data.items.map((row, i) => (
                    <tr key={i}>
                        {props.data.columns.map((column, i) => (
                            <td key={i}>
                                {
                                    props.transform ? (
                                        props.transform(column.name, row[column.name])
                                    ): (
                                        row[column.name] || ''
                                    )
                                }
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
