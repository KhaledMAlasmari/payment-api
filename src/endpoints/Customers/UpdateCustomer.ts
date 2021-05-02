import express from "express";
import { body, check, validationResult } from "express-validator";
import { getConnection } from "typeorm";
import { checkICustomerDoesntExists } from "../transactions/validateData";
import { CustomerInterface } from "./CustomerInterface";

const updateCustomer = express.Router();

updateCustomer.put('/',
    check('customerId').isInt().withMessage("The customer id you enterd is invalid. Use unique integers for each customer."),
    check('firstName').optional().trim().matches("^[a-zA-Z]*$").withMessage("The first name should be a string."),
    check('lastName').optional().trim().matches("^[a-zA-Z]*$").isString().withMessage("The last name should be a string."),
    check('email').optional().trim().isEmail().withMessage("Enter a valid email"))



updateCustomer.put('/', (req, res) => {
    const errors = checkForErrors(req, res, validationResult(req));
    errors.then((result) => {
        if (result != null) {
            return result;
        }
        else {
            (async () => { await updateInfoQuery(req.body, res) })();
        }
    })

    // query the database

})


const updateInfoQuery = async (body: CustomerInterface, res) => {
    if (body.firstName != undefined) {
        await getConnection().query(`UPDATE customers SET "firstName"= '${body.firstName}' WHERE "customerId"=${body.customerId};`);
    }
    if (body.lastName != undefined) {
        await getConnection().query(`UPDATE customers SET "lastName"= '${body.lastName}' WHERE "customerId"=${body.customerId};`);
    }
    if (body.email != undefined) {
        await getConnection().query(`UPDATE customers SET "email"= '${body.email}' WHERE "customerId"=${body.customerId};`);
    }
    return res.status(201).json({ success: "The customer info has been updated!" });
}


const checkForErrors = async (req, res, errors) => {
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), body: body() });
    }
    if (req.body['firstName'] == undefined && req.body['lastName'] == undefined && req.body['email'] == undefined) {
        return res.status(400).json({ error: "You didn't pass in any info to update. Try again." });
    }
    const customerExist = await checkICustomerDoesntExists(req.body)
    if (customerExist == true) {
        return res.status(404).json({ error: "The customer id you gave doesn't exist." });
    }
}


export {
    updateCustomer,
}

