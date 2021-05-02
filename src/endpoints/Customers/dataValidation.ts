import { getConnection } from "typeorm"




async function checkIfCustomerExists({ email }){
    const query = await getConnection().query(`SELECT * FROM customers WHERE "email"='${email}' AND "isDeleted"=false;`)
    if (query.length == 1) {
        return true;
    }
    return false;
}

export {
    checkIfCustomerExists,
}