import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function Table({ invoices }) {


  const columns = [
    { field: "invoice-id", header: "Invoice No." },
    { field: "Customer Name", header: "Customer Name" },
    { field: "Company Name", header: "Company Name" },
    { field: "invoice-date", header: "Invoice Date" },
    { field: "Due Date", header: "Due Date" },
    { field: "Amount", header: "Amount" }
  ];

  const dynamicColumns = columns.map((col, i) => {
    console.log(col, "colcol", i);
    const { field, header } = col;
    return <Column key={field} field={field} header={header} />;
  });

  return (
    <div>
      <div className="card">
        <DataTable style={{ marginTop: "5px" }} value={invoices} responsiveLayout="scroll">
          {dynamicColumns}
        </DataTable>
      </div>
    </div>
  );
}
// export async function getServerSideProps(){
//     //fetch data from mdb
//     return {
//         props:{
//             data: MOCK_DATA
//         }
//     };
// }
