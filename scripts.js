'use strict';
        const strengthLevels = [
            { color: '#ef4444', bars: 1 },
            { color: '#f59e0b', bars: 2 },
            { color: '#eab308', bars: 3 },
            { color: '#84cc16', bars: 4 }
        ];

        let isPasswordVisible = false;
        let currentPassword = '';

        const charsets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };

        function getCharset() {
            return Object.keys(charsets).reduce((acc, key) => {
                return document.getElementById(key).checked ? acc + charsets[key] : acc;
            }, '');
        }

        function updateStrengthIndicator(strength) {
            const bars = document.querySelectorAll('.strength-bar');
            bars.forEach((bar, index) => {
                bar.style.backgroundColor = index < strength.bars ? strength.color : '';
            });
        }

        function togglePasswordVisibility() {
            isPasswordVisible = !isPasswordVisible;
            const passwordEl = document.getElementById('password');
            passwordEl.textContent = isPasswordVisible ? currentPassword : '*'.repeat(currentPassword.length);
            document.getElementById('visibility-btn').innerHTML = 
                `<i class="fas fa-eye${isPasswordVisible ? '-slash' : ''}"></i>`;
        }

        function generatePassword() {
            const length = parseInt(document.getElementById('length').value);
            const charset = getCharset();
            
            if (!charset) {
                showAlert('Please select at least one character type!', 'error');
                return;
            }

            try {
                const randomValues = new Uint8Array(length * 2);
                crypto.getRandomValues(randomValues);
                
                currentPassword = Array.from(randomValues)
                    .map(byte => charset[byte % charset.length])
                    .slice(0, length)
                    .sort(() => Math.random() - 0.5)
                    .join('');

                const entropy = Math.log2(charset.length) * length;
                const strength = entropy < 40 ? strengthLevels[0] :
                            entropy < 60 ? strengthLevels[1] :
                            entropy < 80 ? strengthLevels[2] : strengthLevels[3];

                updateUI(strength);
            } catch (error) {
                showAlert('Error generating password', 'error');
                console.error(error);
            }
        }

        function updateUI(strength) {
            const passwordEl = document.getElementById('password');
            passwordEl.textContent = isPasswordVisible ? currentPassword : '*'.repeat(currentPassword.length);
            passwordEl.dataset.fullText = currentPassword;
            updateStrengthIndicator(strength);
        }

        async function copyToClipboard() {
            try {
                await navigator.clipboard.writeText(currentPassword);
                setTimeout(() => navigator.clipboard.writeText(''), 60000);
                showAlert('Password copied! Clipboard will clear in 60 seconds', 'success');
            } catch (err) {
                const textArea = document.createElement('textarea');
                textArea.value = currentPassword;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showAlert('Password copied using fallback method', 'warning');
            }
        }

        function showAlert(message, type) {
            const alert = document.createElement('div');
            alert.className = `alert ${type}`;
            alert.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'times-circle'}"></i>
                ${message}
            `;
            
            document.body.appendChild(alert);
            setTimeout(() => alert.classList.add('active'), 10);
            
            setTimeout(() => {
                alert.classList.remove('active');
                setTimeout(() => alert.remove(), 300);
            }, 3000);
        }

        document.addEventListener('DOMContentLoaded', () => {
            generatePassword();
            
            document.getElementById('length').addEventListener('input', function(e) {
                document.getElementById('lengthValue').textContent = e.target.value;
            });

            document.getElementById('generate-btn').addEventListener('click', generatePassword);
            document.getElementById('copy-btn').addEventListener('click', copyToClipboard);
            document.getElementById('visibility-btn').addEventListener('click', togglePasswordVisibility);
        });