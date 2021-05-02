import express from 'express';
import { check, validationResult } from 'express-validator';
import { getConnection } from 'typeorm';
import { checkIfDueDateIsInThePast, checkIfTransactionWasntPaid } from '../validateData';
import { checkErrors } from './checkForErrors';
const updatePayment = express.Router();


// update isPaid 
updatePayment.put('/paid',
    check('transactionId').isInt().withMessage("The transactions id you enterd is invalid."),
    (req, res) => {
        const errors = checkErrors(req, res, validationResult(req));
        errors.then((result) => {
            if (result != null) {
                return result;
            }
            // query the database
            (async () => { await updateisPaidQuery(req, res) })();
        });
    })


const updateisPaidQuery = async (req, res) => {
    // check if it's already paid 
    const paidStatus = await checkIfTransactionWasntPaid(req.body);
    if (paidStatus == false) {
        return res.status(400).json({ error: "The transaction is already paid" });
    }
    else {
        let paidDate = new Date().toISOString();
        await getConnection().query(`UPDATE transactions SET "paidDate"= '${paidDate}', "isPaid"=true WHERE "isPaid"=false;`);
        return res.status(201).json({ success: "The payment status & pay date has been updated!" });
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// update due date
updatePayment.put('/dueDate',
    check('transactionId').isInt().withMessage("The transactions id you enterd is invalid."),
    check('dueDate').trim().isISO8601({ strict: true }).withMessage("The due date wasn't given or the format isn't correct. Please use the ISO 8601 standard."),
    (req, res) => {
        let dueDate = new Date(req.body.dueDate);
        if (checkIfDueDateIsInThePast(dueDate) == true) {
            return res.status(400).json({ error: "The date you enterd is in the past." });
        }
        const errors = checkErrors(req, res, validationResult(req));
        errors.then((result) => {
            if (result != null) {
                return result;
            }
            // query the database
            (async () => { await updateDueDateQuery(req.body.dueDate, req.body.transactionId, res) })();

        })
    })
const updateDueDateQuery = async (dueDate, transactionId, res) => {
    await getConnection().query(`UPDATE transactions SET "dueDate"= '${dueDate}' WHERE "transactionId"=${transactionId};`);
    return res.status(201).json({ success: "The date has been updated!" });
}


// update amount
updatePayment.put('/amount',
    check('transactionId').isInt().withMessage("The transactions id you enterd is invalid."),
    check('amount').isDecimal().withMessage("The amount should be a number."),
    (req, res) => {
        const errors = checkErrors(req, res, validationResult(req));
        errors.then((result) => {
            if (result != null) {
                return result;
            }
            // query the database
            (async () => { await updateAmountQuery(req.body.amount, req.body.transactionId, res) })();


        })
    })

const updateAmountQuery = async (amount, transactionId, res) => {
    await getConnection().query(`UPDATE transactions SET "amount"= ${amount} WHERE "transactionId"=${transactionId};`);
    return res.status(201).json({ success: "The amount has been updated!" });
}

export {
    updatePayment
}