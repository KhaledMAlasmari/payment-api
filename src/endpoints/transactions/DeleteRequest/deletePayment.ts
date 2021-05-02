import express from 'express';
import { check, validationResult } from 'express-validator';
import { getConnection } from 'typeorm';
import { transactionsInterface } from '../transactionsInterface';
import { checkForErrors } from './errors';
const deletePayment = express.Router();

deletePayment.delete('/',
    check('transactionId').isInt().withMessage("The transactions id you enterd is invalid. Use unique integers for each transactions."),
)

deletePayment.delete('/', (req: express.Request, res: express.Response) => {
    const errors = checkForErrors(req, res, validationResult(req));
    errors.then((result) => {
        if (result != null) {
            return result;
        }
        // Query the data
        (async () => { await databaseQuery(req.body, res) })();
    })
});


async function databaseQuery({ transactionId }: transactionsInterface, res: express.Response) {
    try {
        await getConnection().query(`UPDATE transactions SET "isDeleted"=true WHERE "transactionId"=${transactionId};`)
        return res.status(200).json({ success: "Deleted!" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something Went wrong!" });
    }
}
export {
    deletePayment
}
