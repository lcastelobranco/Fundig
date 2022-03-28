import Big from 'big.js';
import pkg from "pg";
import SocketClient from './src/socket_padrao.js';

 



var userstream_socket_url = 'wss://stream.binance.com:9443/ws';
userstream_socket_url = 'wss://fstream.binance.com/ws';





const fr_stream = new SocketClient(
    userstream_socket_url, 
    //(p) => {p({"method": "SUBSCRIBE","params": ["bnbbusd@markPrice"],"id": 1})}, 
    (v) => {console.log(v)},
    (v) => {console.log(v)}
);

