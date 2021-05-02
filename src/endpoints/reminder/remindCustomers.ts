import express from "express";
import { body, check, validationResult } from "express-validator";
import { getConnection } from "typeorm";
import { CustomerInterface } from "../Customers/CustomerInterface";
import { transactionsInterface } from "../transactions/transactionsInterface";
import { checkIfDueDateIsInThePast } from "../transactions/validateData";

const remindOfPayment = express.Router()


remindOfPayment.get('/',
    check('transactionId').isInt().withMessage("The transactions id you enterd is invalid. Use unique integers for each transactions."),
)


remindOfPayment.get('/', (req, res) => {
    const dataValidation = validationResult(req);
    if (!dataValidation.isEmpty()) {
        return res.status(400).json({ errors: dataValidation.array(), body: body() });
    }
    // query the database
    databaseQuery(req, res)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Something Went wrong!" });
        })
})


const databaseQuery = async (req, res) => {
    let query: Array<transactionsInterface> = await getConnection().query(`SELECT * FROM transactions WHERE "transactionId"=${req.body.transactionId} AND "isDeleted"=false AND "hasBeenReminded"=false;`);
    if (query.length == 0) {
        let status = { status: "The customer has been reminded already!" };
        console.log(status.status)
        return res.status(202).json(status)
    }
    const transaction: transactionsInterface = query[0];
    const customer: Array<CustomerInterface> = await getConnection().query(`SELECT * FROM customers WHERE "customerId"=${transaction.customerId};`);
    const dueDate = new Date(transaction.dueDate);
    if (checkIfDueDateIsInThePast(dueDate) == true) {
        await getConnection().query(`UPDATE transactions SET "hasBeenReminded"= '${true}' WHERE "transactionId"=${req.body.transactionId} AND "isDeleted"=false;`);
        console.info(`Mr ${customer[0].firstName} You're past the due date for the following purchase: id:${transaction.transactionId}, amount: ${transaction.amount} ${transaction.currency}. Please pay it off as soon as possible. Thank you!`);
        return res.status(200).json({ success: "The customer has been reminded" })
    }
    else {
        return res.status(202).json({ success: "The payment isn't due" })
    }
}



export {
    remindOfPayment
}