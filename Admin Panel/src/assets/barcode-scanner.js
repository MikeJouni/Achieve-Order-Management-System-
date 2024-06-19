var barcode = '';
var interval;

document.addEventListener('keydown', function (evt) {
    if (interval)
        clearInterval(interval);
    if (evt.code == 'Enter') {
        if (barcode)
            handleBarcode(barcode);
        barcode = '';
        return;
    }
    if (evt.key != 'Shift')
        barcode += evt.key;
    interval = setInterval(() => barcode = '', 20);
});

// setTimeout(() => {
// handleBarcode('123456789');
//     setTimeout(() => {
//         handleBarcode('123456789');
//         setTimeout(() => {
//             handleBarcode('123456789');
//         }, 5000);
//     }, 5000);
// }, 5000);

function handleBarcode(scanned_barcode) {
    const stockBarcodeInput = document.querySelector('#stock-barcode-input');
    const stockBarcodeBtn = document.querySelector('#stock-barcode-btn');
    if (stockBarcodeInput) { stockBarcodeInput.value = scanned_barcode };
    if (stockBarcodeBtn) { stockBarcodeBtn.click() };
    const driverBarcodeInput = document.querySelector('#driver-barcode-input');
    const driverBarcodeBtn = document.querySelector('#driver-barcode-btn');
    if (driverBarcodeInput) { driverBarcodeInput.value = scanned_barcode };
    if (driverBarcodeBtn) { driverBarcodeBtn.click() };
}