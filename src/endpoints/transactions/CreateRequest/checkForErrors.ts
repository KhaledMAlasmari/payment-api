import { body } from 'express-validator';
import express from 'express';
import { checkICustomerDoesntExists, checkIfDueDateIsAfterPaidDate, checkIfDueDateIsInThePast } from '../validateData';


const checkForErrors = async (req: express.Request, res: express.Response, errors) => {
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), body: body() });
    }
    /*
    if (req.body.isPaid == true && (req.body.paidDate == undefined)) {
        return res.status(400).json({ error: "Paid date wasn't given in the request" });
    }

    if (req.body.isPaid == false && (req.body.paidDate != undefined)) {
        return res.status(400).json({ error: "Paid date was given despite the status being unpaid" });
    }

*/
    if (checkIfDueDateIsInThePast(new Date(req.body.dueDate))) {
        return res.status(400).json({ error: "The due date can't be in the past" });
    }

    if (await checkICustomerDoesntExists(req.body) == true) {
        return res.status(404).json({ error: "The customer id you gave doesn't exist." });
    }
    return null;
}

export {
    checkForErrors,
}