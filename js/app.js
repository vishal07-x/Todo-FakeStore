document.addEventListener("DOMContentLoaded", () => {
  TodoApp.init();
  ProductApp.init();

  const navLinks = document.querySelectorAll(".nav-link, .brand");
  const pages = {
    todo: document.querySelector("#todo-page"),
    products: document.querySelector("#products-page")
  };

  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();

      const page = link.dataset.page;
      if (!page) return;

      Object.entries(pages).forEach(([name, section]) => {
        section.classList.toggle("active-page", name === page);
      });

      document.querySelectorAll(".nav-link").forEach(nav => {
        nav.classList.toggle("active", nav.dataset.page === page);
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
});
