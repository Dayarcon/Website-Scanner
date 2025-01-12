const axios = require('axios');
const dns = require('dns').promises;
const tls = require('tls');
const isReachable = require('is-reachable');
const ipinfo = require('ipinfo');
const cheerio = require('cheerio');
const whois = require('whois');
const { exec } = require('child_process');

async function getServerInfo(url) {
    try {
        const response = await axios.get(url);
        const server = response.headers['server'];
        return server ? server : 'Server information not available';
    } catch (error) {
        console.error(`Error fetching server info: ${error.message}`);
        return 'Error fetching server info';
    }
}

async function getIpAddress(url) {
    try {
        const hostname = new URL(url).hostname;
        const addresses = await dns.lookup(hostname);
        return addresses.address;
    } catch (error) {
        console.error(`Error fetching IP address: ${error.message}`);
        return 'Error fetching IP address';
    }
}

async function getHttpHeaders(url) {
    try {
        const response = await axios.get(url);
        return response.headers;
    } catch (error) {
        console.error(`Error fetching HTTP headers: ${error.message}`);
        return 'Error fetching HTTP headers';
    }
}

async function getResponseTime(url) {
    try {
        const start = Date.now();
        await axios.get(url);
        const end = Date.now();
        return `${end - start} ms`;
    } catch (error) {
        console.error(`Error fetching response time: ${error.message}`);
        return 'Error fetching response time';
    }
}

async function getSslCertificate(url) {
    try {
        const hostname = new URL(url).hostname;
        const socket = tls.connect(443, hostname, { servername: hostname });
        return new Promise((resolve, reject) => {
            socket.on('secureConnect', () => {
                const cert = socket.getPeerCertificate();
                const usefulCertInfo = {
                    issuer: cert.issuer,
                    valid_from: cert.valid_from,
                    valid_to: cert.valid_to,
                    subject: cert.subject
                };
                resolve(usefulCertInfo);
                socket.end();
            });
            socket.on('error', (error) => {
                console.error(`Error fetching SSL certificate: ${error.message}`);
                reject('Error fetching SSL certificate');
            });
        });
    } catch (error) {
        console.error(`Error fetching SSL certificate: ${error.message}`);
        return 'Error fetching SSL certificate';
    }
}

async function getWebsiteAccessibility(url) {
    try {
        const reachable = await isReachable(url);
        return reachable ? 'Accessible' : 'Blocked';
    } catch (error) {
        console.error(`Error fetching website accessibility: ${error.message}`);
        return 'Error fetching website accessibility';
    }
}

async function getGeolocation(ip) {
    return new Promise((resolve, reject) => {
        ipinfo(ip, (err, cLoc) => {
            if (err) {
                reject(err);
            } else {
                resolve(cLoc);
            }
        });
    });
}

async function getPageTitle(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        return $('title').text();
    } catch (error) {
        console.error(`Error fetching page title: ${error.message}`);
        return 'Error fetching page title';
    }
}

async function getMetaDescription(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        return $('meta[name="description"]').attr('content');
    } catch (error) {
        console.error(`Error fetching meta description: ${error.message}`);
        return 'Error fetching meta description';
    }
}

async function getLinks(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const links = [];
        $('a').each((index, element) => {
            links.push($(element).attr('href'));
        });
        return links;
    } catch (error) {
        console.error(`Error fetching links: ${error.message}`);
        return 'Error fetching links';
    }
}

async function getImages(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const images = [];
        $('img').each((index, element) => {
            images.push($(element).attr('src'));
        });
        return images;
    } catch (error) {
        console.error(`Error fetching images: ${error.message}`);
        return 'Error fetching images';
    }
}

async function getWhoisInfo(domain) {
    return new Promise((resolve, reject) => {
        whois.lookup(domain, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const usefulWhoisInfo = extractUsefulWhoisInfo(data);
                resolve(usefulWhoisInfo);
            }
        });
    });
}

function extractUsefulWhoisInfo(data) {
    const usefulInfo = {};
    const lines = data.split('\n');
    lines.forEach(line => {
        if (line.startsWith('Domain Name:')) {
            usefulInfo.domainName = line.split(':')[1].trim();
        } else if (line.startsWith('Registrar:')) {
            usefulInfo.registrar = line.split(':')[1].trim();
        } else if (line.startsWith('Creation Date:')) {
            usefulInfo.creationDate = line.split(':')[1].trim();
        } else if (line.startsWith('Registry Expiry Date:')) {
            usefulInfo.expiryDate = line.split(':')[1].trim();
        } else if (line.startsWith('Domain Status:')) {
            usefulInfo.status = line.split(':')[1].trim();
        }
    });
    return usefulInfo;
}

async function getDnsRecords(domain) {
    try {
        const records = await dns.resolveAny(domain);
        return records;
    } catch (error) {
        console.error(`Error fetching DNS records: ${error.message}`);
        return 'Error fetching DNS records';
    }
}

async function getPortScan(ip) {
    return new Promise((resolve, reject) => {
        exec(`nmap -F ${ip}`, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve(stdout);
            }
        });
    });
}

module.exports = {
    getServerInfo,
    getIpAddress,
    getHttpHeaders,
    getResponseTime,
    getSslCertificate,
    getWebsiteAccessibility,
    getGeolocation,
    getPageTitle,
    getMetaDescription,
    getLinks,
    getImages,
    getWhoisInfo,
    getDnsRecords,
    getPortScan
};