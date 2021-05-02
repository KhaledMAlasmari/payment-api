import express from 'express';
import { check, validationResult, body } from 'express-validator';
import { transactionsInterface } from '../transactionsInterface';
import { getConnection } from 'typeorm';

const readPayment = express.Router();




// returns all the transactions of a given customer 
readPayment.get('/customers/',
    check('customerId').isInt().withMessage("The customer id you enterd is invalid. Use unique integers for each customer."),
    (req, res) => {
        const dataValidation = validationResult(req);
        if (!dataValidation.isEmpty()) {
            return res.status(400).json({ errors: dataValidation.array(), body: body() });
        }
        // query the database
        const allTransactions = async () => { return await getConnection().query(`SELECT * FROM transactions WHERE "customerId"=${req.body.customerId} AND "isDeleted"=false`) };
        allTransactions().then((result: Array<Object>) => {
            if (result.length == 0) {
                return res.status(404).json({ error: "The customer id you enterd doesn't have transactions." })
            }
            return res.status(200).json(result);
        })
    })

// returns one transaction
readPayment.get('/transactions/',
    check('transactionId').isInt().withMessage("The transactions id you enterd is invalid. Use unique integers for each transactions."),
    (req, res) => {
        const dataValidation = validationResult(req);
        if (!dataValidation.isEmpty()) {
            return res.status(400).json({ errors: dataValidation.array(), body: body() });
        }
        // query the database
        getConnection().query(`SELECT * FROM transactions WHERE "transactionId"=${req.body.transactionId}AND "isDeleted"=false;`)
            .then((result: Array<Object>) => {
                if (result.length == 0) {
                    return res.status(404).json({ error: "The transaction id you enterd doesn't exist." })
                }
                return res.status(200).json(result);
            })
    })


// return all the transactions that are less than a given amount
readPayment.get('/amount/lessThan',
    check('amount').isDecimal().withMessage("The amount should be a number."),
    (req, res) => {
        const dataValidation = validationResult(req);
        if (!dataValidation.isEmpty()) {
            return res.status(400).json({ errors: dataValidation.array(), body: body() });
        }
        getConnection().query(`SELECT * FROM transactions WHERE "amount"<=${req.body.amount} AND "isDeleted"=false`)
            .then((result: Array<Object>) => {
                if (result.length == 0) {
                    return res.status(404).json({ error: "There are no transactions less than the given amount" })
                }
                return res.status(200).json(result);
            })
    })

// return all the transactions that are greater than a given amount

readPayment.get('/amount/greaterThan',
    check('amount').isDecimal().withMessage("The amount should be a number."),
    (req, res) => {
        const dataValidation = validationResult(req);
        if (!dataValidation.isEmpty()) {
            return res.status(400).json({ errors: dataValidation.array(), body: body() });
        }

        getConnection().query(`SELECT * FROM transactions WHERE "amount">=${req.body.amount} AND "isDeleted"=false`)
            .then((result: Array<Object>) => {
                if (result.length == 0) {
                    return res.status(404).json({ error: "There are no transactions greater than the given amount" })
                }
                return res.status(200).json(result);
            })
    })

// return all the transactions that's paid/unpaid
readPayment.get('/status/paid',
    check('isPaid').isBoolean().withMessage("The status should be a boolean"),
    (req, res) => {
        const dataValidation = validationResult(req);
        if (!dataValidation.isEmpty()) {
            return res.status(400).json({ errors: dataValidation.array(), body: body() });
        }

        getConnection().query(`SELECT * FROM transactions WHERE "isPaid"=${req.body.isPaid} AND "isDeleted"=false;;`)
            .then((result: Array<Object>) => {
                if (result.length == 0) {
                    return res.status(404).json({ error: "We couldn't find any transactions that match your specifications" })
                }
                return res.status(200).json(result);
            })
    })
// return due Payments
readPayment.get('/duePayments/',
    check('dueDate').trim().isISO8601({ strict: true }).withMessage("The due date wasn't given or the format isn't correct. Please use the ISO 8601 standard."),
    (req, res) => {
        const dataValidation = validationResult(req);
        if (!dataValidation.isEmpty()) {
            return res.status(400).json({ errors: dataValidation.array(), body: body() });
        }
        let todaysDate = new Date();
        let allDuePayments: Array<Object> = [];
        getConnection().query(`SELECT * FROM transactions;`)
            .then((result: Array<Object>) => {
                result.forEach((payment: transactionsInterface) => {
                    let paymentDate = new Date(payment.dueDate);
                    if (todaysDate.getTime() >= paymentDate.getTime()) {
                        allDuePayments.push(payment);
                    }
                })

                if (allDuePayments.length == 0 || result.length == 0) {
                    return res.status(404).json({ error: "We couldn't find any due payments." })
                }
                return res.status(200).json(allDuePayments);
            })
    })




export {
    readPayment
}