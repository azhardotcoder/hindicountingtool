    document.addEventListener('DOMContentLoaded', () => {
        // Function to handle page navigation
        const pages = document.querySelectorAll('.page');
        const navButtons = document.querySelectorAll('.nav-btn');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const navbarMenu = document.getElementById('navbar-sticky');

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetPage = button.getAttribute('data-target');
        
                // Hide all pages
                pages.forEach(page => {
                    page.classList.add('hidden');
                });
        
                // Show the selected page
                document.getElementById(targetPage).classList.remove('hidden');

                // If the navbar menu is open on mobile, close it after clicking
                if (!navbarMenu.classList.contains('hidden')) {
                    navbarMenu.classList.add('hidden'); // Hide the navbar after clicking
                }
            });
        });

        // Initially show the Counter page (default)
        document.getElementById('counter-page').classList.remove('hidden');

        // Mobile menu toggle
        mobileMenuButton.addEventListener('click', () => {
            navbarMenu.classList.toggle('hidden');
        });
    });
