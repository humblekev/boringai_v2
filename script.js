// Smooth transition functionality for form activation
document.addEventListener('DOMContentLoaded', function() {
    const getStartedBtn = document.getElementById('getStartedBtn');
    const heroSection = document.querySelector('.hero');
    const formSection = document.getElementById('formSection');
    const restartBtn = document.getElementById('restartBtn');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    // Form steps
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const step4 = document.getElementById('step4');
    const successStep = document.getElementById('successStep');
    const nextBtn = document.getElementById('nextBtn');
    const step2NextBtn = document.getElementById('step2NextBtn');
    const step3NextBtn = document.getElementById('step3NextBtn');
    const submitBtn = document.getElementById('submitBtn');

    // Business type elements
    const businessType = document.getElementById('businessType');
    const otherBusiness = document.getElementById('otherBusiness');
    const automationTasks = document.getElementById('automationTasks');
    const otherTaskContainer = document.getElementById('otherTaskContainer');
    const otherTaskInput = document.getElementById('otherTaskInput');

    // Step 4 elements
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const successAnimationContainer = document.getElementById('success-animation-container');
    const backToHomeBtn = document.getElementById('backToHomeBtn');

    // Contact page elements
    const contactSection = document.getElementById('contactSection');
    const contactNavBtn = document.getElementById('contactNavBtn');
    const contactRestartBtn = document.getElementById('contactRestartBtn');
    const logoBtn = document.getElementById('logoBtn');
    const contactForm = document.getElementById('contactForm');
    const contactName = document.getElementById('contactName');
    const contactEmail = document.getElementById('contactEmail');
    const contactPhone = document.getElementById('contactPhone');
    const contactQuery = document.getElementById('contactQuery');
    const contactSubmitBtn = document.getElementById('contactSubmitBtn');

    let currentStep = 1;

    // Business-specific automation tasks mapping
    const automationTasksByBusiness = {
        'e-commerce': [
            'Inventory management and stock alerts',
            'Order processing and fulfillment',
            'Customer service chatbots',
            'Email marketing campaigns',
            'Product data entry and updates',
            'Review monitoring and responses'
        ],
        'saas': [
            'Customer onboarding workflows',
            'Support ticket routing and responses',
            'User engagement tracking',
            'Billing and subscription management',
            'Lead qualification and scoring',
            'Feature usage analytics'
        ],
        'consulting': [
            'Client intake and scheduling',
            'Proposal generation',
            'Invoice creation and follow-up',
            'Project status reporting',
            'Document template creation',
            'Time tracking and billing'
        ],
        'healthcare': [
            'Appointment scheduling and reminders',
            'Patient intake forms processing',
            'Insurance verification',
            'Medical record organization',
            'Prescription refill notifications',
            'Billing and claims processing'
        ],
        'financial': [
            'Transaction monitoring and alerts',
            'Customer KYC/AML checks',
            'Report generation and compliance',
            'Risk assessment workflows',
            'Client communication automation',
            'Data entry and reconciliation'
        ],
        'real-estate': [
            'Lead capture and qualification',
            'Property listing management',
            'Client communication workflows',
            'Document preparation and signing',
            'Market analysis reports',
            'Showing scheduling and coordination'
        ],
        'manufacturing': [
            'Supply chain monitoring',
            'Quality control reporting',
            'Production scheduling',
            'Maintenance alerts and tracking',
            'Vendor communication',
            'Compliance documentation'
        ],
        'restaurant': [
            'Online ordering integration',
            'Inventory tracking and ordering',
            'Staff scheduling optimization',
            'Customer feedback management',
            'Menu updates across platforms',
            'Delivery coordination'
        ],
        'fitness': [
            'Class booking and scheduling',
            'Member check-ins and tracking',
            'Payment processing and renewals',
            'Workout plan generation',
            'Progress tracking and reporting',
            'Equipment maintenance logs'
        ],
        'education': [
            'Student enrollment and registration',
            'Assignment grading and feedback',
            'Attendance tracking',
            'Parent-teacher communication',
            'Course material distribution',
            'Progress reporting'
        ],
        'marketing': [
            'Social media posting and scheduling',
            'Lead nurturing campaigns',
            'Campaign performance tracking',
            'Client reporting automation',
            'Content creation workflows',
            'ROI calculation and analysis'
        ],
        'construction': [
            'Project scheduling and timelines',
            'Material ordering and tracking',
            'Safety compliance reporting',
            'Client progress updates',
            'Invoice and change order processing',
            'Equipment maintenance scheduling'
        ],
        'nonprofit': [
            'Donor management and communication',
            'Volunteer scheduling and coordination',
            'Grant application tracking',
            'Event planning and registration',
            'Impact reporting and analytics',
            'Fundraising campaign automation'
        ],
        'automotive': [
            'Service appointment scheduling',
            'Inventory management for parts',
            'Customer service reminders',
            'Insurance claim processing',
            'Vehicle inspection tracking',
            'Parts ordering automation'
        ],
        'legal': [
            'Document review and organization',
            'Client intake and case management',
            'Court filing and deadline tracking',
            'Billing and time tracking',
            'Contract template generation',
            'Research and case law compilation'
        ],
        'other': [
            'Data entry and processing',
            'Email marketing and communication',
            'Appointment scheduling',
            'Invoice generation and tracking',
            'Report creation and distribution',
            'Customer service workflows',
            'Social media management',
            'Document organization'
        ]
    };

    // Handle "Get Started for Free" button click
    getStartedBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showForm();
    });

    // Handle "Get Started For Free" button in navbar
    const navGetStartedBtn = document.querySelector('.btn-nav');
    navGetStartedBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showForm();
    });

    // Handle restart button click
    restartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        restartForm();
    });

    // Handle Step 1 Next button
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        goToStep(2);
    });

    // Handle Step 2 Next button
    step2NextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        populateAutomationTasks();
        goToStep(3);
    });

    // Handle Step 3 Next button
    step3NextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        goToStep(4);
    });

    // Handle Submit button
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showSuccessAndAnimation();
    });

    // Handle Back to Home button
    backToHomeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Clear success animation
        successAnimationContainer.innerHTML = '';

        // Show progress indicator again (restart button was never hidden)
        document.querySelector('.progress-indicator').style.display = 'flex';

        // Go back to hero section
        restartForm();
    });

    // Handle Contact nav button
    contactNavBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showContactPage();
    });

    // Handle Contact restart button
    contactRestartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        hideContactPage();
    });

    // Handle Contact form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitContactForm();
    });

    // Contact form validation
    [contactName, contactEmail, contactQuery].forEach(field => {
        field.addEventListener('input', validateContactForm);
    });

    // Handle logo click to return home
    logoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Reset everything and go back to home
        location.reload();
    });

    // Handle business type selection
    businessType.addEventListener('change', function() {
        if (this.value === 'other') {
            otherBusiness.style.display = 'block';
            otherBusiness.focus();
            checkStep2Completion();
        } else {
            otherBusiness.style.display = 'none';
            otherBusiness.value = '';
            step2NextBtn.disabled = this.value === '';
        }
    });

    // Handle other business input
    otherBusiness.addEventListener('input', checkStep2Completion);

    // Handle Step 4 form validation
    userName.addEventListener('input', validateStep4);
    userEmail.addEventListener('input', validateStep4);

    // Add Enter key functionality for all steps
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();

            if (currentStep === 1 && !nextBtn.disabled) {
                nextBtn.click();
            } else if (currentStep === 2 && !step2NextBtn.disabled) {
                step2NextBtn.click();
            } else if (currentStep === 3 && !step3NextBtn.disabled) {
                step3NextBtn.click();
            } else if (currentStep === 4 && !submitBtn.disabled) {
                submitBtn.click();
            }
        }
    });

    function checkStep2Completion() {
        const isOtherSelected = businessType.value === 'other';
        const hasOtherValue = otherBusiness.value.trim() !== '';
        const hasSelection = businessType.value !== '';

        if (isOtherSelected) {
            step2NextBtn.disabled = !hasOtherValue;
        } else {
            step2NextBtn.disabled = !hasSelection;
        }
    }

    function showForm() {
        // Fade out hero section
        heroSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        heroSection.style.opacity = '0';
        heroSection.style.transform = 'translateY(-20px)';

        // After fade out, show form section
        setTimeout(() => {
            heroSection.style.display = 'none';
            formSection.style.display = 'flex';

            // Fade in form section
            setTimeout(() => {
                formSection.style.opacity = '1';
                formSection.style.transform = 'translateY(0)';
            }, 50);
        }, 500);
    }

    function restartForm() {
        // Reset to step 1
        goToStep(1);

        // Reset form values
        businessType.value = '';
        otherBusiness.value = '';
        otherBusiness.style.display = 'none';
        step2NextBtn.disabled = true;
        step3NextBtn.disabled = true;
        submitBtn.disabled = true;
        userName.value = '';
        userEmail.value = '';
        automationTasks.innerHTML = '';
        successAnimationContainer.innerHTML = '';

        // Fade out form and show hero
        formSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        formSection.style.opacity = '0';
        formSection.style.transform = 'translateY(20px)';

        setTimeout(() => {
            formSection.style.display = 'none';
            heroSection.style.display = 'flex';

            // Reset hero styles and fade in
            heroSection.style.opacity = '0';
            heroSection.style.transform = 'translateY(-20px)';

            setTimeout(() => {
                heroSection.style.opacity = '1';
                heroSection.style.transform = 'translateY(0)';
            }, 50);
        }, 500);
    }

    function goToStep(stepNumber) {
        currentStep = stepNumber;

        // Hide all steps
        step1.style.display = 'none';
        step2.style.display = 'none';
        step3.style.display = 'none';
        step4.style.display = 'none';
        successStep.style.display = 'none';

        // Show current step
        if (stepNumber === 1) {
            step1.style.display = 'flex';
            progressFill.style.width = '25%';
            progressText.textContent = 'Step 1 of 4';
        } else if (stepNumber === 2) {
            step2.style.display = 'flex';
            progressFill.style.width = '50%';
            progressText.textContent = 'Step 2 of 4';
        } else if (stepNumber === 3) {
            step3.style.display = 'flex';
            progressFill.style.width = '75%';
            progressText.textContent = 'Step 3 of 4';
        } else if (stepNumber === 4) {
            step4.style.display = 'flex';
            progressFill.style.width = '100%';
            progressText.textContent = 'Step 4 of 4';
        }
    }

    function populateAutomationTasks() {
        const selectedBusiness = businessType.value;
        const tasks = automationTasksByBusiness[selectedBusiness] || automationTasksByBusiness['other'];

        automationTasks.innerHTML = '';

        tasks.forEach((task, index) => {
            const checkboxItem = document.createElement('div');
            checkboxItem.className = 'checkbox-item';

            checkboxItem.innerHTML = `
                <input type="checkbox" id="task${index}" name="automationTask" value="${task}">
                <label for="task${index}">${task}</label>
            `;

            // Add click handler to entire checkbox item
            checkboxItem.addEventListener('click', function(e) {
                // Prevent double-clicking if user clicks directly on checkbox or label
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') {
                    return;
                }

                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;

                // Trigger change event to update validation and visual state
                const changeEvent = new Event('change', { bubbles: true });
                checkbox.dispatchEvent(changeEvent);
            });

            automationTasks.appendChild(checkboxItem);
        });

        // Add "Other" option
        const otherCheckboxItem = document.createElement('div');
        otherCheckboxItem.className = 'checkbox-item';
        otherCheckboxItem.innerHTML = `
            <input type="checkbox" id="taskOther" name="automationTask" value="other">
            <label for="taskOther">Other</label>
        `;

        // Add click handler to other checkbox item
        otherCheckboxItem.addEventListener('click', function(e) {
            // Prevent double-clicking if user clicks directly on checkbox or label
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') {
                return;
            }

            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;

            // Trigger change event to update validation and visual state
            const changeEvent = new Event('change', { bubbles: true });
            checkbox.dispatchEvent(changeEvent);
        });

        automationTasks.appendChild(otherCheckboxItem);

        // Add event listeners to checkboxes
        const checkboxes = automationTasks.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleTaskSelection);
        });

        // Add event listener to other task input
        otherTaskInput.addEventListener('input', validateStep3);
    }

    function handleTaskSelection(e) {
        // Update visual state of checkbox item
        const checkboxItem = e.target.closest('.checkbox-item');
        if (e.target.checked) {
            checkboxItem.classList.add('checked');
        } else {
            checkboxItem.classList.remove('checked');
        }

        if (e.target.value === 'other') {
            if (e.target.checked) {
                otherTaskContainer.style.display = 'block';
                otherTaskInput.focus();
            } else {
                otherTaskContainer.style.display = 'none';
                otherTaskInput.value = '';
            }
        }
        validateStep3();
    }

    function validateStep3() {
        const checkedBoxes = automationTasks.querySelectorAll('input[type="checkbox"]:checked');
        const otherChecked = document.getElementById('taskOther')?.checked;
        const otherHasValue = otherTaskInput.value.trim() !== '';

        let isValid = false;

        if (checkedBoxes.length === 0) {
            isValid = false;
        } else if (otherChecked && checkedBoxes.length === 1) {
            // Only "Other" is checked
            isValid = otherHasValue;
        } else {
            // Regular tasks are checked, or other tasks + other with text
            isValid = !otherChecked || otherHasValue;
        }

        step3NextBtn.disabled = !isValid;
    }

    function validateStep4() {
        const nameValid = userName.value.trim() !== '';
        const emailValid = userEmail.value.trim() !== '' && isValidEmail(userEmail.value.trim());
        submitBtn.disabled = !(nameValid && emailValid);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async function showSuccessAndAnimation() {
        // Collect all form data
        const formData = collectFormData();

        try {
            // Send to n8n webhook
            const webhookUrl = 'https://n8n-1-u40928.vm.elestio.app/webhook-test/c004923f-4c6e-4568-95e6-6470d8719aac';

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Successfully sent to n8n webhook');

        } catch (error) {
            console.error('Error sending to n8n webhook:', error);
            // Continue with success animation even if webhook fails
            // In production, you might want to show an error message
        }

        // Store locally as backup
        localStorage.setItem('boringai_submission', JSON.stringify(formData));

        // Hide progress indicator but keep restart button visible
        document.querySelector('.progress-indicator').style.display = 'none';

        // Show success step
        step4.style.display = 'none';
        successStep.style.display = 'flex';

        // Create particle effects
        createParticleAnimation();
    }

    function createParticleAnimation() {
        const successAnimation = document.querySelector('.success-animation');

        // Create particle container if it doesn't exist
        let particleContainer = successAnimation.querySelector('.success-particles');
        if (!particleContainer) {
            particleContainer = document.createElement('div');
            particleContainer.className = 'success-particles';
            successAnimation.appendChild(particleContainer);
        }

        // Create particles continuously for 8 seconds
        let particleInterval = setInterval(() => {
            for (let i = 0; i < 3; i++) {
                createParticle(particleContainer);
            }
        }, 200);

        // Stop creating particles after 8 seconds
        setTimeout(() => {
            clearInterval(particleInterval);
        }, 8000);
    }

    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random starting position (bottom area)
        const startX = Math.random() * 100;
        const endX = startX + (Math.random() - 0.5) * 60; // Random drift

        particle.style.left = startX + '%';
        particle.style.bottom = '0%';
        particle.style.setProperty('--random-x', endX - startX + 'px');

        container.appendChild(particle);

        // Remove particle after animation completes
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 4000);
    }

    function showContactPage() {
        // Hide hero and form sections
        heroSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        heroSection.style.opacity = '0';
        heroSection.style.transform = 'translateY(-20px)';

        formSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        formSection.style.opacity = '0';
        formSection.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            heroSection.style.display = 'none';
            formSection.style.display = 'none';
            contactSection.style.display = 'flex';

            // Fade in contact section
            setTimeout(() => {
                contactSection.style.opacity = '1';
                contactSection.style.transform = 'translateY(0)';
            }, 50);
        }, 500);
    }

    function hideContactPage() {
        // Fade out contact section
        contactSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        contactSection.style.opacity = '0';
        contactSection.style.transform = 'translateY(20px)';

        setTimeout(() => {
            contactSection.style.display = 'none';
            heroSection.style.display = 'flex';

            // Reset hero styles and fade in
            heroSection.style.opacity = '0';
            heroSection.style.transform = 'translateY(-20px)';

            setTimeout(() => {
                heroSection.style.opacity = '1';
                heroSection.style.transform = 'translateY(0)';
            }, 50);
        }, 500);

        // Reset contact form
        contactForm.reset();
        contactSubmitBtn.disabled = true;
    }

    function validateContactForm() {
        const nameValid = contactName.value.trim() !== '';
        const emailValid = contactEmail.value.trim() !== '' && isValidEmail(contactEmail.value.trim());
        const queryValid = contactQuery.value.trim() !== '';

        contactSubmitBtn.disabled = !(nameValid && emailValid && queryValid);
    }

    async function submitContactForm() {
        const contactData = {
            timestamp: new Date().toISOString(),
            type: 'contact_form',
            contact: {
                name: contactName.value.trim(),
                email: contactEmail.value.trim(),
                phone: contactPhone.value.trim(),
                query: contactQuery.value.trim()
            },
            formVersion: '1.0'
        };

        try {
            // Send to n8n webhook
            const webhookUrl = 'https://n8n-1-u40928.vm.elestio.app/webhook-test/c004923f-4c6e-4568-95e6-6470d8719aac';

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Successfully sent contact form to n8n webhook');

            // Show success message
            contactSubmitBtn.textContent = 'Message Sent!';
            contactSubmitBtn.style.background = '#7fb069';
            contactSubmitBtn.disabled = true;

            // Reset after 3 seconds
            setTimeout(() => {
                contactSubmitBtn.textContent = 'Send Message';
                contactSubmitBtn.style.background = '#d2775e';
                contactForm.reset();
                contactSubmitBtn.disabled = true;
            }, 3000);

        } catch (error) {
            console.error('Error sending contact form to n8n webhook:', error);
            // Show error message
            contactSubmitBtn.textContent = 'Error - Try Again';
            contactSubmitBtn.style.background = '#e74c3c';

            setTimeout(() => {
                contactSubmitBtn.textContent = 'Send Message';
                contactSubmitBtn.style.background = '#d2775e';
            }, 3000);
        }

        // Store locally as backup
        localStorage.setItem('boringai_contact_submission', JSON.stringify(contactData));
    }

    function collectFormData() {
        // Get selected business type
        const businessValue = businessType.value;
        const businessText = businessType.options[businessType.selectedIndex]?.text || '';
        const customBusiness = businessValue === 'other' ? otherBusiness.value.trim() : '';

        // Get selected automation tasks
        const selectedTasks = [];
        const taskCheckboxes = automationTasks.querySelectorAll('input[type="checkbox"]:checked');
        taskCheckboxes.forEach(checkbox => {
            if (checkbox.value === 'other') {
                selectedTasks.push(`Other: ${otherTaskInput.value.trim()}`);
            } else {
                selectedTasks.push(checkbox.value);
            }
        });

        // Get contact information
        const name = userName.value.trim();
        const email = userEmail.value.trim();

        // Create comprehensive data object
        return {
            timestamp: new Date().toISOString(),
            businessType: {
                value: businessValue,
                displayText: businessText,
                customValue: customBusiness
            },
            automationTasks: selectedTasks,
            contact: {
                name: name,
                email: email
            },
            completedSteps: 4,
            formVersion: '1.0'
        };
    }

});