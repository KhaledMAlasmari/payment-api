import express from "express";
import { body, check, validationResult } from "express-validator";
import { getConnection } from "typeorm";
import { CustomerInterface } from "./CustomerInterface";
import { checkIfCustomerExists } from "./dataValidation";

const deleteCustomer = express.Router();

deleteCustomer.delete('/',
    check('email').trim().isEmail().withMessage("Enter a valid email"),

)


deleteCustomer.delete('/', (req, res) => {
    const dataValidation = validationResult(req);
    if (!dataValidation.isEmpty()) {
        return res.status(400).json({ errors: dataValidation.array(), body: body() });
    }
    const customerExist = checkIfCustomerExists(req.body);
    customerExist.then((result) => {
        if (result != true) {
            return res.status(404).json({ error: "The customer doesn't exist." });
        }
        else {
            // Query the database
            (async () => { await databaseQuery(req.body, res) })();
        }


    })
});


async function databaseQuery({ email }: CustomerInterface, res: express.Response) {
    try {
        const customer = await getConnection().query(`SELECT * FROM customers WHERE "email"='${email}' AND "isDeleted"=false;`)
        await getConnection().query(`UPDATE customers SET "isDeleted"=true WHERE "email"='${email}';`)
        await getConnection().query(`UPDATE transactions SET "isDeleted"=true WHERE "customerId"=${customer[0].customerId};`)
        return res.status(200).json({ success: "Deleted!" });
    }

    catch (error) {
        console.log(error)
        res.status(500).json({ error: "Something Went wrong!" })
    }
}


export {
    deleteCustomer
}