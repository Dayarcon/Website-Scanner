module.exports = {
    fetchData: async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    },

    parseResponse: (response) => {
        // Process the response data as needed
        return {
            server: response.server,
            ip: response.ip,
            // Add more fields as necessary
        };
    }
};