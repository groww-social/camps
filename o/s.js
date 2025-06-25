const offersUrl = 'https://quickcash.tech/offers.json';
const refersUrl = 'https://quickcash.tech/refers.json';

const params = new URLSearchParams(window.location.search);
const offerId = params.get('o');
const referId = params.get('r');

let offer = null;
let referUpi = null;
let referValid = false;

// Load offer details
async function loadOfferDetails() {
  try {
    const offerRes = await fetch(offersUrl);
    const offers = await offerRes.json();
    offer = offers.find(o => o.id === offerId);

    if (!offer) {
      // Show error if offer not found
      document.querySelector('.container').style.display = 'none';
      document.getElementById('offer-not-found').style.display = 'block';
      return;
    }

    // Check offer status
    if (offer.status && offer.status.toLowerCase() === 'over') {
      document.querySelector('.container').style.display = 'none';
      document.getElementById('offer-not-found').innerHTML = `
        <h2>🚫 Offer Paused</h2>
        <p>This offer is currently paused. We will notify you once it's live again.</p>
      `;
      document.getElementById('offer-not-found').style.display = 'block';
      return;
    }

    // Fill details if offer is valid and active
    document.querySelector('.campaign-name').textContent = offer.offer;
    document.querySelector('.reward-badge').textContent = `₹${offer.User}`;

    // Payment Time Text
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

// Handle UPI form submission
async function handleSubmit(e) {
  e.preventDefault();
  const userUpi = document.querySelector('.input-field').value.trim();

  if (!referValid) {
    alert('⚠️ Invalid link. Please use a valid link.');
    return;
  }

  const trackingLink = offer.tracking_link
    .replace('user', encodeURIComponent(userUpi))
    .replace('refer', encodeURIComponent(referUpi));

  // Redirect to the final tracking URL
  window.location.href = trackingLink;
}

// Initialize
loadOfferDetails();
loadReferUpi();
