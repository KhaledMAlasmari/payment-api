import express from "express";
import { body, check, validationResult } from "express-validator";
import { getConnection } from "typeorm";

const readCustomer = express.Router();

readCustomer.get('/',
    check('email').trim().isEmail().withMessage("Enter a valid email"),
)


readCustomer.get('/', (req, res) => {
    const dataValidation = validationResult(req);
    if (!dataValidation.isEmpty()) {
        return res.status(400).json({ errors: dataValidation.array(), body: body() });
    }
    // query the database
    getConnection().query(`SELECT "customerId", "firstName", "lastName", "email" FROM customers WHERE "email"='${req.body.email}' AND "isDeleted"=false;`)
        .then((result: Array<Object>) => {
            if (result.length == 0) {
                return res.status(404).json({ error: "The email you entered isn't associated with any customer." })
            }
            return res.status(200).json(result[0]);
        });
})

export {
    readCustomer,
}

