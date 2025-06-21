// Enhanced iOS-style interactions
        function handleBackClick() {
            const button = document.querySelector('.back-button');
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = '';
                // Add haptic feedback simulation
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }, 150);
        }

        function handleFormSubmit(event) {
            event.preventDefault();
            const button = document.getElementById('generateBtn');
            const originalText = button.textContent;
            
            // Add loading state
            button.classList.add('loading');
            button.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                button.classList.remove('loading');
                button.disabled = false;
                button.textContent = '✓ Link Generated!';
                button.style.background = 'linear-gradient(135deg, #00c851, #00a041)';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            }, 2000);
        }

        function handleSelectChange(select) {
            select.style.transform = 'scale(1.02)';
            setTimeout(() => {
                select.style.transform = '';
            }, 200);
        }

        function handleInputChange(input) {
            if (input.value.length > 0) {
                input.style.borderColor = 'rgba(0, 200, 81, 0.3)';
            } else {
                input.style.borderColor = 'transparent';
            }
        }

        function handleTelegramClick(event) {
            event.preventDefault();
            const button = event.target;
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
                // Simulate opening Telegram
                alert('Opening Telegram...');
            }, 150);
        }

        // Add touch feedback for iOS devices
        document.addEventListener('touchstart', function(e) {
            if (e.target.matches('button, .back-button, .telegram-btn')) {
                e.target.style.transform = 'scale(0.95)';
            }
        });

        document.addEventListener('touchend', function(e) {
            if (e.target.matches('button, .back-button, .telegram-btn')) {
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 150);
            }
        });

        // Parallax effect for circles on scroll
        window.addEventListener('scroll', function() {
            const circles = document.querySelectorAll('.circle');
            const scrolled = window.pageYOffset;
            
            circles.forEach((circle, index) => {
                const rate = scrolled * (index % 3 + 1) * 0.1;
                circle.style.transform = `translateY(${scrolled * rate}px)`;
            });
        });
