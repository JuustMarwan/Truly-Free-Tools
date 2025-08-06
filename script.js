document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const toolCatalog = document.getElementById('tool-catalog');
    let allTools = []; // To store all tools data

    // 1. Fetch the tool data from the JSON file
    fetch('tools.json')
        .then(response => response.json())
        .then(data => {
            allTools = data;
            displayTools(allTools);
        })
        .catch(error => {
            console.error('Error fetching tool data:', error);
            toolCatalog.innerHTML = '<p>Sorry, we could not load the tool catalog.</p>';
        });

    // 2. Function to display tools on the page
    const displayTools = (tools) => {
        toolCatalog.innerHTML = ''; // Clear existing tools

        if (tools.length === 0) {
            toolCatalog.innerHTML = '<p>No tools found matching your search.</p>';
            return;
        }

        tools.forEach(tool => {
            // Create the main card element
            const card = document.createElement('div');
            card.className = 'tool-card';

            // Create the inner HTML for the card using a template literal
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

    // 3. Add event listener for the search input
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        const filteredTools = allTools.filter(tool => {
            // Check against name, category, description, and keywords
            const searchableText = `${tool.name} ${tool.category} ${tool.description} ${tool.keywords.join(' ')}`.toLowerCase();
            return searchableText.includes(searchTerm);
        });

        displayTools(filteredTools);
    });
});
