import axios from "axios";
import { createHmac } from "crypto";
import { buildQueryString } from "./utils.js";

export class UserBinance {
    #API_KEY;
    #API_SECRET;
    #balance

    constructor(API_KEY, API_SECRET) {
        this.#API_KEY = API_KEY
        this.#API_SECRET = API_SECRET

    }

    getApiKey() {
        return this.#API_KEY;
    }

    async placeOrder_Spot(order) {
        return await this.#signedRequest(
            order, 
            'post', 
            'https://api.binance.com/api/v3/order',
        )
    }

    async cancelOrder_Spot(order) {
        return await this.#signedRequest(
            order, 
            'delete', 
            'https://api.binance.com/api/v3/order',
        )
    }

    async getAcountInformation_Spot() {
        return await this.#signedRequest(
            null, 
            'get', 
            'https://api.binance.com/api/v3/account',
        )
    }

    async getOpenOrdersWithSymbol_Spot(symbol) {
        return await this.#signedRequest(
            {symbol: symbol},
            'get',
            'https://api.binance.com/api/v3/openOrders',
        )
    }

    async getOpenOrders_Spot() {
        return await this.#signedRequest(
            null,
            'get',
            'https://api.binance.com/api/v3/openOrders',
        )
    }

    async placeTestOrder_Spot(order) {
        return await this.#signedRequest(
            order, 
            'post', 
            'https://api.binance.com/api/v3/order/test',
        )
    }

    async getDepth_Future_USDM(symbol, limit) {
        return await this.#unsignedRequest(
            { symbol: symbol, limit: limit },
            'get',
            'https://fapi.binance.com/fapi/v1/depth'
        )
    }

    async getDepth_Spot(symbol, limit) {
        return await this.#unsignedRequest(
            { symbol: symbol, limit: limit },
            'get',
            'https://api.binance.com/api/v3/depth'
        )
    }

    async #unsignedRequest(parameters, method, baseURL) {
        const queryString = buildQueryString(parameters)
        const res = await axios({
            method: method,
            url: `${baseURL}?${queryString}`,
        })
        return res;
    }

    async #signedRequest(parameters, method, baseURL) {
        const pm = {...parameters}
        pm.timestamp = Date.now() // The current timestamp is a parameter for any request
        const queryString = buildQueryString(pm) // Build query string
        const signature = createHmac('sha256', this.#API_SECRET) // Signature depends on the query string
        .update(queryString)
        .digest('hex')
        const res = await axios({
            method: method,
            url: `${baseURL}?${queryString}&signature=${signature}`,
            headers: {
                'Content-Type': 'application/json',
                'X-MBX-APIKEY': this.#API_KEY,
            }
        })
        return res;
    }

}