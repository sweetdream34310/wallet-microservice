## Wallet Microservices

The wallet microservices application is designed to handle incoming transactions and process them in a scalable and efficient way. The application consists of two services: wallet-api and wallet-processor.

## Setup

To run this project, you'll need to have Node.js and MongoDB installed on your computer. Once you have those installed, follow these steps:

- Clone the repository to your local machine.

- In a terminal, navigate to the wallet-api directory and run this command

```sh
npm install
```

- Create a .env file in the wallet-api directory with the following contents:

```sh
MONGODB_URI=mongodb://0.0.0.0:27017/
DB_NAME=wallet
API_KEY=123456789abcdef
```

- In a terminal, navigate to the wallet-processor directory and run npm install to install the dependencies.

- Create a same .env file in the wallet-processor directory

- Start the wallet-api service by running

```sh
npm run start
```

or

```sh
npm run start:dev
```

in the wallet-api directory.

- Start the wallet-processor service by running

```sh
npm run start
```

or

```sh
npm run start:dev
```

in the wallet-processor directory.

## APIs

The following APIs are available:

### Transaction API

```sh
Method: POST


Endpoint: {baseurl}/wallet-api/transaction

Request Example:

[
    { 
        "value": 110, 
        "latency": 600,  
        "customerId": "6308cfba219a0d95f1629c15" 
    },
    {
        "value": 70, 
        "latency": 250,   
        "customerId": "6308cfbe219a0d95f1629c17" 
    },    
    {
        "value": 200, 
        "latency": 850,  
        "customerId": "6308cfba219a0d95f1629c40" 
    },    
    {
        "value": 120, 
        "latency": 1000, 
        "customerId": "6308cfbe219a0d95f1629c17" 
    }
]

```
* Description: 

When a transaction request is made to the wallet-api service, it separates the transactions into several chunks according to the algorithm. These chunks are then sent to the wallet-processor service for processing. If the wallet-processor service receives these chunks, it processes them and sends unsuccessful transactions back to the wallet-api service.

If the wallet-api service receives these unsuccessful transactions, it stores them in the unsuccessfultransactions collection of the database. This allows for easy tracking and management of unsuccessful transactions, which can be useful for debugging and troubleshooting purposes.


### Delete Customer API

```sh
Method: DELETE

Endpoint: {baseurl}/wallet-api/customer/{id}
```

* Description: Deletes a customer softly.

### Get Customer API

```sh
Method: GET

Endpoint: {baseurl}/wallet-api/customer/{id}

Headers: api-key (optional)
```

* Description: 

Returns the current customer name and balance if called with an API key. If not, it returns only the customer's name.

### Update Customer API

```sh
Method: PATCH

Endpoint: {baseurl}/wallet-api/customer/{id}

Request Example:

{
  "first_name": "David",
  "last_name": "Jones",
  "balance": 540
}
```

* Description: Updates a customer's name and balance.

## Database Seed

This project utilizes a database snapshot from S3 to seed the database upon every application start. The application checks if seeding is necessary and proceeds accordingly. Requests from the front end are not rejected during the seeding process and will be processed once seeding is completed.

## Base URL
The base url for these APIs is http://127.0.0.1:8000.

## Conclusion

That's it! With these instructions, you should be able to run and use this wallet microservices application. If you have any questions or issues, please contact me for support.
