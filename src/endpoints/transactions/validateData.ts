import { getConnection } from "typeorm";
import { transactionsInterface } from "./transactionsInterface";

async function checkICustomerDoesntExists({ customerId }: transactionsInterface) {
    const customer = await getConnection().query(`SELECT * FROM customers WHERE "customerId"=${customerId};`);
    if (customer.length == 0) {
        return true;
    }
    return false;
}

async function checkIfTransactionDoesntExists({ transactionId }: transactionsInterface) {
    const transaction = await getConnection().query(`SELECT * FROM transactions WHERE "transactionId"=${transactionId} AND "isDeleted"=false;`)
    if (transaction.length == 0) {
        return true;
    }
    return false;
}

async function checkIfTransactionIsDeleted({ transactionId }: transactionsInterface) {
    const transaction = await getConnection().query(`SELECT "isDeleted" FROM transactions WHERE "transactionId"=${transactionId};`)
    const value = transaction[0]['isDeleted'];
    return value;
}


function checkIfDueDateIsAfterPaidDate(dueDate : Date, paidDate : Date){
    if(dueDate.getTime() >= paidDate.getTime()){
        return true;
    }
    return false;
}

function checkIfDueDateIsInThePast(dueDate : Date){
    let todayDate = new Date();
    if(dueDate.getTime() <= todayDate.getTime()){
        return true;
    }
    return false;
}

async function checkIfTransactionWasntPaid({ transactionId }: transactionsInterface) : Promise<Boolean>{
    const transaction = await getConnection().query(`SELECT * FROM transactions WHERE "transactionId"=${transactionId} AND "isPaid"=false`)
    if (transaction.length == 1) {
        return true;
    }
    return false;
}



export{
    checkICustomerDoesntExists,
    checkIfTransactionDoesntExists,
    checkIfTransactionIsDeleted,
    checkIfDueDateIsAfterPaidDate,
    checkIfDueDateIsInThePast,
    checkIfTransactionWasntPaid,
}