document.addEventListener('DOMContentLoaded', () => {
    const checkAndRedirect = () => {
        const hash = window.location.hash.substring(1); // Get the hash value without the '#' symbol
        const isHashPresent = hash && hash.trim() !== ''; // Extracted check into a variable

        const messageContainer = document.querySelector('.message');
        const linksContainer = document.querySelector('.links');

        if (isHashPresent) {
            if (hash === 'all') {
                // Display all URL mappings including Google Sheets data
                linksContainer.innerHTML = ''; // Clear existing links
                const allMappings = { ...urlMappings };

                Object.entries(allMappings).sort(([keyA], [keyB]) => keyA.toLowerCase().localeCompare(keyB.toLowerCase())).forEach(([key, value]) => {
                    const link = document.createElement('a');
                    link.href = value;
                    link.innerHTML = `${key}<br>${value}`; // Display key and URL on separate lines using <br>
                    link.className = 'link';
                    linksContainer.appendChild(link);
                });
                messageContainer.textContent = ''; // Clear any message
                if(!window.googleSheetsFetchComplete)
                {
                    // If the hash is invalid or Google Sheets fetch is not complete, retry after a delay
                    setTimeout(checkAndRedirect, 500); // Retry after 500ms
                }
            } else if (urlMappings[hash]) {
                messageContainer.textContent = 'redirecting...';
                window.location.href = urlMappings[hash];
            } else if (!window.googleSheetsFetchComplete) {
                messageContainer.textContent = 'processing forwarding rules...';
                // If the hash is invalid or Google Sheets fetch is not complete, retry after a delay
                setTimeout(checkAndRedirect, 500); // Retry after 500ms
            } else {
                messageContainer.textContent = 'no forwarding rule found';
            }
        } else {
            // Display links from `links.js`
            linksContainer.innerHTML = ''; // Clear existing links
            links.forEach(entry => {
                const link = document.createElement('a');
                link.href = entry.url;
                link.textContent = entry.name;
                link.className = 'link';
                linksContainer.appendChild(link);
            });
            messageContainer.textContent = ''; // Clear any message
        }
    };

    // Initial check and redirect
    checkAndRedirect();

    // Listen for hash changes and re-check
    window.addEventListener('hashchange', checkAndRedirect);
});