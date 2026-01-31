/* ================= MATRIX EFFECT ================= */
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "01";
const fontSize = 14;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array.from({ length: columns }).fill(1);

function drawMatrix() {
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff66";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(drawMatrix, 50);

/* ================= CARD LOGIC ================= */

let generatedText = "";

// Only numbers allow
document.getElementById("prefix").addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
});

// Card type detect
function getCardType(bin) {
  if (/^4/.test(bin)) return "VISA";
  if (/^5[1-5]/.test(bin)) return "MASTERCARD";
  if (/^3[47]/.test(bin)) return "AMEX";
  return "UNKNOWN";
}

// Luhn algorithm
function luhnCheck(number) {
  let sum = 0;
  let shouldDouble = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

// Generate valid card
function generateValidCard(prefix) {
  let card = prefix;

  while (card.length < 15) {
    card += Math.floor(Math.random() * 10);
  }

  for (let i = 0; i <= 9; i++) {
    let testCard = card + i;
    if (luhnCheck(testCard)) return testCard;
  }

  return null;
}

// Main generate
function generateCards() {
  const prefix = document.getElementById("prefix").value;
  const result = document.getElementById("result");
  generatedText = "";
  result.innerText = "";

  if (prefix.length > 0 && prefix.length < 6) {
    result.innerText = "> ERROR: BIN must be 6 digits\n";
    return;
  }

  for (let i = 1; i <= 5; i++) {
    const bin = prefix || Math.floor(400000 + Math.random() * 100000).toString();
    const card = generateValidCard(bin);
    const type = getCardType(card);

    generatedText +=
      `> CARD ${i}\n` +
      `  Number : ${card}\n` +
      `  Type   : ${type}\n` +
      `  Luhn   : VALID\n\n`;
  }

  result.innerText = generatedText;
}

// Copy
function copyBIN() {
  if (!generatedText) {
    alert("Nothing to copy!");
    return;
  }
  navigator.clipboard.writeText(generatedText);
  alert("Copied successfully!");
}