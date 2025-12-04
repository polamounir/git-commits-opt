
const commitTypes = [
    {
        value: 'feat',
        label: 'Feature (feat)',
        description: 'A new feature',
        context: 'Adding a new button, page, or logic.',
        placeholder: 'add google oauth login support',
        icon: 'fa-rocket'
    },
    {
        value: 'fix',
        label: 'Bug Fix (fix)',
        description: 'A bug fix',
        context: 'Fixing a crash, broken link, or logic error.',
        placeholder: 'resolve overlapping text on mobile devices',
        icon: 'fa-bug'
    },
    {
        value: 'docs',
        label: 'Documentation (docs)',
        description: 'Documentation only',
        context: 'Updating README, comments, or JSDoc.',
        placeholder: 'update API endpoints in readme',
        icon: 'fa-book'
    },
    {
        value: 'style',
        label: 'Styles (style)',
        description: 'Formatting changes',
        context: 'White-space, semi-colons (no code change).',
        placeholder: 'fix indentation in login component',
        icon: 'fa-paintbrush'
    },
    {
        value: 'refactor',
        label: 'Refactor (refactor)',
        description: 'Code restructuring',
        context: 'Cleaning up code without changing logic.',
        placeholder: 'simplify date formatting logic',
        icon: 'fa-rotate'
    },
    {
        value: 'perf',
        label: 'Performance (perf)',
        description: 'Performance improvement',
        context: 'Optimizing loops, reducing bundle size.',
        placeholder: 'implement lazy loading for gallery images',
        icon: 'fa-gauge-high'
    },
    {
        value: 'test',
        label: 'Tests (test)',
        description: 'Adding/Updating tests',
        context: 'Unit tests, Jest, Cypress, etc.',
        placeholder: 'add unit tests for user authentication',
        icon: 'fa-vial'
    },
    {
        value: 'chore',
        label: 'Chore (chore)',
        description: 'Build/Tooling tasks',
        context: 'Updating dependencies, config files (.gitignore).',
        placeholder: 'upgrade react to version 18.2.0',
        icon: 'fa-wrench'
    },
    {
        value: 'ci',
        label: 'CI/CD (ci)',
        description: 'CI/CD changes',
        context: 'GitHub Actions, Travis, Dockerfile updates.',
        placeholder: 'update github actions workflow configuration',
        icon: 'fa-server'
    },
    {
        value: 'revert',
        label: 'Revert (revert)',
        description: 'Reverting a previous commit',
        context: 'Undoing a mistake.',
        placeholder: 'revert "feat: add login page"',
        icon: 'fa-clock-rotate-left'
    },
    {
        value: 'build',
        label: 'Build (build)',
        description: 'Build system changes',
        context: 'Gulp, Webpack, npm scripts changes.',
        placeholder: 'configure webpack for production build',
        icon: 'fa-boxes-packing'
    }
];

// --- DOM Elements ---
const typeSelect = document.getElementById('typeSelect');
const scopeInput = document.getElementById('scopeInput');
const messageInput = document.getElementById('messageInput');
const finalOutput = document.getElementById('finalOutput');
const copyBtn = document.getElementById('copyBtn');
const copyOverlay = document.getElementById('copyOverlay');
const charCount = document.getElementById('charCount');

// Info Card Elements
const infoTitle = document.getElementById('infoTitle');
const infoDesc = document.getElementById('infoDesc');
const infoContext = document.getElementById('infoContext');
const infoIcon = document.getElementById('infoIcon');
const infoCard = document.getElementById('infoCard');

// --- Initialization ---
function init() {
    // Populate Dropdown
    commitTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.value;
        option.textContent = type.label;
        typeSelect.appendChild(option);
    });

    // Set initial listeners
    typeSelect.addEventListener('change', updateUI);
    scopeInput.addEventListener('input', updateUI);
    messageInput.addEventListener('input', updateUI);
    copyBtn.addEventListener('click', copyToClipboard);

    // Trigger initial update
    updateUI();
}

// --- Core Logic ---
function updateUI() {
    // 1. Get Values
    const type = typeSelect.value;
    const scope = scopeInput.value.trim();
    const message = messageInput.value;

    // 2. Update Info Card & Placeholder
    const typeData = commitTypes.find(t => t.value === type);
    if (typeData) {
        infoTitle.textContent = typeData.value;
        infoDesc.textContent = typeData.description;
        infoContext.textContent = typeData.context;
        
        // Update Placeholder
        messageInput.placeholder = `e.g. ${typeData.placeholder}`;

        // Update Icon
        infoIcon.className = `fa-solid ${typeData.icon} text-blue-400 text-xl`;
    }

    // 3. Construct Command
    // Format: type(scope): message  OR  type: message
    let scopePart = scope ? `(${scope})` : '';
    // Escape double quotes in message to prevent breaking the command
    let safeMessage = message.replace(/"/g, '\\"');
    
    const command = `git commit -m "${type}${scopePart}: ${safeMessage}"`;

    // 4. Update Output
    finalOutput.textContent = command;

    // 5. Char Count Logic (Coloring)
    const len = message.length;
    charCount.textContent = `${len}/50`;
    if (len > 50) {
        charCount.classList.remove('text-slate-500');
        charCount.classList.add('text-red-400');
    } else {
        charCount.classList.add('text-slate-500');
        charCount.classList.remove('text-red-400');
    }
}

function copyToClipboard() {
    const textToCopy = finalOutput.textContent;

    // Use Clipboard API or fallback
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showCopyFeedback();
        });
    } else {
        // Fallback for older browsers or non-secure contexts (iframe)
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showCopyFeedback();
        } catch (err) {
            console.error('Unable to copy', err);
        }
        document.body.removeChild(textArea);
    }
}

function showCopyFeedback() {
    // Flash button text
    const originalHTML = copyBtn.innerHTML;
    copyBtn.innerHTML = `<i class="fa-solid fa-check mr-2"></i> Copied!`;
    copyBtn.classList.remove('bg-blue-600', 'hover:bg-blue-500');
    copyBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-500');
    
    // Flash overlay inside terminal
    copyOverlay.classList.remove('opacity-0');

    setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.classList.add('bg-blue-600', 'hover:bg-blue-500');
        copyBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-500');
        copyOverlay.classList.add('opacity-0');
    }, 1500);
}

// Run
init();

