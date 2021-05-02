import express from 'express';
import { checkForErrors } from './checkForErrors';
import { body, check, validationResult } from 'express-validator';
import { transactionsInterface } from '../transactionsInterface';
import { Transactions } from '../../../entity/Transactions'
import "reflect-metadata";
import { getConnection } from 'typeorm';
const createPayment = express.Router();


createPayment.post('/',
  check('customerId').isInt().withMessage("The customer id you enterd is invalid. Use unique integer numbers for each customer."),
  check('amount').isNumeric().withMessage("The amount should be a number."),
  check('currency').trim().matches("^[a-zA-Z]*$").withMessage("The currency should be a string."),
  check('dueDate').trim().isISO8601({ strict: true }).withMessage("The due date wasn't given or the format isn't correct. Please use the ISO 8601 standard."),
  )

createPayment.post('/', (req: express.Request, res: express.Response) => {
  const dataValidation = validationResult(req);
  const errors = checkForErrors(req, res, dataValidation);
  // return errors if there is any

  errors.then((result) => {
    if (result != null) {
      return result;
    }
      // Query the data
    (async() => {await databaseQuery(req.body, res)})();
  })
    .catch((err) => {
      console.log(err);
    })
});

async function databaseQuery({ amount, currency, customerId, dueDate,}: transactionsInterface, res: express.Response) {

    try {
      let transaction = new Transactions();
      transaction.customerId = customerId;
      transaction.amount = amount;
      transaction.currency = currency;
      transaction.dueDate = dueDate;
      transaction.paidDate = null;
      transaction.isPaid = false;
      transaction.isDeleted = false;
      transaction.hasBeenReminded = false;
      await getConnection().manager.save(transaction);
      res.status(201).json({ success: "Added!" })
    }
    catch (error) {
      console.log(error)
      res.status(500).json({ error: "Something Went wrong!" })
    }
  }



export {
  createPayment
}