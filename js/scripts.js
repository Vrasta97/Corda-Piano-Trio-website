/*!
 * Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
 */
//
// Scripts
//

window.addEventListener("DOMContentLoaded", (event) => {
  // Navbar shrink function
  var navbarShrink = function () {
    const navbarCollapsible = document.body.querySelector("#mainNav");
    if (!navbarCollapsible) {
      return;
    }
    if (window.scrollY === 0) {
      navbarCollapsible.classList.remove("navbar-shrink");
    } else {
      navbarCollapsible.classList.add("navbar-shrink");
    }
  };

  // Shrink the navbar
  navbarShrink();

  // Shrink the navbar when page is scrolled
  document.addEventListener("scroll", navbarShrink);

  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector("#mainNav");
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      rootMargin: "0px 0px -40%",
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector(".navbar-toggler");
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll("#navbarResponsive .nav-link")
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener("click", () => {
      if (window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });

  // Contact form submission
  (function () {
    emailjs.init({
      publicKey: "0-SNykgWiXCvytVdm",
    });
  })();

  document
    .getElementById("contactSend")
    .addEventListener("click", function (e) {
      e.preventDefault();

      const params = {
        from_name: document.getElementById("contactName").value,
        from_email: document.getElementById("contactEmail").value,
        subject: document.getElementById("contactSubject").value,
        message: document.getElementById("contactMessage").value,
      };

      emailjs
        .send("service_83dl7ai", "template_eywx3bo", params)
        .then(() => {
          alert("✅ Email sent successfully!");
          document.getElementById("contactFormLocal").reset();
        })
        .catch((error) => {
          console.error("Email failed:", error);
          alert("❌ Failed to send email. Check console for details.");
        });
    });

  // const url = "../pdf/CDstrana.pdf";
  // const canvas = document.getElementById("pdf-canvas");
  // const context = canvas.getContext("2d");

  // pdfjsLib.getDocument(url).promise.then((pdf) => {
  //   pdf.getPage(1).then((page) => {
  //     const viewport = page.getViewport({ scale: 1.5 });
  //     canvas.height = viewport.height;
  //     canvas.width = viewport.width;

  //     const renderContext = { canvasContext: context, viewport: viewport };
  //     page.render(renderContext);
  //   });
  // });
  const url = "../pdf/CDstrana.pdf"; // PDF file path or URL

  const container = document.getElementById("pdf-container");

  // Load the PDF but render lazily to save CPU and memory
  pdfjsLib
    .getDocument(url)
    .promise.then((pdf) => {
      console.log(`PDF loaded (${pdf.numPages} pages)`);

      const scale = 3; // lower scale to reduce canvas size; adjust as needed

      // Helper to render a single page into a canvas (id: canvas-page-<n>)
      const rendered = new Set();

      function renderPage(pageNumber) {
        if (rendered.has(pageNumber)) return;
        rendered.add(pageNumber);

        pdf.getPage(pageNumber).then((page) => {
          const viewport = page.getViewport({ scale });

          let canvas = document.getElementById(`canvas-page-${pageNumber}`);
          if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.id = `canvas-page-${pageNumber}`;
          }

          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Replace placeholder with canvas (if present)
          const placeholder = document.getElementById(
            `placeholder-page-${pageNumber}`
          );
          if (placeholder && placeholder.parentNode) {
            placeholder.parentNode.replaceChild(canvas, placeholder);
          } else {
            container.appendChild(canvas);
          }

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          page.render(renderContext);
        });
      }

      // Create placeholders for each page. Render first page immediately.
      const observerOptions = {
        root: null,
        rootMargin: "200px",
        threshold: 0.05,
      };

      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const p = parseInt(entry.target.dataset.pagenumber, 10);
            renderPage(p);
            obs.unobserve(entry.target);
          }
        });
      }, observerOptions);

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const placeholder = document.createElement("div");
        placeholder.id = `placeholder-page-${pageNumber}`;
        placeholder.className = "pdf-page-placeholder";
        placeholder.style.width = "100%";
        placeholder.style.minHeight = "200px"; // visual space before render
        placeholder.dataset.pagenumber = pageNumber;
        container.appendChild(placeholder);

        if (pageNumber === 1) {
          // render first page immediately for faster perceived load
          renderPage(1);
        } else {
          // lazy render when placeholder comes into view
          io.observe(placeholder);
        }
      }
    })
    .catch((err) => {
      console.error("Error loading PDF:", err);
      container.innerHTML = `<p style="color:red;">Failed to load PDF.</p>`;
    });
});
