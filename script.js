document.addEventListener('DOMContentLoaded', () => {
    // ---ELEMENT SELECTORS---
    const searchInput = document.getElementById('searchInput');
    const toolCatalog = document.getElementById('tool-catalog');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    let allTools = [];
    let currentCategory = 'All'; // To keep track of the active filter

    // ---THEME LOGIC---
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode');
            themeToggle.textContent = '🌙';
        }
    };
    const toggleTheme = () => {
        const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    }
    themeToggle.addEventListener('click', toggleTheme);

    // ---CATALOG AND FILTER LOGIC---

    const displayTools = (tools) => {
        toolCatalog.innerHTML = '';
        if (tools.length === 0) {
            toolCatalog.innerHTML = '<p>No tools found matching your criteria.</p>';
            return;
        }
        tools.forEach(tool => {
            const card = document.createElement('div');
            card.className = 'tool-card';
            
            // Generate HTML for guarantee and disadvantage tags
            const guaranteesHTML = tool.guarantees.map(g => `<span class="tag guarantee">${g}</span>`).join('');
            const disadvantagesHTML = tool.disadvantages.map(d => `<span class="tag disadvantage">${d}</span>`).join('');

            card.innerHTML = `
                <h3><a href="${tool.url}" target="_blank" rel="noopener noreferrer">${tool.name}</a></h3>
                <p class="tool-category">${tool.category}</p>
                <p class="tool-description">${tool.description}</p>
                <div class="tool-guarantees">
                    ${guaranteesHTML}
                    ${disadvantagesHTML}
                </div>
            `;
            toolCatalog.appendChild(card);
        });
    };

    const displayCategoryFilters = () => {
        const categories = ['All', ...new Set(allTools.map(tool => tool.category))];
        categoryFiltersContainer.innerHTML = ''; // Clear existing buttons
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.textContent = category;
            button.dataset.category = category; // Store category in data attribute
            if (category === 'All') {
                button.classList.add('active'); // 'All' is active by default
            }
            categoryFiltersContainer.appendChild(button);
        });
    };

    const filterAndDisplay = () => {
        const searchTerm = searchInput.value.toLowerCase();
        
        let filteredTools = allTools;

        // 1. Filter by category
        if (currentCategory !== 'All') {
            filteredTools = filteredTools.filter(tool => tool.category === currentCategory);
        }

        // 2. Filter by search term
        if (searchTerm) {
            filteredTools = filteredTools.filter(tool => {
                const searchableText = `${tool.name} ${tool.category} ${tool.description} ${tool.keywords.join(' ')}`.toLowerCase();
                return searchableText.includes(searchTerm);
            });
        }
        
        displayTools(filteredTools);
    };

    // ---EVENT LISTENERS---

    categoryFiltersContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            currentCategory = e.target.dataset.category;
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            filterAndDisplay();
        }
    });

    searchInput.addEventListener('input', filterAndDisplay);

    // ---INITIAL FETCH---
    fetch('tools.json')
        .then(response => response.json())
        .then(data => {
            allTools = data;
            displayCategoryFilters(); // Create the filter buttons
            filterAndDisplay();       // Initial display of all tools
        })
        .catch(error => {
            console.error('Error fetching tool data:', error);
            toolCatalog.innerHTML = '<p>Sorry, we could not load the tool catalog.</p>';
        });
});
