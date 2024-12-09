class JsonFormatterTool extends HTMLElement {
  /**
   * Initializes a new instance of JsonFormatterTool.
   * Sets up initial properties for toolPanel, formatBtn, inputArea, and outputArea as null.
   */
  constructor() {
    super();
    this.toolPanel = null;
    this.formatBtn = null;
    this.inputArea = null;
    this.outputArea = null;
    this.copyBtn = null;
    this.downloadBtn = null;
    this.uploadBtn = null;
    this.copyNotification = null;
    this.downloadNotification = null;
  }

  /**
   * Called when the element is added to the DOM.
   * Sets up the HTML structure of the tool and stores references to elements.
   * Binds event listeners for the "Format" button.
   */
  connectedCallback() {
    // Set up the HTML structure when the element is added to the DOM
    this.innerHTML = `
      <link rel="stylesheet" href="json-formatter/json-formatter-tool.css" > 
      <section class="tool-panel" style="display:none;">
        <header class="tool-header">
          <h3>JSON Formatter</h3>
        </header>
        <section class="tool-content">
          <textarea class="input-area" placeholder="Paste your JSON here"></textarea>
          <button class="format-btn">Format</button>
          <textarea class="output-area" readonly></textarea>
          <div align="center" class="button-group">
            <div class="copy-btn-container">
              <div class="notification-wrapper">
                <div class="notification">Copied to clipboard!</div>
              </div>
              <button class="copy-btn">Copy to Clipboard</button>
            </div>
            <div class="download-btn-container">
              <div class="notification-wrapper">
                <div class="notification">Downloaded file!</div>
              </div>
              <button class="download-btn">Download JSON File</button>
            </div>
          </div> 
        </section>
      </section>
      `;

    // Store references to elements
    this.toolPanel = this.querySelector(".tool-panel");
    this.formatBtn = this.querySelector(".format-btn");
    this.inputArea = this.querySelector(".input-area");
    this.outputArea = this.querySelector(".output-area");
    this.copyBtn = this.querySelector(".copy-btn");
    this.downloadBtn = this.querySelector(".download-btn");
    this.copyNotification = this.querySelector(
      ".copy-btn-container .notification",
    );
    this.downloadNotification = this.querySelector(
      ".download-btn-container .notification",
    );

    // Bind event listeners
    this.formatBtn.addEventListener("click", this.formatJson);
    this.copyBtn.addEventListener("click", this.copyToClipboard.bind(this));
    this.downloadBtn.addEventListener("click", this.downloadJson.bind(this));
  }

  showNotification(notification, message) {
    notification.textContent = message;
    notification.classList.add("show");

    // Hide notification after 2 seconds
    setTimeout(() => {
      notification.classList.remove("show");
    }, 1000);
  }

  /**
   * Formats the input JSON and updates the output area.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
   */
  formatJson = () => {
    try {
      const input = this.inputArea.value;
      if (input) {
        const parsed = JSON.parse(input);
        this.outputArea.value = JSON.stringify(parsed, null, 2);
        this.copyBtn.disabled = false;
        this.downloadBtn.disabled = false;
      }
    } catch (error) {
      this.outputArea.value = `Error: ${error.message}`;
      // Disable the buttons if JSON is invalid
      this.copyBtn.disabled = true;
      this.downloadBtn.disabled = true;
    }
  };

  /**
   * Cleans up event listeners when the element is removed from the DOM.
   * @see https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks
   */
  disconnectedCallback() {
    // Clean up event listeners when the element is removed from the DOM
    if (this.formatBtn)
      this.formatBtn.removeEventListener("click", this.formatJson);
    if (this.copyBtn)
      this.copyBtn.removeEventListener("click", this.copyToClipboard);
    if (this.downloadBtn)
      this.downloadBtn.removeEventListener("click", this.downloadJson);
    if (this.uploadBtn)
      this.uploadBtn.removeEventListener("change", this.handleFileUpload);
  }

  /**
   * The `copyToClipboard` function copies the content of an output area to the clipboard and displays
   * a notification based on the outcome.
   */
  copyToClipboard() {
    const output = this.outputArea.value;
    if (output) {
      navigator.clipboard
        .writeText(output)
        .then(() =>
          this.showNotification(this.copyNotification, "Copied to clipboard!"),
        )
        .catch(() =>
          this.showNotification(
            this.copyNotification,
            "Failed to copy to clipboard",
          ),
        );
    } else {
      this.showNotification(this.copyNotification, "Nothing to copy!");
    }
  }

  /**
   * The `downloadJson` function downloads a JSON file with formatted content if available, and
   * displays a notification accordingly.
   */
  downloadJson() {
    const formattedJson = this.outputArea.value;
    if (formattedJson) {
      const blob = new Blob([formattedJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "formatted.json";
      a.click();
      URL.revokeObjectURL(url);
      this.showNotification(this.downloadNotification, "JSON file downloaded!");
    } else {
      this.showNotification(this.downloadNotification, "No JSON to download!");
    }
  }
}

// Register the custom element
customElements.define("json-formatter-tool", JsonFormatterTool);
