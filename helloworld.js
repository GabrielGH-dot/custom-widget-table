(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      .helloworld-container {
        font-family: Arial, sans-serif;
        text-align: center;
        margin: auto;
        padding: 20px;
        background-color: #f4f4f4;
        border: 1px solid #ddd;
        border-radius: 5px;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .helloworld-container h1 {
        font-size: 24px;
        color: #333;
      }
    </style>
    <div class="helloworld-container">
      <h1 id="text">Hello, SAC World!</h1>
    </div>
  `;

  class HelloWorld extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.textElement = this.shadowRoot.querySelector("#text");
    }

    static get observedAttributes() {
      return ["text"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "text" && this.textElement) {
        this.textElement.textContent = newValue;
      }
    }
  }

  customElements.define("hello-world", HelloWorld);
})();