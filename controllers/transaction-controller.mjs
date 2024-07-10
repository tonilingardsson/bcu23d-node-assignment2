import {
    blockchain,
    pubnubServer,
    transactionPool,
    wallet,
} from '../server.mjs';
import Miner from '../models/Miner.mjs';

export const addTransaction = (req, res, next) => {
    const { amount, recipient } = req.body;

    let transaction = transactionPool.existingTransaction({
        address: wallet.publicKey,
    });

    try {
        if (transaction) {
            transaction.update({ sender: wallet, recipient, amount });
        } else {
            transaction = wallet.createTransaction({ recipient, amount });
        }
    } catch (error) {
        return res
            .status(400)
            .json({ success: false, statusCode: 400, error: error.message });
    }

    transactionPool.addTransaction(transaction);
    pubnubServer.broadcastTransaction(transaction);

    res.status(201).json({ success: true, statusCode: 201, data: transaction });
};

export const getTransactionPool = (req, res, next) => {
    res.status(200).json({
        success: true,
        statusCode: 200,
        data: transactionPool.transactionMap,
    });
};

export const mineTransactions = (req, res, next) => {
    const miner = new Miner({
        blockchain,
        transactionPool,
        wallet,
        pubsub: pubnubServer,
    });

    miner.mineTransaction();

    res.status(200).json({ success: true, statusCode: 200, data: 'It works quite decent for now!' });
};
