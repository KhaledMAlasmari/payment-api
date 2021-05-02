import express from 'express';
import { body, check, validationResult } from 'express-validator';
import { getConnection } from 'typeorm';
import { Customers } from '../../entity/Customers';
import { CustomerInterface } from './CustomerInterface';
import { checkIfCustomerExists } from './dataValidation';
const createCustomer = express.Router();


createCustomer.post('/',
  check('firstName').trim().matches("^[a-zA-Z]*$").withMessage("The first name should be a string."),
  check('lastName').trim().matches("^[a-zA-Z]*$").withMessage("The last name should be a string."),
  check('email').trim().isEmail().withMessage("Enter a valid email"),
)


createCustomer.post('/', (req, res) => {
  const errors = checkForErrors(req.body, res, validationResult(req));
  errors.then((result) => {
    if (result != null) {
      return result;
    }
    (async () => { await databaseQuery(req.body, res) })();
  });

})


async function databaseQuery({ email, firstName, lastName }: CustomerInterface, res: express.Response) {
  try {

    const findIfAccountExists = await getConnection().query(`SELECT * FROM customers WHERE "email"='${email}' AND "isDeleted"=true;`);

    if (findIfAccountExists.length == 1) {
      await getConnection().query(`UPDATE customers SET "isDeleted"=false WHERE "email"='${email}';`)
    }
    else {
      let customer = new Customers();
      customer.email = email;
      customer.firstName = firstName;
      customer.lastName = lastName;
      customer.isDeleted = false;
      await getConnection().manager.save(customer);
    }


    res.status(201).json({ success: "Added!" })
  }
  catch (error) {
    console.log(error)
    res.status(500).json({ error: "Something Went wrong!" })
  }
}


async function checkForErrors(requestBody, res: express.Response, errors): Promise<express.Response> {
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), body: body() });
  }

  if (await checkIfCustomerExists(requestBody) == true) {
    return res.status(400).json({ error: "The email you enterd has been already used." });
  }

  return null;
}


export {
  createCustomer
}
