import Layout from "../components/LayoutComponents/Layout"
import {React,useState} from 'react'
import { InputText } from 'primereact/inputtext';
import {Button} from 'primereact/button'
import { connectToDatabase } from "../lib/mongodb";
import Table from '../components/Table';
import { Dropdown } from 'primereact/dropdown';
import Recipient from "../components/Recipient";
// import EditDataTable from "../components/EditDataTable";
import CrudTable from '../components/CrudTable'


export default function form(props) {
    console.log(props,"props")
    const [customerSelected, setCustomerSelected] = useState("")
      const allFields = [
        {
            name: "Invoice Number",
            key: 'invoiceNo',
            type: 'text',
            value: 123
        }, 
        {
            name: "Invoice Date",
            key: 'invoiceDate',
            type: 'date',
            value: '23/4/2022'
        }
      ]
    
    function handleSubmit(e) {
        console.log(e,"ee")
    }
    
        return (
  <Layout>
            <div style={{ marginLeft: "165px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", }}>
                    <div style={{ display: "grid", gridTemplateRows: "30px 30px 30px 30px" }}>
                        <div>FROM</div>
                        <div style={{ textDecorationThickness: "auto" }}><b>{props.companyInfo[0]['firm-name']}</b></div>
                        <div>{props.companyInfo[0]['firm-address']}</div>
                        <div>consultingagency@consultingagency-email.com</div>
                    </div>
                    <div>
                        <form>
                             {allFields.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <label htmlFor="in">{item.name}</label>
                                        <InputText id={item.key} name={item.key} type={item.type} onChange={(e)=>{item.value=e.target.value}}/>
                                    </div>
                                )
                                })}
                        </form>
                    </div>         
                </div>
                <hr/>
                <div style={{ marginTop:"25px", display: "grid", gridTemplateRows: "30px 50px" }}>
                        <div>TO</div>
                        <Dropdown style={{width:"200px", hieght:"50px"}} value={customerSelected} optionLabel="client-name" options={props.customers} onChange={(e) => {setCustomerSelected(e.value); console.log(customerSelected,"customerSelected")}} placeholder="Select a customer"/>
                    </div>
                <Recipient customerSelected={customerSelected}/>    
                {/* <Table invoices= {props.invoices}/> */}
                {/* <EditDataTable invoices= {props.invoices} />
                 */}
                <CrudTable invoices = {props.invoices}/>
            </div>
  </Layout>
        )
    }
    export async function getServerSideProps(context) {
        console.log(context, "redirect .....")
        let dev = process.env.NODE_ENV !== "production";
        let { DEV_URL, PROD_URL } = process.env;
        console.log(DEV_URL, "dev URL>>>");
        // connect to the database
        let { db } = await connectToDatabase();
        try {
          // fetch the invoices and company-info
          const companyInfo = await db
            .collection("company-info")
            .find({})
            .toArray();
          // return the invoices
          console.log(companyInfo, "company-info>>>");

          const invoices = await db
          .collection("invoices")
          .find({})
          .toArray();
         //fetching customers

          const customers = await db
          .collection("customers")
          .find({})
          .toArray();

          return {
            props: {
              companyInfo: JSON.parse(JSON.stringify(companyInfo)),
              invoices: JSON.parse(JSON.stringify(invoices)),
              customers: JSON.parse(JSON.stringify(customers)),
              success: true,
              error: "",
            }
          };
        } catch (error) {
          // return the error
          console.log(error, "error>>>");
          return {
            props: {
              companyInfo: [],
              invoices: [],
              customers: [],
              success: false,
              error: error
            }
          };
        }
      }
      