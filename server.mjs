import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth-routes.mjs';
import Blockchain from './models/Blockchain.mjs';
import TransactionPool from './models/TransactionPool.mjs';
import Wallet from './models/Wallet.mjs';
import blockRouter from './routes/block-routes.mjs';
import blockchainRouter from './routes/blockchain-routes.mjs';
import transactionRouter from './routes/transaction-routes.mjs';
import PubnubServer from './pubnubServer.mjs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: './config/config.env' });

// Create a global __appdir that points to the directory where the application is running
const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);
global.__appdir = __dirname;

const credentials = {
    publishKey: process.env.PUBLISH_KEY,
    subscribeKey: process.env.SUBSCRIBE_KEY,
    secretKey: process.env.SECRET_KEY,
    userId: process.env.USER_ID,
};

export const blockchain = new Blockchain();
export const transactionPool = new TransactionPool();
export const wallet = new Wallet();
export const pubnubServer = new PubnubServer({
    blockchain,
    credentials,
    transactionPool,
    wallet,
});

const app = express();
// Middleware
app.use(express.json());
app.use('/api/v1/auth', authRouter);

const DEFAULT_PORT = 5001;
const ROOT_NODE = `http://localhost:${DEFAULT_PORT}`;

let NODE_PORT;

setTimeout(() => {
    pubnubServer.broadcastChain();
}, 1000);

app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/block', blockRouter);
app.use('/api/v1/wallet', transactionRouter);

const synchronize = async () => {
    let response = await fetch(`${ROOT_NODE}/api/v1/blockchain`);
    if (response.ok) {
        const result = await response.json();
        blockchain.replaceChain(result.data);
    }

    response = await fetch(`${ROOT_NODE}/api/v1/wallet/transactions`);
    if (response.ok) {
        const result = await response.json();
        transactionPool.replaceTransactionMap(result.data);
    }
};

if (process.env.GENERATE_NODE_PORT === 'true') {
    NODE_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = NODE_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    if (PORT !== DEFAULT_PORT) {
        synchronize();
    }
});
