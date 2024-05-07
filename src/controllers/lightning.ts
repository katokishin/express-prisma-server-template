import { authenticatedLndGrpc } from 'lightning'

const { lnd } = authenticatedLndGrpc({
    cert: process.env.LND_CERT_BASE64,
    macaroon: process.env.LND_MACAROON_BASE64,
    socket: process.env.LND_IP_PORT
})

/*
Popular methods: (see https://www.npmjs.com/package/lightning for list)
createInvoice, decodePaymentRequest, getInvoice, getNode,
getPayment, pay, subscribeToInvoices, subscribeToPayments, ...

Required permissions depend on method; make macaroon with minimum permissions!
*/