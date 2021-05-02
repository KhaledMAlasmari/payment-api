# Payment API

A payment API to handles payments. Built using express and PostgreSQL.

This is my first try at building something with express. lots of spaghetti code tho.

## Usage
**Customers**

POST
``` 
POST - /customers
Add a new customer to the database
Required JSON keys:
- firstName : String
- lastName : String
- email : String
```

DELETE

```
DELETE - /customers
Delete a customer from the database
Required JSON keys:
- email : String
```

GET

```
GET - /customers
get a customer info from the database
Required JSON keys:
- email : String
```
PUT

```
PUT - /customers
update a customer info
The only required JSON parameter is:
- customerId : Number
There are optional paramaters that you need to select at least one out of:
- firstName : String
- lastName : String
- email : String
```

---

**Payments**

POST
``` 
POST - /payments
Add a new payment to the database
Required JSON keys:
- customerId : Number
- amount : Number
- currency : String
- dueDate: String - ISO8601
```

DELETE

```
DELETE - /payments
Delete a payment from the database
Required JSON keys:
- transactionId : Number
```
GET

```
GET - /payments/customers
get all the transactions info for a given customer
Required JSON keys:
- customerId : Number
```

```
GET - /payments/transactions/
get one transaction from the database
Required JSON keys:
- transactionId: Number
```

```
GET - /payments/amount/lessThan/
Get all the transactions which are less than a certain amount
Required JSON keys:
- amount: Number
```

```
GET - /payments/amount/greaterThan/
Get all the transactions which are greater than a certain amount
Required JSON keys:
- amount: Number
```

```
GET - /payments/status/paid
Get all the transactions are either paid/unpaid
Required JSON keys:
- isPaid: Boolean
```

```
GET - /payments/duePayments/
Get all the transactions that are due
Required JSON keys:
- dueDate: String - ISO8601
```



PUT

```
PUT - /payments/paid
Change a transaction into paid
Required JSON keys:
- transactionId: Number
```

```
PUT - /payments/dueDate
Change a transaction due date
Required JSON keys:
- dueDate: String - ISO8601
```
```
PUT - /payments/amount
Change the amount of a given transaction
Required JSON keys:
- transactionId: Number
- amount: Number
```
---

**Reminder**

```
GET - /reminder/
Check if the transaction and if so print a reminder in the console.
Required JSON keys:
- transactionId: Number
```

**.env file**
```
Fill in the data in the .env file before running it

Example:

PORT = 2345
DB_PORT = 5432
DB_USERNAME = postgres
DB_PASSWORD = mypass
DB_NAME = Payments

```

## Tests?
Well... I wrote some but they needed a database to connect to which is a big no no. I found a way to mock it but I didn't have enough time to implement them.

##
Regardless of the result, I LEARNED A LOT. typescript, express, PostgreSQL, ORMs, and MongoDB which I had to switch from because I forgot that working with relations with MongoDB isn't straight forward.
 
