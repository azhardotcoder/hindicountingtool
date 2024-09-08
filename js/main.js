// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Function to handle page navigation
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetPage = button.getAttribute('data-target');
      
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.add('hidden');
            });
      
            // Show the selected page
            document.getElementById(targetPage).classList.remove('hidden');
        });
    });
  
    // Initially show the Counter page (default)
    document.getElementById('counter-page').classList.remove('hidden');

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const navbarMenu = document.getElementById('navbar-sticky');

    mobileMenuButton.addEventListener('click', () => {
        navbarMenu.classList.toggle('hidden');
    });
});
