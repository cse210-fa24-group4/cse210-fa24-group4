class AboutUs extends HTMLElement {
  /**
   * Lifecycle method that is called when the custom element is added to the DOM.
   * It sets up the inner HTML of the `AboutUs` component, which includes
   * rendering a team section with details of team members. The section consists
   * of a grid layout, where each team member is represented by their name and role.
   * Additionally, it includes styles for the component to ensure proper display.
   */
  connectedCallback() {
    const teamMembers = [
      { name: "Nikhil Gautam", role: "Chef de Cuisine" },
      { name: "Samyak Mehta", role: "Chef de Cuisine" },
      { name: "Jake Norbie", role: "Chef de Partie" },
      { name: "Adrian Layer", role: "Chef de Partie" },
      { name: "Tim Kraemer", role: "Chef de Partie" },
      { name: "Anusha Ravichandran", role: "Chef de Partie" },
      { name: "Yunhao Jiang", role: "Sous Chef" },
      { name: "Laura Tian", role: "Décorateur" },
      { name: "Hailey Li", role: "Aboyeur" },
    ];

    const teamGrid = teamMembers
      .map(
        (member) => `
          <div class="team-member">
            <h2>${member.name}</h2>
            <p>${member.role}</p>
          </div>
        `,
      )
      .join("");

    this.innerHTML = `
      <link rel="stylesheet" href="about-us/about-us.css">
      <section class="about-us">
        <section class="tool-header">
          <h1>About Us</h1>
          <p>Welcome to Backend Buddy! We are Pineapple Pipeline and we are dedicated to providing the best backend tools for your needs. Our team is composed of experienced developers who are passionate about creating useful and efficient software solutions.</p>
          <p>Feel free to explore our features and tools and we hope you enjoy!</p>
        </section>
        <div class="team-grid">
          ${teamGrid}
        </div>
      </section>
    `;
  }
}

// Register the custom element
customElements.define("about-us", AboutUs);
