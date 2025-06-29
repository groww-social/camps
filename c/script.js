const offersUrl = 'https://quickcash.tech/offers.json';
const refersUrl = 'https://quickcash.tech/refers.json';

const params = new URLSearchParams(window.location.search);
const offerId = params.get('o');
const referId = params.get('r');

let offer = null;
let referUpi = null;
let referValid = false;

// ✅ Handle UPI form submission (merged & corrected)
async function handleSubmit(event) {
  event.preventDefault();

  const userUpi = document.querySelector('.input-field').value.trim();
  const upiRegex = /^[a-zA-Z0-9._]{2,}@[a-zA-Z0-9]{2,20}$/;

  if (!upiRegex.test(userUpi)) {
    showPopup("⛔ Invalid UPI ID", `
      Bhai, galat UPI ID daala hai!<br>
      Dhyan se sahi UPI ID daal warna paisa nahi milega.<br><br>
      Baad mein mat kehna ki <b style="color:#ff3b30;">Quick Cash</b> paisa nahi deta! 😤
    `);
    return;
  }

  if (!referValid || !referUpi || !offer || !offer.tracking_link) {
    alert('⚠️ Invalid link or data still loading. Please try again.');
    return;
  }

  const trackingLink = offer.tracking_link
    .replace('{user}', encodeURIComponent(userUpi))
    .replace('{refer}', encodeURIComponent(referUpi));

  window.location.href = trackingLink;
}

// Popup for invalid UPI
function showPopup(title, message) {
  const popup = document.createElement('div');
  popup.className = 'popup-bg';
  popup.innerHTML = `
    <div class="popup-box" style="
      background: linear-gradient(135deg, #ffe6e6, #fff0f5, #e3f2fd);
      border: 2px solid #fff;
      box-shadow: 0 12px 30px rgba(0,0,0,0.2);
    ">
      <h3 style="color: #d32f2f; font-size: 22px;">${title}</h3>
      <p style="margin-top: 12px; font-size: 15.5px; color: #444;">${message}</p>
      <div class="btns" style="margin-top: 25px;">
        <button class="yes-btn" style="
          background: linear-gradient(to right, #00c853, #64dd17);
          color: #fff;
          padding: 10px 22px;
          font-size: 15px;
          border-radius: 16px;
          box-shadow: 0 6px 14px rgba(255, 105, 135, 0.4);
          border: none;
        " onclick="this.closest('.popup-bg').remove()">OK</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);
}

// Load offer details
async function loadOfferDetails() {
  try {
    const offerRes = await fetch(offersUrl);
    const offers = await offerRes.json();
    offer = offers.find(o => o.id === offerId);

    if (!offer) {
      document.querySelector('.container').style.display = 'none';
      document.getElementById('offer-not-found').style.display = 'block';
      return;
    }

    if (offer.status && offer.status.toLowerCase() === 'over') {
      document.querySelector('.container').style.display = 'none';
      document.getElementById('offer-not-found').innerHTML = `
        <h2>🚫 Offer Paused</h2>
        <p>This offer is currently paused. We will notify you once it's live again.</p>
      `;
      document.getElementById('offer-not-found').style.display = 'block';
      return;
    }

    document.querySelector('.campaign-name').textContent = offer.offer;
    document.querySelector('.reward-badge').textContent = `₹${offer.User}`;

    const paymentTime = offer.payment?.toLowerCase() || "soon";
    let paymentText = "soon.";
    if (paymentTime.includes("instant")) {
      paymentText = "Instantly.";
    } else if (paymentTime.match(/^\d+\s?(hours|hour|hrs|days|day|minutes|min)$/i)) {
      paymentText = `within ${paymentTime}.`;
    } else {
      paymentText = `within ${paymentTime}.`;
    }

    document.querySelector('.congratulations').textContent =
      `Congratulations! ₹${offer.User} has been successfully credited to your UPI ID ${paymentText}`;

    const ol = document.querySelector('.instructions ol');
    ol.innerHTML = offer.description
      .split('\n')
      .map(step => `<li>${step.trim()}</li>`)
      .join('');

    if (offer.image) {
      document.querySelector('.logo-img').src = offer.image;
    }

  } catch (err) {
    console.error('Error loading offer:', err);
  }
}

// Load refer UPI using referId
async function loadReferUpi() {
  try {
    const referRes = await fetch(refersUrl);
    const refers = await referRes.json();
    const ref = refers.find(r => r.id === referId);
    if (ref) {
      referUpi = ref.upi;
      referValid = true;
    } else {
      referValid = false;
    }
  } catch (err) {
    console.error('Error loading refer upi:', err);
  }
}

// Initialize
loadOfferDetails();
loadReferUpi();
