import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { CSVLink } from 'react-csv';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Download } from 'lucide-react';

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      complete: (results) => {
        setHeaders(results.data[0]);
        setCsvData(results.data.slice(1));
      },
      header: false,
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleEdit = (rowIndex, colIndex, value) => {
    const newData = [...csvData];
    newData[rowIndex][colIndex] = value;
    setCsvData(newData);
  };

  const handleAddRow = () => {
    const newRow = new Array(headers.length).fill('');
    setCsvData([...csvData, newRow]);
  };

  const handleDeleteRow = (rowIndex) => {
    const newData = csvData.filter((_, index) => index !== rowIndex);
    setCsvData(newData);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">CSV Editor</h1>
      
      <div {...getRootProps()} className="border-2 border-dashed border-gray-400 rounded-lg p-8 mb-4 text-center cursor-pointer bg-gray-200 hover:bg-gray-300 transition-colors">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-gray-700">Drop the CSV file here ...</p>
        ) : (
          <p className="text-gray-700">Drag 'n' drop a CSV file here, or click to select a file</p>
        )}
      </div>

      {csvData.length > 0 && (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200">
                  {headers.map((header, index) => (
                    <TableHead key={index} className="text-gray-700">{header}</TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <TableCell key={colIndex} className="bg-gray-50">
                        <Input
                          value={cell}
                          onChange={(e) => handleEdit(rowIndex, colIndex, e.target.value)}
                          className="w-full bg-gray-50 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </TableCell>
                    ))}
                    <TableCell className="bg-gray-50">
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteRow(rowIndex)} className="bg-red-500 hover:bg-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-between">
            <Button onClick={handleAddRow} className="bg-gray-600 hover:bg-gray-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Row
            </Button>
            <CSVLink
              data={[headers, ...csvData]}
              filename="edited_data.csv"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-600 text-white hover:bg-gray-700 h-10 px-4 py-2"
            >
              <Download className="mr-2 h-4 w-4" /> Download CSV
            </CSVLink>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
