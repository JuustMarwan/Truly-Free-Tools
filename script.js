document.addEventListener('DOMContentLoaded', () => {
    // ---ELEMENT SELECTORS---
    const searchInput = document.getElementById('searchInput');
    const toolCatalog = document.getElementById('tool-catalog');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    let allTools = [];

    // ---THEME LOGIC---
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.textContent = '☀️'; // Sun icon
        } else {
            body.classList.remove('dark-mode');
            themeToggle.textContent = '🌙'; // Moon icon
        }
    };

    const toggleTheme = () => {
        const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };

    // Check for saved theme in localStorage or OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    }

    // Add click listener for the theme toggle button
    themeToggle.addEventListener('click', toggleTheme);

    // ---CATALOG AND SEARCH LOGIC---
    // Function to display tools on the page
    const displayTools = (tools) => {
        toolCatalog.innerHTML = ''; // Clear existing tools

        if (tools.length === 0) {
            toolCatalog.innerHTML = '<p>No tools found matching your search.</p>';
            return;
        }

        tools.forEach(tool => {
            const card = document.createElement('div');
            card.className = 'tool-card';
            card.innerHTML = `
                <h3><a href="${tool.url}" target="_blank" rel="noopener noreferrer">${tool.name}</a></h3>
                <p class="tool-category">${tool.category}</p>
                <p class="tool-description">${tool.description}</p>
                <div class="tool-guarantees">
                    ${tool.guarantees.map(guarantee => `<span class="tag">${guarantee}</span>`).join('')}
                </div>
            `;
            toolCatalog.appendChild(card);
        });
    };

    // Fetch the tool data from the JSON file
    fetch('tools.json')
        .then(response => response.json())
        .then(data => {
            allTools = data;
            displayTools(allTools); // Display all tools initially
        })
        .catch(error => {
            console.error('Error fetching tool data:', error);
            toolCatalog.innerHTML = '<p>Sorry, we could not load the tool catalog.</p>';
        });

    // Add event listener for the search input
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        const filteredTools = allTools.filter(tool => {
            const searchableText = `${tool.name} ${tool.category} ${tool.description} ${tool.keywords.join(' ')}`.toLowerCase();
            return searchableText.includes(searchTerm);
        });

        displayTools(filteredTools);
    });
});
