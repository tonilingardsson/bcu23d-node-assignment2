import { v4 as uuidv4 } from 'uuid';
import { verifySignature } from '../utilities/crypto-lib.mjs';

export default class Transaction {
    constructor({ sender, recipient, amount }) {
        this.id = uuidv4().replaceAll('-', '');
        this.outputMap = this.createOutputMap({ sender, recipient, amount });
        this.inputMap = this.createInputMap({ sender, outputMap: this.createOutputMap });
    }

    createOutputMap({ sender, recipient, amount }) {
        const outputMap = {};

        outputMap[recipient] = amount;
        outputMap[sender.publicKey] = sender.balance - amount;

        return outputMap;
    }

    createInputMap({ sender, outputMap }) {
        return {
            timestamp: Date.now(),
            amount: sender.balance,
            address: sender.publicKey
        }
    }
}