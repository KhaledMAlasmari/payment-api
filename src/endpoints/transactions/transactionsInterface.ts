interface transactionsInterface{
    customerId? : number,
    transactionId? : number,
    amount?: number,
    currency?: string,
    isPaid?: boolean,
    dueDate?: string,
    paidDate?: string,
    isDeleted? : boolean,
    hasBeenReminded? : boolean
}

// change transactions to the name of the collection you're using 

export {
    transactionsInterface,
}