import express from 'express';
import { createPayment } from './endpoints/transactions/CreateRequest/CreatePayment'
import { deletePayment } from './endpoints/transactions/DeleteRequest/deletePayment'
import "reflect-metadata";
import dotenv from 'dotenv'
import { readPayment } from './endpoints/transactions/ReadRequest/readPayment';
import { updatePayment } from './endpoints/transactions/UpdateRequest/updatePayment';
import { createCustomer } from './endpoints/Customers/CreateCustomer';
import { deleteCustomer } from './endpoints/Customers/DeleteCustomer';
import { readCustomer } from './endpoints/Customers/ReadCustomer';
import { updateCustomer } from './endpoints/Customers/UpdateCustomer';
import { remindOfPayment } from './endpoints/reminder/remindCustomers';
dotenv.config();
const app = express();


// connect to the database first and then listen to requests 

// Middleware: JSON parsing - logging
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} - ${req.url}`)
  console.log(`Query: ${JSON.stringify(req.query)}`)
  console.log(`Body: ${JSON.stringify(req.body)}`)
  console.log("----------------------------------------------")
  next();
})

//Payments

  /*---------------------------------------------
   
                Create endpoint
        Add a new payment to the database
  -----------------------------------------------*/
app.use("/payments", createPayment);



/*---------------------------------------------
 
              READ endpoint
      Get payment/s info from the database
-----------------------------------------------*/
app.use('/payments', readPayment)


/*---------------------------------------------
 
              UPDATE endpoint
      Change some payment fields in the database
-----------------------------------------------*/
app.use('/payments', updatePayment)



/*---------------------------------------------
 
                 DELETE endpoint
      Mark payments as deleted in the database
-----------------------------------------------*/
app.use("/payments", deletePayment);


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



// Customers

/*---------------------------------------------
 
              Create endpoint
      Add a new customer to the database
-----------------------------------------------*/
app.use("/customers", createCustomer);



/*---------------------------------------------
 
              READ endpoint
      Get customer/s info from the database
-----------------------------------------------*/
app.use("/customers", readCustomer);


/*---------------------------------------------
 
              UPDATE endpoint
      Change some customer fields in the database
-----------------------------------------------*/
app.use('/customers', updateCustomer)



/*---------------------------------------------
 
               DELETE endpoint
    Mark customers as deleted in the database
-----------------------------------------------*/
app.use("/customers", deleteCustomer);



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// reminder

/*---------------------------------------------
 
               GET endpoint
    Mark customers as deleted in the database
-----------------------------------------------*/


app.use("/reminder", remindOfPayment);

export {
  app
}