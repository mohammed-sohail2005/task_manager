/* ==========================================================================
   PassVault 3D - Modern JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const glassCard = document.getElementById('glassCard');
    const passwordDisplay = document.getElementById('passwordDisplay');
    const passwordBox = document.getElementById('passwordBox');
    const copyBtn = document.getElementById('copyBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    
    const lengthSlider = document.getElementById('lengthSlider');
    const lengthValueDisplay = document.getElementById('lengthValueDisplay');
    const sliderTooltip = document.getElementById('sliderTooltip');

    const uppercaseToggle = document.getElementById('uppercaseToggle');
    const lowercaseToggle = document.getElementById('lowercaseToggle');
    const numbersToggle = document.getElementById('numbersToggle');
    const symbolsToggle = document.getElementById('symbolsToggle');
    const validationWarning = document.getElementById('validationWarning');

    const strengthText = document.getElementById('strengthText');
    const strengthBar = document.getElementById('strengthBar');

    const generateBtn = document.getElementById('generateBtn');
    const toast = document.getElementById('toast');

    // --- Character Sets ---
    const CHAR_SETS = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let currentPassword = '';
    let isScrambling = false;
    let toastTimeout = null;

    // --- Cryptographically Secure Random Utilities ---
    function getRandomInt(max) {
        const randomBuffer = new Uint32Array(1);
        window.crypto.getRandomValues(randomBuffer);
        return randomBuffer[0] % max;
    }

    function getRandomChar(charString) {
        return charString[getRandomInt(charString.length)];
    }

    // Fisher-Yates Secure Shuffle
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = getRandomInt(i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // --- Password Generator Core ---
    function generatePassword() {
        if (!validateOptions()) return;

        const length = parseInt(lengthSlider.value, 10);
        const selectedPools = [];
        const guaranteedChars = [];

        if (uppercaseToggle.checked) {
            selectedPools.push(CHAR_SETS.uppercase);
            guaranteedChars.push(getRandomChar(CHAR_SETS.uppercase));
        }
        if (lowercaseToggle.checked) {
            selectedPools.push(CHAR_SETS.lowercase);
            guaranteedChars.push(getRandomChar(CHAR_SETS.lowercase));
        }
        if (numbersToggle.checked) {
            selectedPools.push(CHAR_SETS.numbers);
            guaranteedChars.push(getRandomChar(CHAR_SETS.numbers));
        }
        if (symbolsToggle.checked) {
            selectedPools.push(CHAR_SETS.symbols);
            guaranteedChars.push(getRandomChar(CHAR_SETS.symbols));
        }

        const combinedPool = selectedPools.join('');
        const remainingLength = length - guaranteedChars.length;
        const randomChars = [];

        for (let i = 0; i < remainingLength; i++) {
            randomChars.push(getRandomChar(combinedPool));
        }

        const passwordArray = shuffleArray([...guaranteedChars, ...randomChars]);
        currentPassword = passwordArray.join('');

        // Trigger Matrix Scramble Reveal Animation
        scrambleAnimatePassword(currentPassword);
        updateStrengthMeter();
    }

    // --- Matrix / Typewriter Character Scramble Animation ---
    function scrambleAnimatePassword(finalPassword) {
        if (isScrambling) return;
        isScrambling = true;
        passwordDisplay.classList.add('scrambling');

        const allPossibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        const iterations = 8;
        let step = 0;

        const interval = setInterval(() => {
            let displayed = '';
            for (let i = 0; i < finalPassword.length; i++) {
                if (i < Math.floor((step / iterations) * finalPassword.length)) {
                    displayed += finalPassword[i];
                } else {
                    displayed += getRandomChar(allPossibleChars);
                }
            }

            passwordDisplay.textContent = displayed;
            step++;

            if (step > iterations) {
                clearInterval(interval);
                passwordDisplay.textContent = finalPassword;
                passwordDisplay.classList.remove('scrambling');
                isScrambling = false;
            }
        }, 35);
    }

    // --- Option Validation ---
    function validateOptions() {
        const anyChecked = uppercaseToggle.checked || lowercaseToggle.checked || numbersToggle.checked || symbolsToggle.checked;

        if (!anyChecked) {
            validationWarning.classList.remove('hidden');
            generateBtn.disabled = true;
            refreshBtn.disabled = true;
            copyBtn.disabled = true;
            passwordDisplay.textContent = 'Select at least 1 option';
            passwordDisplay.style.fontSize = '1rem';
            passwordDisplay.style.color = '#ff6b7a';
            updateStrengthMeter(0, 'Invalid');
            return false;
        } else {
            validationWarning.classList.add('hidden');
            generateBtn.disabled = false;
            refreshBtn.disabled = false;
            copyBtn.disabled = false;
            passwordDisplay.style.fontSize = '';
            passwordDisplay.style.color = '';
            return true;
        }
    }

    // --- Password Strength & Entropy Calculator ---
    function updateStrengthMeter(forcePct = null, forceText = null) {
        if (forcePct !== null) {
            strengthBar.style.width = `${forcePct}%`;
            strengthBar.style.backgroundColor = 'var(--text-subtle)';
            strengthBar.style.boxShadow = 'none';
            strengthText.textContent = forceText || '';
            strengthText.style.color = 'var(--text-subtle)';
            return;
        }

        const length = parseInt(lengthSlider.value, 10);
        let poolSize = 0;

        if (uppercaseToggle.checked) poolSize += 26;
        if (lowercaseToggle.checked) poolSize += 26;
        if (numbersToggle.checked) poolSize += 10;
        if (symbolsToggle.checked) poolSize += 32;

        if (poolSize === 0) return;

        // Information entropy calculation E = L * log2(R)
        const entropy = length * Math.log2(poolSize);

        let percentage = 0;
        let label = 'Weak';
        let color = 'var(--strength-weak)';

        if (entropy < 35 || length < 7) {
            percentage = 25;
            label = 'Weak';
            color = 'var(--strength-weak)';
        } else if (entropy < 60 || length < 10) {
            percentage = 50;
            label = 'Medium';
            color = 'var(--strength-medium)';
        } else if (entropy < 85 || length < 14) {
            percentage = 75;
            label = 'Strong';
            color = 'var(--strength-strong)';
        } else {
            percentage = 100;
            label = 'Very Secure';
            color = 'var(--strength-secure)';
        }

        strengthBar.style.width = `${percentage}%`;
        strengthBar.style.backgroundColor = color;
        strengthBar.style.boxShadow = `0 0 12px ${color}`;
        strengthText.textContent = label;
        strengthText.style.color = color;
    }

    // --- Custom Range Slider & Tooltip Synchronization ---
    function updateSliderUI() {
        const min = parseInt(lengthSlider.min, 10);
        const max = parseInt(lengthSlider.max, 10);
        const val = parseInt(lengthSlider.value, 10);

        const percentage = ((val - min) / (max - min)) * 100;
        lengthSlider.style.setProperty('--slider-pct', `${percentage}%`);

        lengthValueDisplay.textContent = val;
        sliderTooltip.textContent = val;

        // Position tooltip bubble dynamically relative to thumb
        const thumbOffset = (12 - percentage * 0.24);
        sliderTooltip.style.left = `calc(${percentage}% + ${thumbOffset}px)`;
    }

    // --- Copy to Clipboard & Toast ---
    async function copyToClipboard() {
        if (!currentPassword || generateBtn.disabled) return;

        try {
            await navigator.clipboard.writeText(currentPassword);
            showToast();
            triggerCopyIconFeedback();
        } catch (err) {
            // Fallback for older browsers
            const tempInput = document.createElement('input');
            tempInput.value = currentPassword;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showToast();
            triggerCopyIconFeedback();
        }
    }

    function triggerCopyIconFeedback() {
        const copyIcon = copyBtn.querySelector('.copy-icon');
        const checkIcon = copyBtn.querySelector('.check-icon');

        copyBtn.classList.add('copied');
        copyIcon.classList.add('hidden');
        checkIcon.classList.remove('hidden');

        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyIcon.classList.remove('hidden');
            checkIcon.classList.add('hidden');
        }, 2000);
    }

    function showToast() {
        if (toastTimeout) clearTimeout(toastTimeout);

        toast.classList.remove('show');
        // Trigger reflow to restart CSS animation
        void toast.offsetWidth;
        toast.classList.add('show');

        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // --- 3D Glass Card Tilt Effect ---
    function init3DTilt() {
        let bounds;

        function updateBounds() {
            bounds = glassCard.getBoundingClientRect();
        }

        document.addEventListener('mousemove', (e) => {
            if (!bounds) updateBounds();

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Check if cursor is near card
            const cardCenterX = bounds.left + bounds.width / 2;
            const cardCenterY = bounds.top + bounds.height / 2;

            const deltaX = (mouseX - cardCenterX) / (window.innerWidth / 2);
            const deltaY = (mouseY - cardCenterY) / (window.innerHeight / 2);

            const rotateX = (-deltaY * 12).toFixed(2);
            const rotateY = (deltaX * 12).toFixed(2);

            glassCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            // Card shine radial gradient positioning
            const shineX = ((mouseX - bounds.left) / bounds.width) * 100;
            const shineY = ((mouseY - bounds.top) / bounds.height) * 100;
            glassCard.style.setProperty('--mouse-x', `${shineX}%`);
            glassCard.style.setProperty('--mouse-y', `${shineY}%`);
        });

        window.addEventListener('resize', updateBounds);
        document.addEventListener('mouseleave', () => {
            glassCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }

    // --- Ripple Click Effect ---
    function createRipple(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const circle = document.createElement('span');
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');

        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) existingRipple.remove();

        button.appendChild(circle);
    }

    // --- Event Listeners ---
    lengthSlider.addEventListener('input', () => {
        updateSliderUI();
        if (validateOptions()) {
            updateStrengthMeter();
            generatePassword();
        }
    });

    [uppercaseToggle, lowercaseToggle, numbersToggle, symbolsToggle].forEach(toggle => {
        toggle.addEventListener('change', () => {
            if (validateOptions()) {
                generatePassword();
            }
        });
    });

    generateBtn.addEventListener('click', (e) => {
        createRipple(e);
        generatePassword();
    });

    refreshBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyToClipboard);

    // Initial Setup
    updateSliderUI();
    init3DTilt();
    generatePassword();
});
