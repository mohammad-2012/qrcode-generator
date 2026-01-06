// Select elements
const qrForm = document.querySelector("#qrForm");
const qrcodeInput = document.querySelector(".qrcode-input");
const qrcodeImg = document.querySelector(".qrcode-img");
const successMessage = document.querySelector("#successMessage");
const qrcodeBtn = document.querySelector("#qrcode-btn");
const downloadBtn = document.querySelector("#downloadBtn");
const QRCODEAPI = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=`;

// Reset input style on focus
qrcodeInput.addEventListener("focus", resetInput);

// Handle form submit
qrForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = qrcodeInput.value.trim();
  if (!inputValue) return setError();

  showLoading();

  qrcodeImg.src = QRCODEAPI + encodeURIComponent(inputValue);
  // Set image src
  qrcodeImg.onload = () => {
    showSuccess();
  };
  qrcodeImg.onerror = () => {
    showError("Failed to generate QR code");
  };
});

// Reset input style
function resetInput() {
  qrcodeInput.classList.remove("error");
  qrcodeInput.placeholder = "Enter your text or URL";
}

// Show error for empty input
function setError() {
  qrcodeInput.classList.add("error");
  qrcodeInput.placeholder = "Please enter some text first!";
}

// Show loading
function showLoading() {
  qrcodeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
  qrcodeBtn.disabled = true;
  downloadBtn.classList.remove("show");
}

// Hide loading
function hideLoading() {
  qrcodeBtn.innerHTML = '<i class="fas fa-magic"></i> Generate QR Code';
  qrcodeBtn.disabled = false;
}

// Show success
function showSuccess() {
  hideLoading();
  successMessage.classList.add("show");
  successMessage.textContent = "✅ QR Code generated successfully!";
  successMessage.style.color = "#27ae60";
  qrcodeImg.classList.add("loaded");
  downloadBtn.classList.add("show");

  setTimeout(() => successMessage.classList.remove("show"), 3000);
}

// Show custom error
function showError(msg) {
  hideLoading();
  successMessage.textContent = "❌ " + msg;
  successMessage.style.color = "#e74c3c";
  successMessage.classList.add("show");
  setTimeout(() => successMessage.classList.remove("show"), 3000);
}

// Hide success & reset if input cleared
qrcodeInput.addEventListener("keyup", (e) => {
  if (e.target.value.length === 0) {
    successMessage.classList.remove("show");
    qrcodeImg.classList.remove("loaded");
    downloadBtn.classList.remove("show");
    qrcodeImg.src = "";
  }
});

// Download QR using canvas to bypass CORS
downloadBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!qrcodeImg.src) return;

  try {
    // 1. عکس رو fetch کن
    const response = await fetch(qrcodeImg.src);
    const blob = await response.blob();

    // 2. لینک موقت بساز
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qrcode_${Date.now()}.png`;

    // 3. کلیک کن و پاکش کن
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 4. حافظه رو آزاد کن
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  } catch (error) {
    alert("دانلود موفق نبود! از راست‌کلیک و Save image استفاده کنید.");
  }
});
