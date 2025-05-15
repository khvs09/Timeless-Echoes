// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if current page is home page
    const isHomePage = document.querySelector('.hero') !== null;
    
    // Add class to body if on home page
    if (isHomePage) {
        document.body.classList.add('home-page');
    }
    
    // Mobile article card optimization
    function optimizeMobileCards() {
        if (window.innerWidth <= 768) {
            const articleCards = document.querySelectorAll('.article-card');
            
            articleCards.forEach(card => {
                // Ensure horizontal layout
                card.style.display = 'flex';
                card.style.flexDirection = 'row';
                
                // Get image wrapper and content
                const imageWrapper = card.querySelector('.article-image-wrapper');
                const content = card.querySelector('.article-content');
                
                if (imageWrapper && content) {
                    // Set proper widths
                    imageWrapper.style.width = '40%';
                    content.style.width = '60%';
                    
                    // Hide excerpt on mobile
                    const excerpt = content.querySelector('.article-excerpt');
                    if (excerpt) {
                        excerpt.style.display = 'none';
                    }
                }
            });
        }
    }
    
    // Run on page load
    optimizeMobileCards();
    
    // Run on resize
    window.addEventListener('resize', function() {
        optimizeMobileCards();
    });
    
    // Header scroll effect for home page
    if (isHomePage) {
        const header = document.querySelector('header');
        const heroSection = document.querySelector('.hero');
        
        if (header && heroSection) {
            // Always add scrolled class on mobile devices
            if (window.innerWidth <= 768) {
                header.classList.add('scrolled');
            }
            
            const heroHeight = heroSection.offsetHeight;
            
            window.addEventListener('scroll', function() {
                if (window.scrollY > 60) {
                    header.classList.add('scrolled');
                } else if (window.innerWidth > 768) {
                    // Only remove scrolled class on desktop
                    header.classList.remove('scrolled');
                }
            });
        }
    } else {
        // For non-home pages, ensure header always has background color
        const header = document.querySelector('header');
        if (header) {
            header.classList.add('scrolled');
        }
    }

    // Handle hero image loading
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // Create a new image element to test if the hero image URL is valid
        const img = new Image();
        // Extract the background image URL from the hero section's style
        const bgImage = window.getComputedStyle(heroSection).backgroundImage;
        const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
        
        if (urlMatch && urlMatch[1]) {
            const imageUrl = urlMatch[1];
            img.src = imageUrl;
            
            // If image fails to load, apply fallback styling
            img.onerror = function() {
                console.error('Hero image failed to load:', imageUrl);
                heroSection.style.background = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), #333';
                
                // Show an error message to the admin (if logged in)
                if (document.body.classList.contains('admin')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'flash-message';
                    errorMsg.style.backgroundColor = '#f8d7da';
                    errorMsg.style.color = '#721c24';
                    errorMsg.textContent = 'Hero image failed to load. Please check the file path.';
                    
                    const flashMessages = document.querySelector('.flash-messages');
                    if (flashMessages) {
                        flashMessages.appendChild(errorMsg);
                        setTimeout(() => {
                            errorMsg.style.display = 'none';
                        }, 5000);
                    }
                }
            };
        } else {
            // If no background image URL was found
            heroSection.style.background = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), #333';
        }
    }

    // Flash message auto-dismiss
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(message => {
        setTimeout(() => {
            message.style.display = 'none';
        }, 5000);
    });

    // Form validation for the article form
    const articleForm = document.querySelector('.article-form');
    if (articleForm) {
        articleForm.addEventListener('submit', function(e) {
            const title = document.getElementById('title').value.trim();
            const description = document.getElementById('description').value.trim();
            const state = document.getElementById('state').value.trim();
            const district = document.getElementById('district').value.trim();
            const village = document.getElementById('village').value.trim();
            
            let isValid = true;
            
            if (title.length < 5) {
                document.getElementById('title').classList.add('error');
                isValid = false;
            } else {
                document.getElementById('title').classList.remove('error');
            }
            
            if (description.length < 10) {
                document.getElementById('description').classList.add('error');
                isValid = false;
            } else {
                document.getElementById('description').classList.remove('error');
            }
            
            if (!state) {
                document.getElementById('state').classList.add('error');
                isValid = false;
            } else {
                document.getElementById('state').classList.remove('error');
            }
            
            if (!district) {
                document.getElementById('district').classList.add('error');
                isValid = false;
            } else {
                document.getElementById('district').classList.remove('error');
            }
            
            if (!village) {
                document.getElementById('village').classList.add('error');
                isValid = false;
            } else {
                document.getElementById('village').classList.remove('error');
            }
            
            if (!isValid) {
                e.preventDefault();
                window.scrollTo(0, 0);
                
                const errorMessage = document.createElement('div');
                errorMessage.className = 'flash-message';
                errorMessage.style.backgroundColor = '#f8d7da';
                errorMessage.style.color = '#721c24';
                errorMessage.textContent = 'Please fix the errors in the form.';
                
                const flashMessages = document.querySelector('.flash-messages');
                flashMessages.appendChild(errorMessage);
                
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 5000);
            }
        });
    }

    // Image preview for article creation
    const imageInput = document.getElementById('image');
    if (imageInput) {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Check if preview already exists, otherwise create it
                    let preview = document.querySelector('.image-preview');
                    if (!preview) {
                        preview = document.createElement('div');
                        preview.className = 'image-preview';
                        preview.style.marginTop = '10px';
                        preview.style.maxWidth = '300px';
                        preview.style.borderRadius = '5px';
                        preview.style.overflow = 'hidden';
                        imageInput.parentNode.appendChild(preview);
                    }
                    
                    // Create or update image element
                    let img = preview.querySelector('img');
                    if (!img) {
                        img = document.createElement('img');
                        img.style.width = '100%';
                        img.style.height = 'auto';
                        preview.appendChild(img);
                    }
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Comment form validation
    const commentForm = document.querySelector('.comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            const commentBody = document.getElementById('body').value.trim();
            
            if (!commentBody) {
                e.preventDefault();
                const errorMessage = document.createElement('span');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Comment cannot be empty.';
                
                // Remove any existing error messages
                const existingErrors = this.querySelectorAll('.error-message');
                existingErrors.forEach(error => error.remove());
                
                // Add the error message
                document.getElementById('body').parentNode.appendChild(errorMessage);
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Ensure navigation is responsive and always visible
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');

    if (nav && navLinks) {
        // Set up responsive navigation
        function handleResponsiveNav() {
            // Always ensure nav links are visible
            navLinks.style.display = 'flex';
            
            if (window.innerWidth <= 768) {
                // Mobile styling - horizontal row with wrapping
                navLinks.style.flexDirection = 'row';
                navLinks.style.flexWrap = 'wrap';
                navLinks.style.justifyContent = 'center';
            } else {
                // Desktop styling - horizontal row
                navLinks.style.flexDirection = 'row';
                navLinks.style.flexWrap = 'nowrap';
            }
        }

        // Run once on load and add event listener for window resize
        handleResponsiveNav();
        window.addEventListener('resize', handleResponsiveNav);
    }

    // Set up search functionality
    const searchInput = document.querySelector('.search-input');
    const searchResultsDropdown = document.getElementById('search-results-dropdown');
    
    if (searchInput && searchResultsDropdown) {
        let debounceTimer;
        
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            clearTimeout(debounceTimer);
            
            if (query.length < 3) {
                searchResultsDropdown.style.display = 'none';
                return;
            }
            
            debounceTimer = setTimeout(() => {
                fetch(`/api/search?query=${encodeURIComponent(query)}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.results.length > 0) {
                            let resultsHTML = '';
                            
                            data.results.forEach(result => {
                                resultsHTML += `
                                    <div class="search-result-item">
                                        <a href="${result.url}" class="search-result-link">
                                            <div class="search-result-image">
                                                <img src="${result.image_path.startsWith('/') ? result.image_path : '/static/' + result.image_path}" alt="${result.title}">
                                            </div>
                                            <div class="search-result-info">
                                                <h4>${result.title}</h4>
                                                <p>${result.description}</p>
                                                <div class="search-result-location">
                                                    <i class="fas fa-map-marker-alt"></i> ${result.state}, ${result.district}
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                `;
                            });
                            
                            resultsHTML += `
                                <div class="view-all-results">
                                    <a href="/search?query=${encodeURIComponent(query)}">View all results <i class="fas fa-arrow-right"></i></a>
                                </div>
                            `;
                            
                            searchResultsDropdown.innerHTML = resultsHTML;
                            searchResultsDropdown.style.display = 'block';
                        } else {
                            searchResultsDropdown.innerHTML = '<div class="no-search-results">No results found</div>';
                            searchResultsDropdown.style.display = 'block';
                        }
                    })
                    .catch(error => {
                        console.error('Search error:', error);
                    });
            }, 300);
        });
        
        // Hide search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResultsDropdown.contains(e.target)) {
                searchResultsDropdown.style.display = 'none';
            }
        });
    }
});

// Check if hero image is properly loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if hero image is properly loaded
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // Get the computed style of the hero section
        const style = getComputedStyle(heroSection);
        const bgImage = style.backgroundImage;
        
        // Log background image status
        console.log('Hero background image:', bgImage);
        
        // If background image is not loading correctly
        if (bgImage === 'none' || bgImage.includes('invalid')) {
            console.warn('Hero image not loading correctly. Using fallback styling.');
            heroSection.style.backgroundColor = '#333';
        }
    }
});