const express = require('express');
const path = require('path');
const { getServerInfo, getIpAddress, getHttpHeaders, getResponseTime, getSslCertificate, getWebsiteAccessibility, getGeolocation, getPageTitle, getMetaDescription, getLinks, getImages, getWhoisInfo, getDnsRecords, getPortScan } = require('./scanner');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve index.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/scan', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const serverInfo = await getServerInfo(url);
        const ipAddress = await getIpAddress(url);
        const httpHeaders = await getHttpHeaders(url);
        const responseTime = await getResponseTime(url);
        const sslCertificate = await getSslCertificate(url);
        const websiteAccessibility = await getWebsiteAccessibility(url);
        const geolocation = await getGeolocation(ipAddress);
        const pageTitle = await getPageTitle(url);
        const metaDescription = await getMetaDescription(url);
        const links = await getLinks(url);
        const images = await getImages(url);
        const whoisInfo = await getWhoisInfo(new URL(url).hostname);
        const dnsRecords = await getDnsRecords(new URL(url).hostname);
        const portScan = await getPortScan(ipAddress);

        res.json({
            serverInfo,
            ipAddress,
            httpHeaders,
            responseTime,
            sslCertificate,
            websiteAccessibility,
            geolocation,
            pageTitle,
            metaDescription,
            links,
            images,
            whoisInfo,
            dnsRecords,
            portScan
        });
    } catch (error) {
        res.status(500).send('Error scanning the website');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});