const repo = "groww-social/camps";  
const filePath = "offers.json";  

async function fetchCurrentData() {  
  const res = await fetch(https://api.github.com/repos/${repo}/contents/${filePath}, {
    headers: { Authorization: token ${token} }
  });  
  const data = await res.json();  
  const content = atob(data.content);  
  return { json: JSON.parse(content), sha: data.sha };  
}  

document.getElementById("campaignForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const statusBox = document.getElementById("statusText");
  statusBox.textContent = "Saving...";

  const newCampaign = {
    offer: document.getElementById("offer").value.trim(),
    id: document.getElementById("id").value.trim(),
    User: document.getElementById("User").value.trim(),
    refer: document.getElementById("refer").value.trim(),
    status: document.getElementById("status").value,
    payment: document.getElementById("payment").value,
    description: document.getElementById("description").value.trim(),
    tracking_link: document.getElementById("tracking_link").value.trim()
  };

  try {
    const { json, sha } = await fetchCurrentData();
    json.push(newCampaign);
    const updatedContent = btoa(JSON.stringify(json, null, 2));

    await fetch(https://api.github.com/repos/${repo}/contents/${filePath}, {
      method: "PUT",
      headers: {
        Authorization: token ${token},
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Added new campaign",
        content: updatedContent,
        sha: sha
      })
    });

    statusBox.textContent = "✅ Campaign saved successfully!";
    document.getElementById("campaignForm").reset();

  } catch (err) {
    console.error(err);
    statusBox.textContent = "❌ Failed to save campaign.";
  }
});

function addNewLine() {  
  const textarea = document.getElementById("description");  
  const cursorPosition = textarea.selectionStart;  
  const value = textarea.value;  
  textarea.value = value.substring(0, cursorPosition) + "\n" + value.substring(cursorPosition);  
  textarea.focus();  
  textarea.selectionEnd = cursorPosition + 1;  
}
