
const offersUrl = './offers.json';
    const refersApi = 'https://api.github.com/repos/groww-social/camps/contents/refers.json';
    
    let offers = [];

    const $ = id => document.getElementById(id);

    async function loadOffers() {
      try {
        const res = await fetch(offersUrl);
        offers = await res.json();
        offers.forEach((o, i) => {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = `${o.offer} (₹${o.refer})`;
          $('offer').appendChild(opt);
        });
      } catch (e) {
        alert("Failed to load offers.");
        console.error(e);
      }
    }

    async function saveRefer(upi) {
      const res = await fetch(refersApi, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { content, sha } = await res.json();
      const refers = JSON.parse(atob(content));

      const existing = refers.find(r => r.upi === upi);
      const id = existing ? existing.id : (refers.length + 1).toString();

      if (!existing) {
        refers.push({ upi, id });
        await fetch(refersApi, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: 'Add refer ID',
            content: btoa(JSON.stringify(refers, null, 2)),
            sha
          })
        });
      }

      return id;
    }

    async function handleFormSubmit(event) {
      event.preventDefault();

      const offerIndex = $('offer').value;
      const upi = $('upi').value.trim();

      if (!offerIndex) return alert("Please select an offer.");
      if (!upi.includes('@')) return alert("Please enter a valid UPI ID.");

      const offer = offers[offerIndex];
      const refId = await saveRefer(upi);
      const link = `https://quickcash.tech/c/?o=${offer.id}&r=${refId}`;

      $('ref-link').textContent = link;
      $('output').style.display = 'block';
      $('ref-form').style.display = 'none';
    }

    $('copy').onclick = () => {
      navigator.clipboard.writeText($('ref-link').textContent);
      alert('Link copied to clipboard');
    };

    loadOffers();
