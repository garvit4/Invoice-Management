import React, { useState, useRef } from 'react';
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
    let skeletalInvoice = {
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

    // empty Invoice
    let emptyInvoice =
    {
        "id": "",
        "sr-no": "",
        "description": "",
        "quantity": "",
        "rate": "",
        "currency": 0,
        "value": ""
    }

    // states
    const [completeInvoices, setCompleteInvoices] = useState([])
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

    // invoice date and number
    const today = new Date();
    let max = 0;
    props.invoices.map((invoice) => invoice["invoice-id"] > max && (max = (invoice["invoice-id"] + 1)))
    const allFields = [
        {
            name: "Invoice Number",
            key: 'invoiceNo',
            type: 'text',
            value: max
        },
        {
            name: "Invoice Date",
            key: 'invoiceDate',
            type: 'date',
            value: today.toLocaleDateString
        }
    ]


    // functions
    function fillClientIds() {
        let customerId = customerSelected["client-id"];
        let _completeInvoices = [...completeInvoices];
        _completeInvoices.map(CI => CI["customer-id"] = customerId);
        setCompleteInvoices(_completeInvoices)
    }

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
        let _invoice = { ...invoice };
        let _invoices = [...invoices];
        let _skeletalInvoice = skeletalInvoice
        let _completeInvoices = [...completeInvoices];
        if (invoice.id) {
            const index = findIndexById(_invoice.id)
            _invoices[index] = _invoice;
            _skeletalInvoice["invoice-details"][0] = _invoice;
            _completeInvoices[index] = _skeletalInvoice
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Invoice Updated', life: 3000 });
        }
        else {
            _invoice.id = createId();
            _invoices.push(_invoice);
            _skeletalInvoice["invoice-details"][0] = _invoice;
            _completeInvoices.push(_skeletalInvoice);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Invoice Created', life: 3000 });
        }
        console.log(_invoices, "_invoices")
        console.log(_invoice, "_invoice")
        setInvoices(_invoices)
        setInvoiceDialog(false);
        setInvoice(emptyInvoice);
    }



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
        setDeleteInvoiceDialog(false);
        setInvoice(emptyInvoice);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Invoice Deleted', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < invoices.length; i++) {
            if (invoices[i].id === id) {
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


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _invoice = { ...invoice };
        _invoice[`${name}`] = val;
        setInvoice(_invoice);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _invoice = { ...invoice };
        _invoice[`${name}`] = val;
        _invoice.value = _invoice.quantity * _invoice.rate;


        setInvoice(_invoice);
    }

    // body templates

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="CREATE" icon="pi pi-check" iconPos="right" /*onClick={clickHandler}*/ /*bigfetch ka logic*/ />
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


    const card = (
        <React.Fragment>
            <Card style={{ display: `${customerSelected ? "block" : "none"}` }}
                title={customerSelected ? customerSelected["user-name"] : "no customer selected"}
                subTitle={customerSelected && customerSelected["client-name"]}>
                {customerSelected && customerSelected["address1"]} <br />
                {customerSelected && customerSelected["address2"]} <br />
                billing type:{customerSelected && customerSelected["billing-type"]}
            </Card>
        </React.Fragment>
    )

    // column map
    const columns = [
        { field: "sr-no", header: "Serial Number" },
        { field: "description", header: "Description" },
        { field: "quantity", header: "Quantity" },
        { field: "currency", header: "Currency" },
        { field: "rate", header: "Rate" },
        { field: "value", header: "Value" },
    ];

    const dynamicColumns = columns.map((col, i) => {
        return <Column key={col.field} field={col.field} header={col.header} />;
    });

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between" }} >
                <div className="field" style={{ display: "grid", gridTemplate: "50px /100px 100px ", gap: "3px" }}>
                    <label style={{ marginLeft: "7px" }} htmlFor="customer"> Customer Details</label>
                    <Dropdown style={{ width: "300px", hieght: "50px" }} value={customerSelected} optionLabel="client-name"
                        options={props.customers}
                        onChange=
                        {(e) => { setCustomerSelected(e.value, () => { skeletalInvoice['customer-id'] = customerSelected["client-id"]; fillClientIds() }); console.log(customerSelected, "customerSelected by form in new button") }} placeholder="Select a customer" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    {allFields.map((item, index) => {
                        return (
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px" }} key={index}>
                                <label htmlFor="in" style={{ padding: "10px" }}>{item.name}</label>
                                <InputText id={item.key} style={{ maxWidth: "150px" }} name={item.key} value={item.value} type={item.type} onChange={(e) => { item.value = e.target.value; console.log(e.target.value, "value for date") }} />
                            </div>
                        )
                    })}
                </div>
            </div>
            {(customerSelected) && card}

            <div className="datatable-crud-demo">
                <Toast ref={toast} />

                <div className="card">
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={invoices}
                        dataKey="id"
                        responsiveLayout="scroll">
                        <Column selectionMode="single" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                        {dynamicColumns}
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                </div>



                <Dialog visible={invoiceDialog} style={{ width: '450px' }} header="Invoice Details" modal className="p-fluid" footer={invoiceDialogFooter} onHide={hideDialog}>
                    <div className="field col">
                        <label htmlFor="sr-no">Serial Number</label>
                        <InputNumber id="sr-no" value={invoice["sr-no"]} onChange={(e) => onInputNumberChange(e, 'sr-no')} required rows={3} cols={20} />
                    </div>
                    <div className="field">
                        <label htmlFor="description">Description</label>
                        <InputTextarea id="description" value={invoice.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                    </div>
                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="rate">Rate</label>
                            <InputNumber id="rate" value={invoice.rate} onValueChange={(e) => onInputNumberChange(e, 'rate')} mode="currency" currency="INR" locale="en-IN" />
                        </div>
                        <div className="field col">
                            <label htmlFor="quantity">Quantity</label>
                            <InputNumber id="quantity" value={invoice.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} integeronly />
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={deleteInvoiceDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteInvoiceDialogFooter} onHide={hideDeleteInvoiceDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {invoice && <span>Are you sure you want to delete invoice number<b>{invoice['sr-no']}</b>?</span>}
                    </div>
                </Dialog>
            </div>
        </div>
    )
}
export default CrudTable