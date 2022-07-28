import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Card } from 'primereact/card';

function CrudTable(props) {

    // empty Invoice
    let emptyInvoice = {
        "invoice-id": "",
        "fr-recn": "",
        "customer-id": "",
        "sac": [
            {
                "998313": "Consulting and support services(Export Services)"
            }
        ],
        "invoice-type": "Export",
        "invoice-date": "",
        "supply-place": "",
        "invoice-details": [
            {
                "sr-no": "",
                "description": "",
                "quantity": "",
                "rate": "",
                "currency": "",
                "value": ""
            }
        ],
        "total-value": "110",
        "discount": "",
        "cgst": "",
        "sgst": "",
        "igst": "",
        "ugst": "",
        "cess": "",
        "total-tax": "",
        "invoice-value-str": "one hundred ten only"
    }


    // states
    const [invoices, setInvoices] = useState([]);
    const [invoiceDialog, setInvoiceDialog] = useState(false);
    const [deleteInvoiceDialog, setDeleteInvoiceDialog] = useState(false);
    const [deleteInvoicesDialog, setDeleteInvoicesDialog] = useState(false);
    const [invoice, setInvoice] = useState(emptyInvoice);
    const [selectedInvoices, setSelectedInvoices] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [customerSelected, setCustomerSelected] = useState(null)
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        setInvoices([
            {
                "invoice-id": "",
                "fr-recn": "",
                "customer-id": "",
                "sac": [
                    {
                        "998313": "Consulting and support services(Export Services)"
                    }
                ],
                "invoice-type": "Export",
                "invoice-date": "",
                "supply-place": "",
                "invoice-details": [
                    {
                        "sr-no": "",
                        "description": "hello",
                        "quantity": "8",
                        "rate": "9",
                        "currency": "",
                        "value": ""
                    }
                ],
                "total-value": "110",
                "discount": "",
                "cgst": "",
                "sgst": "",
                "igst": "",
                "ugst": "",
                "cess": "",
                "total-tax": "",
                "invoice-value-str": "one hundred ten only"
            }
        ]);
    }, []);

    // functions
    const openNew = () => {
        setInvoice(emptyInvoice);
        setSubmitted(false);
        setInvoiceDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setInvoiceDialog(false);
    }

    const hideDeleteInvoiceDialog = () => {
        setDeleteInvoiceDialog(false);
    }

    const hideDeleteInvoicesDialog = () => {
        setDeleteInvoicesDialog(false);
    }



    const saveInvoice = () => {
        setSubmitted(true);
        // here is  a problem  that "name" is used
        // if (invoice.name.trim()) {
        let _invoice = { ...invoice };
        let _invoices = [...invoices ];
        //this for upadting invices
        if (invoice["invoice-id"]) {
            const index = findIndexById(invoice["invoice-id"])
            _invoices[index] = _invoice;  //here invoice gets inside invoices
            //delete below
            // fetch('/api/invoiceCRUD', {
            //     method: 'PUT',
            //     body: { invoice: JSON.stringify(_invoice), index: index }
            // })
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Invoice Updated', life: 3000 });
        }
        else {
                _invoice.id = createId();
                _invoice.image = 'invoice-placeholder.svg';
            _invoices.push(_invoice);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Invoice Created', life: 3000 });
        }
        console.log(_invoices,"_invoices")
        console.log(_invoice,"_invoice")
        setInvoices(_invoices)
        setInvoiceDialog(false);
        setInvoice(emptyInvoice);
        // }
    }



    // more functions
    const editInvoice = (invoice) => {
        setInvoice({ ...invoice });
        setInvoiceDialog(true);
    }

    const confirmDeleteInvoice = (invoice) => {
        setInvoice(invoice);
        setDeleteInvoiceDialog(true);
    }

    const deleteInvoice = () => {
        let _invoices = invoices.filter(val => val.id !== invoice.id);
        setInvoices(_invoices);
        // delete below
        // fetch('/api/invoiceCRUD', {
        //     method: 'DELETE',
        //     body: JSON.stringify([invoice])
        // })
        setDeleteInvoiceDialog(false);
        setInvoice(emptyInvoice);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Invoice Deleted', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < invoices.length; i++) {
            if (invoices[i]["invoice-id"] === id) {
                index = i;
                break;
            }
        }
        return index;
    }
    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }


    // selected invoices only can be deleted Together and these are the functions for it
    const confirmDeleteSelected = () => {
        setDeleteInvoicesDialog(true);
    }

    const deleteSelectedInvoices = () => {
        let _invoices = invoices.filter(val => !selectedInvoices.includes(val));
        setInvoices(_invoices);
      //  delete below
        // fetch('/api/invoiceCRUD', {
        //     method: 'DELETE',
        //     body: JSON.stringify(selectedInvoices)
        // })

        setDeleteInvoicesDialog(false);
        setSelectedInvoices(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Invoices Deleted', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _invoice = { ...invoice };
        _invoice["invoice-details"][0][`${name}`] = val;

        setInvoice(_invoice);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _invoice = { ...invoice };
        _invoice["invoice-details"][0][`${name}`] = val;

        setInvoice(_invoice);
    }

    // body templates

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedInvoices || !selectedInvoices.length} />
            </React.Fragment>
        )
    }

    // pencil edit button
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editInvoice(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteInvoice(rowData)} />
            </React.Fragment>
        );
    }

    // header
    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Invoice Manager</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    // Dialog footer
    const invoiceDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveInvoice} />
        </React.Fragment>
    );
    const deleteInvoiceDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteInvoiceDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteInvoice} />
        </React.Fragment>
    );
    const deleteInvoicesDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteInvoicesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedInvoices} />
        </React.Fragment>
    );

    const card =(
        <React.Fragment>
             <Card style={{display:`${customerSelected?"block":"none"}`}}
                title={customerSelected?customerSelected["user-name"]:"no customer selected"}
                subTitle={customerSelected&&customerSelected["client-name"]}>
                {customerSelected&&customerSelected["address1"]} <br />
                {customerSelected&&customerSelected["address2"]} <br />
                billing type:{customerSelected&&customerSelected["billing-type"]}
            </Card>  
        </React.Fragment>
    )

    // column map
    const columns = [
        { field: "invoices-details"[0].description, header: "Description" },
        { field: "invoices-details"[0].currency, header: "Currency" },
        { field: "invoices-details"[0].quantity, header: "Quantity" },
        { field: "invoices-details"[0].rate, header: "Rate" },
        { field: "invoices-details"[0].value, header: "Value" },
    ];

    const dynamicColumns = columns.map((col, i) => {
        return <Column key={col.field} field={col.field} header={col.header} />;
    });

    return (
        <div>
            <div className="field" style={{display:"grid", gridTemplate:"50px 50px 50px", gap:"3px"}}>
                <label style={{marginLeft:"7px"}} htmlFor="customer"> Customer Details</label>
                <Dropdown style={{ width: "200px", hieght: "50px" }} value={customerSelected} optionLabel="client-name" options={props.customers} onChange={(e) => { setCustomerSelected(e.value); console.log(customerSelected, "customerSelected by form in new button") }} placeholder="Select a customer" />
                 {(customerSelected)?card:"NO CUSTOMER SELECTED"}        
            </div>
            <div className="datatable-crud-demo">
                <Toast ref={toast} />

                <div className="card">
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={invoices} selection={selectedInvoices} onSelectionChange={(e) => { setSelectedInvoices(e.value); console.log(e, "eee") }}
                        dataKey="invoice-id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} invoices"
                        globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                        {dynamicColumns}
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                </div>



                <Dialog visible={invoiceDialog} style={{ width: '450px' }} header="Invoice Details" modal className="p-fluid" footer={invoiceDialogFooter} onHide={hideDialog}>
                    {/* {product.image && <img src={`images/product/${product.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={product.image} className="product-image block m-auto pb-3" />} */}

                    <div className="field">
                        <label htmlFor="description">Description</label>
                        <InputTextarea id="description" value={invoice["invoice-details"][0].description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                    </div>

                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="rate">Rate</label>
                            <InputNumber id="rate" value={invoice["invoice-details"][0].rate} onValueChange={(e) => onInputNumberChange(e, 'rate')} mode="currency" currency="USD" locale="en-US" />
                        </div>
                        <div className="field col">
                            <label htmlFor="quantity">Quantity</label>
                            <InputNumber id="quantity" value={invoice["invoice-details"][0].quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} integeronly />
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={deleteInvoiceDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteInvoiceDialogFooter} onHide={hideDeleteInvoiceDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {invoice && <span>Are you sure you want to delete <b>{invoice['invoice-id']}</b>?</span>}
                    </div>
                </Dialog>

                <Dialog visible={deleteInvoicesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteInvoicesDialogFooter} onHide={hideDeleteInvoicesDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {invoice && <span>Are you sure you want to delete the selected invoices?</span>}
                    </div>
                </Dialog>
            </div>
        </div>
    )
}
export default CrudTable
