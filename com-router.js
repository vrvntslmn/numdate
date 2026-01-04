class Route extends HTMLElement {
  connectedCallback() {
    const onRoute = () => {
      const content = document.getElementById("content");
      if (!content) return;


      const hash = window.location.hash || "#/";
      const clean = hash.replace(/^#\/?/, "");   
      const path = (clean.split("?")[0] || "").toLowerCase(); // "match"

      switch (path) {
        case "":
          content.innerHTML = "<com-home></com-home>";
          break;
        case "messenger":
          content.innerHTML = "<com-messenger></com-messenger>";
          break;
        case "dateidea":
          content.innerHTML = "<com-dateidea></com-dateidea>";
          break;
        case "profile":
          content.innerHTML = "<com-profile></com-profile>";
          break;
        case "othersprofile":
          content.innerHTML = "<com-othersprofile></com-othersprofile>";
          break;
        case "match":
          content.innerHTML = "<com-match></com-match>";
          break;
        default:
          content.innerHTML = "<com-home></com-home>";
          break;
      }
    };

    window.addEventListener("hashchange", onRoute);


    onRoute();
  }

  urlBurtguuleh(url){
        this.routes.set(url.path, url.content);
    }
}

window.customElements.define("com-router", Route);

    

    

