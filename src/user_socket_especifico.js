import axios from "axios";
import SocketClient from "./socket_padrao.js";

export class UserDataStreamBinance {
    #listenKey;
    #socket;

    constructor(API_KEY, 
        msg_callback,
        listen_key_url = 'https://api.binance.com/api/v3/userDataStream',
        socket_url = 'wss://fstream.binance.com:9443/ws') {
        
        // Generate listen key for the given api key
        axios({
            method: 'post',
            url: listen_key_url,
            headers: {
                'Content-Type': 'application/json',
                'X-MBX-APIKEY': API_KEY,
            }
        })
        .then((response) => {
            this.#listenKey = response.data.listenKey
            
            // Connect to user data stream (after that, we're listening to all the information related to orders and fills)
            this.#socket = new SocketClient(`${socket_url}/${this.#listenKey}`,
            () => {},
            (msg) => {
                msg_callback(msg);
            })

            // Set timer to keep renewing listen key every 45 min
            setInterval(() => {
                axios({
                    method: 'put',
                    url: `${listen_key_url}?listenKey=${this.#listenKey}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-MBX-APIKEY': API_KEY,
                    }
                })
                .then((response) => {console.log('Renewing listen key')})
                .catch((error) => console.log(error))
            }, 1000 * 60 * 45)

        })
        .catch((error) => {
            console.log(error)
        })
            

    }

}