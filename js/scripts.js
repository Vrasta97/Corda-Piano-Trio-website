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
  const url = "../pdf/CDstrana.pdf"; // 🔹 replace with your PDF file path or URL

  const container = document.getElementById("pdf-container");

  // Load the PDF
  pdfjsLib
    .getDocument(url)
    .promise.then((pdf) => {
      console.log(`PDF loaded (${pdf.numPages} pages)`);

      // Loop through each page
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        pdf.getPage(pageNumber).then((page) => {
          const viewport = page.getViewport({ scale: 3 }); // Adjust scale as needed

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Append canvas before rendering (for smoother loading)
          container.appendChild(canvas);

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          page.render(renderContext);
        });
      }
    })
    .catch((err) => {
      console.error("Error loading PDF:", err);
      container.innerHTML = `<p style="color:red;">Failed to load PDF.</p>`;
    });
});
