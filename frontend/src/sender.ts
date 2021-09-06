import {Payload} from "./models/Payload";

export class Sender {
    sendCallback: Function;
    timeout: number;
    delay: number;

    constructor(sendCallback: Function) {
        this.delay = 3000;
        this.sendCallback = sendCallback;
        this.timeout = window.setTimeout(() => {}, 0);
    }

    send(message: Payload) {
        console.log(this.timeout);
        if (this.timeout) window.clearTimeout(this.timeout);

        this.timeout = window.setTimeout((message: Payload) => {
            console.log("sending " + message.SourceCode);
            this.sendCallback(message);
        }, this.delay, message);
    }
}
