document.addEventListener("DOMContentLoaded", function() {
  function setAccordionEventListeners() {
      var accordions = document.querySelectorAll('.accordion-toggle');
      if (window.innerWidth < 760) {
          accordions.forEach(function(accordion) {
              accordion.addEventListener('click', toggleAccordion);
          });
      } else {
          accordions.forEach(function(accordion) {
              accordion.removeEventListener('click', toggleAccordion);
              accordion.classList.remove('open');
              accordion.nextElementSibling.style.display = 'block'; 
          });
      }
  }

  function toggleAccordion() {
      var accordions = document.querySelectorAll('.accordion-toggle');
      accordions.forEach(function(otherAccordion) {
          if (otherAccordion !== this) {
              otherAccordion.classList.remove('open');
              otherAccordion.nextElementSibling.style.display = 'none';
          }
      }.bind(this));
      this.classList.toggle('open');
      var content = this.nextElementSibling;
      if (content.style.display === 'block') {
          content.style.display = 'none';
      } else {
          content.style.display = 'block';
      }
  }

  setAccordionEventListeners();

  window.addEventListener('resize', function() {
      setAccordionEventListeners();
  });
});
