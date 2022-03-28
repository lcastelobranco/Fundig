import WebSocket from 'ws';

class SocketClient {
    #ws;
    #onm_cb;
    #ono_cb;
    constructor(url, onopen_callback, onmessage_callback) {
        console.log(`Connecting to ${url}`)
        this.#ws = new WebSocket(url)
        this.#onm_cb = onmessage_callback
        this.#ono_cb = onopen_callback

        this.#ws.onopen = () => {
            console.log(`Websocket connected to ${url}. Subscribing.`)


            const payload = {
                "method": "SUBSCRIBE",
                //"params": ["!markPrice@arr"],
                "params": ["bnbbusd@markPrice"],
                "id": 1
                }
            

            this.send(payload);

            this.#ono_cb()
        }

        this.#ws.on('pong', () => {
            //console.log('Received pong from server')
        })

        this.#ws.on('ping', () => {
            //console.log('Received ping from server. Sending pong')
            this.#ws.pong()
        })

        this.#ws.onclose = (event) => {
            console.log(`Websocket to ${url} closed. Code: ${event.code}, reason: ${event.reason}`)
        }

        this.#ws.onerror = (err) => {
            console.log('Websocket error', err)
        }

        this.#ws.onmessage = (msg) => {
            try {
                const parsedMsg = JSON.parse(msg.data);
                this.#onm_cb(parsedMsg);
            } catch (e) {
                console.log('Parsing failed', e);
            }
        }

        /*setInterval(() => {
            if (this.ready()) {
                this.#ws.ping();
            }
        }, 10000);*/

    }

    send(payload) {
        this.#ws.send(JSON.stringify(payload))
    }

    ready() {
        return this.#ws.readyState === WebSocket.OPEN;
    }
}

export default SocketClient;