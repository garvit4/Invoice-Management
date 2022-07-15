import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';


 function CrudTable(props) {

    // empty Invoice
    let emptyInvoice = {
        id: null,
        invoiceId: '',
        frRecn: null,
        customerId: '',
        category: null,
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };

    // states
    const [invoices, setInvoices] = useState(null);
    const [invoiceDialog, setInvoiceDialog] = useState(false);
    const [deleteInvoiceDialog, setDeleteInvoiceDialog] = useState(false);
    const [deleteInvoicesDialog, setDeleteInvoicesDialog] = useState(false);
    const [invoice, setInvoice] = useState(emptyInvoice);
    const [selectedInvoices, setSelectedInvoices] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        setInvoices(props.invoices);
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



    // save product
    const saveInvoice = () => {
        setSubmitted(true);
// here is  a problem  that "name" is used
        if (invoice.name.trim()) {
            let _invoices = [...invoices];
            let _invoice = { ...invoice };
            //this for upadting invices
            if (invoice.id) {
                const index = findIndexById(invoice.id);

                _invoices[index] = _invoice; // here invoice gets inside invoices
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Invoice Updated', life: 3000 });
            }
            else {
                _invoice.id = createId();
                _invoice.image = 'invoice-placeholder.svg';
                _invoices.push(_invoice);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Invoice Created', life: 3000 });
            }

            setInvoices(_invoices);
            setInvoiceDialog(false);
            setInvoice(emptyInvoice);
        }
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


// even more functions
const confirmDeleteSelected = () => {
    setDeleteInvoicesDialog(true);
}

const deleteSelectedInvoices = () => {
    let _invoices = invoices.filter(val => !selectedInvoices.includes(val));
    setInvoices(_invoices);
    setDeleteInvoicesDialog(false);
    setSelectedInvoices(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Invoices Deleted', life: 3000 });
}

const onCategoryChange = (e) => {
    let _invoice = { ...invoice };
    _invoice['category'] = e.value;
    setInvoice(_invoice);
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

// const imageBodyTemplate = (rowData) => {
//     return <img src={`images/product/${rowData.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="product-image" />
// }

// const priceBodyTemplate = (rowData) => {
//     return formatCurrency(rowData.price);
// }

// const ratingBodyTemplate = (rowData) => {
//     return <Rating value={rowData.rating} readOnly cancel={false} />;
// }

// const statusBodyTemplate = (rowData) => {
//     return <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
// }

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

// column map
const columns = [
    { field: "invoice-id", header: "Invoice No." },
    { field: "Customer Name", header: "Customer Name" },
    { field: "Company Name", header: "Company Name" },
    { field: "invoice-date", header: "Invoice Date" },
    { field: "Due Date", header: "Due Date" },
    { field: "Amount", header: "Amount" }
];

// const cellEditor = (options) => {
//     return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
// }

// const onCellEditComplete = (e) => {
//     console.log(Invoices, "Invoices")
//     console.log(e, "ee")
//     let { rowData, newValue, field, originalEvent: event } = e;
//     if (newValue.trim().length > 0)
//         rowData[field] = newValue;
//     else
//         event.preventDefault();
// }

return (
    <div className="datatable-crud-demo">
        <Toast ref={toast} />

        <div className="card">
            <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

            <DataTable ref={dt} value={invoices} selection={selectedInvoices} onSelectionChange={(e) => setSelectedInvoices(e.value)}
                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} invoices"
                globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                <Column field="invoice-id" header="Invoice No." sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="Customer Name" header="Customer Name" sortable style={{ minWidth: '16rem' }}></Column>
                {/* <Column field="image" header="Image" body={imageBodyTemplate}></Column> */}
                {/* <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column> */}
                <Column field="invoice-date" header="Invoice Date" sortable style={{ minWidth: '10rem' }}></Column>
                {/* <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
            </DataTable>
        </div>
        {/* <Dialog visible={invoiceDialog} style={{ width: '450px' }} header="Invoice Details" modal className="p-fluid" footer={invoiceDialogFooter} onHide={hideDialog}>
            {product.image && <img src={`images/product/${product.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={product.image} className="product-image block m-auto pb-3" />}
            <div className="field">
                <label htmlFor="name">Name</label>
                <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                {submitted && !product.name && <small className="p-error">Name is required.</small>}
            </div>
            <div className="field">
                <label htmlFor="description">Description</label>
                <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
            </div>

            <div className="field">
                <label className="mb-3">Category</label>
                <div className="formgrid grid">
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.category === 'Accessories'} />
                        <label htmlFor="category1">Accessories</label>
                    </div>
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={product.category === 'Clothing'} />
                        <label htmlFor="category2">Clothing</label>
                    </div>
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={product.category === 'Electronics'} />
                        <label htmlFor="category3">Electronics</label>
                    </div>
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={product.category === 'Fitness'} />
                        <label htmlFor="category4">Fitness</label>
                    </div>
                </div>
            </div>

            <div className="formgrid grid">
                <div className="field col">
                    <label htmlFor="price">Price</label>
                    <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                </div>
                <div className="field col">
                    <label htmlFor="quantity">Quantity</label>
                    <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} integeronly />
                </div>
            </div>
        </Dialog> */}

        {/* <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
            <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                {product && <span>Are you sure you want to delete <b>{product.name}</b>?</span>}
            </div>
        </Dialog> */}

        {/* <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
            <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                {product && <span>Are you sure you want to delete the selected products?</span>}
            </div>
        </Dialog> */}
    </div>
)
}
export default CrudTable
