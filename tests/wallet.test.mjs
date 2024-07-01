import { describe, it, expect, beforeEach } from "vitest";
import Wallet from './models/Wallet.mjs';

describe('Wallet', () => {
    let wallet;

    beforeEach(() => {
        wallet = new Wallet();
    });

    describe('properties', () => {
        it('should have a property named balance', () => {
            expect(wallet).toHaveProperty('balance');
        });

        it('should have a property named publicKey', () => {
            console.log(wallet.publicKey);
            expect(wallet).toHaveProperty('publicKey');
        });
    });


});