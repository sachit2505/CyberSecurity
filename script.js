let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let imageInput = document.getElementById('imageInput');
let messageBox = document.getElementById('message');
let decodedMessage = document.getElementById('decodedMessage');

imageInput.addEventListener('change', function () {
  let reader = new FileReader();
  reader.onload = function (e) {
    let img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(imageInput.files[0]);
});

function encodeMessage() {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const message = messageBox.value + '|'; // End marker

  let binMsg = '';
  for (let i = 0; i < message.length; i++) {
    binMsg += message[i].charCodeAt(0).toString(2).padStart(8, '0');
  }

  for (let i = 0; i < binMsg.length; i++) {
    data[i * 4] = (data[i * 4] & ~1) | parseInt(binMsg[i]); // LSB of Red
  }

  ctx.putImageData(imgData, 0, 0);
  alert("✅ Message encoded successfully.");
}

function downloadImage() {
  const link = document.createElement('a');
  link.download = 'encoded_image.png';
  link.href = canvas.toDataURL();
  link.click();
}

function decodeMessage() {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  let binMsg = '';
  for (let i = 0; i < data.length; i += 4) {
    binMsg += (data[i] & 1).toString(); // LSB of Red
  }

  let msg = '';
  for (let i = 0; i < binMsg.length; i += 8) {
    let byte = binMsg.substr(i, 8);
    let char = String.fromCharCode(parseInt(byte, 2));
    if (char === '|') break;
    msg += char;
  }

  decodedMessage.textContent = "🕵️‍♀️ Hidden Message: " + msg;
}
