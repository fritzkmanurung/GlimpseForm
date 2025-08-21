document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('feedbackForm');
    const nameInput = document.getElementById('nameInput');
    const nameGroup = document.getElementById('nameGroup');
    const emailInput = document.getElementById('emailInput');
    const emailGroup = document.getElementById('emailGroup');
    const feedbackType = document.getElementById('feedbackType');
    const typeGroup = document.getElementById('typeGroup');
    const feedbackInput = document.getElementById('feedbackInput');
    const feedbackGroup = document.getElementById('feedbackGroup');
    const charCounter = document.getElementById('charCounter');
    const ratingStars = document.querySelectorAll('.rating-star');
    const ratingDescription = document.getElementById('ratingDescription');
    const submitBtn = document.getElementById('submitBtn');
    const themeToggle = document.getElementById('themeToggle');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');
    const removeFile = document.getElementById('removeFile');
    const toastContainer = document.getElementById('toastContainer');
    const confettiContainer = document.getElementById('confettiContainer');
    const particlesContainer = document.getElementById('particles');
    
    // Variables
    let selectedRating = 0;
    let attachedFile = null;
    const ratingDescriptions = [
        "",
        "Poor - Very dissatisfied",
        "Fair - Somewhat dissatisfied",
        "Good - Neutral",
        "Very Good - Satisfied",
        "Excellent - Very satisfied"
    ];
    
    // Initialize form
    function initForm() {
        createParticles();
        setupEventListeners();
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('themePreference');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    // Create animated background particles
    function createParticles() {
        const particlesCount = 30;
        
        for (let i = 0; i < particlesCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random size, position, and animation delay
            const size = Math.random() * 20 + 5;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 15;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}vw`;
            particle.style.top = `${posY}vh`;
            particle.style.animationDelay = `${delay}s`;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Input validation
        nameInput.addEventListener('input', () => validateField(nameInput, nameGroup, validateName));
        emailInput.addEventListener('input', () => validateField(emailInput, emailGroup, validateEmail));
        feedbackType.addEventListener('change', () => validateField(feedbackType, typeGroup, validateFeedbackType));
        feedbackInput.addEventListener('input', function() {
            validateField(feedbackInput, feedbackGroup, validateFeedback);
            updateCharCounter();
        });
        
        // Rating stars interaction
        ratingStars.forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.dataset.value);
                updateRatingDisplay();
            });
            
            star.addEventListener('mouseover', () => {
                if (!selectedRating) {
                    const value = parseInt(star.dataset.value);
                    highlightStars(value);
                }
            });
            
            star.addEventListener('mouseout', () => {
                if (!selectedRating) {
                    resetStars();
                } else {
                    highlightStars(selectedRating);
                }
            });
        });
        
        // File upload
        fileInput.addEventListener('change', handleFileUpload);
        removeFile.addEventListener('click', removeAttachedFile);
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitFeedback();
        });
        
        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Validate individual field
    function validateField(input, group, validationFn) {
        const value = input.value.trim();
        const error = validationFn(value);
        
        if (error) {
            group.classList.add('error');
            group.querySelector('.error-message').textContent = error;
            return false;
        } else {
            group.classList.remove('error');
            return true;
        }
    }
    
    // Validate name
    function validateName(name) {
        if (!name) return 'Name is required';
        if (name.length < 2) return 'Name must be at least 2 characters';
        return '';
    }
    
    // Validate email
    function validateEmail(email) {
        if (!email) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email';
        return '';
    }
    
    // Validate feedback type
    function validateFeedbackType(type) {
        if (!type) return 'Please select a feedback type';
        return '';
    }
    
    // Validate feedback text
    function validateFeedback(feedback) {
        if (!feedback) return 'Feedback is required';
        if (feedback.length < 10) return 'Feedback must be at least 10 characters';
        return '';
    }
    
    // Validate rating
    function validateRating() {
        if (!selectedRating) {
            showToast('error', 'Rating Required', 'Please select a rating');
            return false;
        }
        return true;
    }
    
    // Update character counter
    function updateCharCounter() {
        const count = feedbackInput.value.length;
        charCounter.textContent = `${count}/500`;
        
        if (count > 450) {
            charCounter.classList.add('error');
        } else {
            charCounter.classList.remove('error');
        }
    }
    
    // Update rating display
    function updateRatingDisplay() {
        resetStars();
        highlightStars(selectedRating);
        ratingDescription.textContent = ratingDescriptions[selectedRating];
        ratingDescription.style.color = 'var(--warning)';
    }
    
    // Highlight stars up to given value
    function highlightStars(value) {
        ratingStars.forEach(star => {
            if (parseInt(star.dataset.value) <= value) {
                star.classList.add('hover');
            }
        });
    }
    
    // Reset stars highlighting
    function resetStars() {
        ratingStars.forEach(star => {
            star.classList.remove('hover');
            if (parseInt(star.dataset.value) <= selectedRating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
    
    // Handle file upload
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Check if file is an image
        if (!file.type.match('image.*')) {
            showToast('error', 'Invalid File', 'Please select an image file');
            return;
        }
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast('error', 'File Too Large', 'Please select an image under 5MB');
            return;
        }
        
        attachedFile = file;
        fileName.textContent = file.name;
        filePreview.classList.add('active');
    }
    
    // Remove attached file
    function removeAttachedFile() {
        attachedFile = null;
        fileInput.value = '';
        filePreview.classList.remove('active');
    }
    
    // Toggle dark/light theme
    function toggleTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('themePreference', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('themePreference', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    // Show toast notification
    function showToast(type, title, message) {
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="close-toast"><i class="fas fa-times"></i></button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Close toast on button click
        toast.querySelector('.close-toast').addEventListener('click', () => {
            hideToast(toast);
        });
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            hideToast(toast);
        }, 5000);
    }
    
    // Hide toast notification
    function hideToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
    
    // Create confetti effect
    function createConfetti() {
        confettiContainer.style.display = 'block';
        confettiContainer.innerHTML = '';
        
        const confettiCount = 150;
        const colors = ['var(--primary)', 'var(--secondary)', 'var(--warning)', 'var(--danger)'];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // Random properties
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 10 + 5;
            const posX = Math.random() * 100;
            const duration = Math.random() * 3 + 2;
            
            confetti.style.backgroundColor = color;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.left = `${posX}%`;
            confetti.style.animation = `confettiFall ${duration}s linear forwards`;
            
            confettiContainer.appendChild(confetti);
        }
        
        // Hide confetti after animation
        setTimeout(() => {
            confettiContainer.style.display = 'none';
        }, 3000);
    }
    
    // Submit feedback
    function submitFeedback() {
        // Validate all fields
        const isNameValid = validateField(nameInput, nameGroup, validateName);
        const isEmailValid = validateField(emailInput, emailGroup, validateEmail);
        const isTypeValid = validateField(feedbackType, typeGroup, validateFeedbackType);
        const isFeedbackValid = validateField(feedbackInput, feedbackGroup, validateFeedback);
        const isRatingValid = validateRating();
        
        if (!isNameValid || !isEmailValid || !isTypeValid || !isFeedbackValid || !isRatingValid) {
            // Show error for first invalid field
            if (!isNameValid) nameInput.focus();
            else if (!isEmailValid) emailInput.focus();
            else if (!isTypeValid) feedbackType.focus();
            else if (!isFeedbackValid) feedbackInput.focus();
            return;
        }
        
        // Simulate form submission
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        setTimeout(() => {
            // In a real app, you would send data to server here
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                type: feedbackType.value,
                feedback: feedbackInput.value.trim(),
                rating: selectedRating,
                file: attachedFile ? attachedFile.name : null,
                timestamp: new Date().toISOString()
            };
            
            console.log('Form submitted:', formData);
            
            // Show success message with confetti
            showToast('success', 'Thank You!', 'Your feedback has been submitted successfully.');
            createConfetti();
            
            // Reset form
            form.reset();
            selectedRating = 0;
            resetStars();
            ratingDescription.textContent = '';
            charCounter.textContent = '0/500';
            charCounter.classList.remove('error');
            removeAttachedFile();
            
            // Reset validation states
            nameGroup.classList.remove('error');
            emailGroup.classList.remove('error');
            typeGroup.classList.remove('error');
            feedbackGroup.classList.remove('error');
            
            // Reset button
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Feedback';
            }, 2000);
        }, 1500);
    }
    
    // Initialize the form
    initForm();
});
