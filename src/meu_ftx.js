import axios from "axios";
import { createHmac } from "crypto";
import { buildQueryString } from "./utils.js";

export class UserFtx {
    #API_KEY;
    #API_SECRET;

    constructor(API_KEY, API_SECRET) {
        this.#API_KEY = API_KEY
        this.#API_SECRET = API_SECRET
    }

    getApiKey() {
        return this.#API_KEY;
    }

    getApiSecret() {
        return this.#API_SECRET;
    }

    async getBalances() {
        return await this.#signedRequest(
            null, 
            null,
            'get', 
            'wallet/balances',
        )
    }

    async getOpenOrders(mkt) {
        return await this.#signedRequest(
            {market: mkt}, 
            null,
            'get', 
            'orders',
        )
    }

    async placeOrder(order) {
        return await this.#signedRequest(
            null, 
            order,
            'post', 
            'orders',
        )
    }

    async cancelOrderById(id) {
        return await this.#signedRequest(
            null,
            null,
            'delete',
            `orders/${id}`,
        )
    }

    async #signedRequest(parameters, body, method, path, onfulfilled, onrejected) {
        const timestamp = Date.now();
        const axios_config = {}

        let queryString = ''
        if (parameters) { // Build query string if there're any parameters
            queryString = `?${buildQueryString(parameters)}`
        }
        let signature_payload = `${timestamp}${method.toUpperCase()}/api/${path}${queryString}`
        
        if (body) { // Signature depends on the payload body. If there's no body, skip
            signature_payload += JSON.stringify(body)
            axios_config.data = body
        }

        const signature = createHmac('sha256', this.#API_SECRET) // Create signature
        .update(signature_payload)
        .digest('hex')

        // Finish axios config
        axios_config.method = method
        axios_config.url = `https://ftx.com/api/${path}${queryString}`
        axios_config.headers = {
            'Content-Type': 'application/json',
            'FTX-KEY': this.#API_KEY,
            'FTX-SIGN': signature,
            'FTX-TS': String(timestamp)
        }

        // Generate request
        const res = await axios(axios_config)
        
        return res;
    }

}