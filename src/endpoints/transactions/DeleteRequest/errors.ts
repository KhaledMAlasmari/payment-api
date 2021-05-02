import express from "express";
import { body } from "express-validator";
import { getConnection } from "typeorm";
import { checkIfTransactionWasntPaid, checkIfTransactionDoesntExists, checkIfTransactionIsDeleted } from "../validateData";
import { transactionsInterface } from "../transactionsInterface";

const checkForErrors = async (req, res: express.Response, errors) => {
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), body: body() });
    }

    if (await checkIfTransactionDoesntExists(req.body) == true) {
        return res.status(400).json({ error: "The transaction doesn't exist." });
    }
    if (await checkIfTransactionIsDeleted(req.body) == true) {
        return res.status(400).json({ error: "The transaction is already deleted." });
    }

    if((await checkIfTransactionWasntPaid(req.body)) == true){
        return res.status(400).json({ error: "The transaction cannot be deleted because it wasn't paid. " });
    }
    return null;
}




export {
    checkForErrors
}