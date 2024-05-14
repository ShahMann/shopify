document.addEventListener("DOMContentLoaded", function() {
    var accordions = document.querySelectorAll('.accordion-toggle');
    accordions.forEach(function(accordion) {
      accordion.addEventListener('click', function() {
        // Close any open accordions
        accordions.forEach(function(otherAccordion) {
          if (otherAccordion!== accordion) {
            otherAccordion.classList.remove('open');
            otherAccordion.nextElementSibling.style.display = 'none';
          }
        });
  
        // Toggle the clicked accordion
        this.classList.toggle('open');
        var content = this.nextElementSibling;
        if (content.style.display === 'block') {
          content.style.display = 'none';
        } else {
          content.style.display = 'block';
        }
      });
    });
  });