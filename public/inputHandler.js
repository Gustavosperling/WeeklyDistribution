// Add event listener to button
document.getElementById("send-button").addEventListener("click", submitForm);

function submitForm() {
  // Get input element
  const inputElement = document.getElementById("input-string");
  const inputValue = inputElement.value;

  // Send data to backend using fetch API
  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rawInput: inputValue }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response from server:", data.completeReport);
      // Handle server response if needed

      if (data.error !== undefined) {
        document.getElementById('output-text').innerHTML = "<b>Error:</b> input string did not match the requirements.";
      } else {
        let htmlContent = '';
  
        data.completeReport.forEach(report => {
          htmlContent += `<U><b>${report.day} (${report.numberCount}):</b></U><br>
          <b>Can go - </b>${report.canGo}<br>
          <b>Cannot go - </b>${report.cannotGo}<br><br>`;
        });
  
        document.getElementById('output-text').innerHTML = htmlContent;
      }
      // // Clear input field
      // inputElement.value = "";
    })
    .catch((error) => {
      console.error("Error sending data to server:", error);
      // Handle error if needed
    });
}


