import { Download, Printer, Copy, Check } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";
import styles from "./QRCode.module.css";

export default function QRCode({

    value = "",

    title = "FoodTrace Product"

}) {

    const qrRef = useRef(null);

    const [copied,setCopied] = useState(false);

    function downloadQR(){

        const canvas = qrRef.current.querySelector("canvas");

        const url = canvas.toDataURL("image/png");

        const a = document.createElement("a");

        a.href = url;

        a.download = `${title}.png`;

        a.click();

    }

    function printQR(){

        const canvas = qrRef.current.querySelector("canvas");

        const url = canvas.toDataURL();

        const win = window.open("");

        win.document.write(`<img src="${url}" style="width:300px"/>`);

        win.print();

    }

    async function copyLink(){

        await navigator.clipboard.writeText(value);

        setCopied(true);

        setTimeout(()=>setCopied(false),2000);

    }

    return(

        <div className={styles.card}>

            <h2>QR Code</h2>

            <div
                className={styles.qr}
                ref={qrRef}
            >

                <QRCodeCanvas

                    value={value}

                    size={220}

                    includeMargin

                />

            </div>

            <div className={styles.actions}>

                <button onClick={downloadQR}>

                    <Download size={18}/>

                    Download

                </button>

                <button onClick={printQR}>

                    <Printer size={18}/>

                    Print

                </button>

                <button onClick={copyLink}>

                    {

                        copied ?

                        <Check size={18}/>

                        :

                        <Copy size={18}/>

                    }

                    {

                        copied ?

                        "Copied"

                        :

                        "Copy Link"

                    }

                </button>

            </div>

        </div>

    );

}