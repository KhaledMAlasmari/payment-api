import { body } from "express-validator";
import { checkIfTransactionDoesntExists, checkIfTransactionIsDeleted } from "../validateData";

const checkErrors = async (req, res, errors) => {
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), body: body() });
    }

    if (await checkIfTransactionDoesntExists(req.body) == true) {
        return res.status(404).json({ error: "The transaction doesn't exist." });
    }
}




export {
    checkErrors
}