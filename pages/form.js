import Layout from "../components/LayoutComponents/Layout"
import {React,useState,useRef} from 'react'
import { InputText } from 'primereact/inputtext';
import {Button} from 'primereact/button'
import { connectToDatabase } from "../lib/mongodb";
import Table from '../components/Table';
import CrudTable from '../components/CrudTable';
import { Toast } from 'primereact/toast';
import { cardClasses } from "@mui/material";

export default function form(props) {
  const [newInvoice, setNewInvoice] = useState(null);
  const toast = useRef(null);
        return (
  <Layout>
            <div className="gutter">
                <Toast ref={toast} />
                <div style={{ display: "flex", justifyContent: "space-between", }}>
                    <div style={{ display: "grid", gridTemplateRows: "30px 30px 30px 30px" }}>
                        <div>FROM</div>
                        <div style={{ textDecorationThickness: "auto" }}><b>{props.companyInfo[0]['firm-name']}</b></div>
                        <div>{props.companyInfo[0]['firm-address']}</div>
                        <div>consultingagency@consultingagency-email.com</div>
                    </div>
                </div>
                <hr/>
                {/* <Table invoices= {props.invoices}/> */}
                <CrudTable invoices = {props.invoices} customers={props.customers} setNewInvoice={setNewInvoice} />
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
      