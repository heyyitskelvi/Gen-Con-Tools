// ==UserScript==
// @name         Gen Con: Display Available Tickets
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display the number of available tickets alongside event links
// @author       kelvi
// @match        https://www.gencon.com/events*
// @grant        GM.xmlHttpRequest
// @connect      http://www.gencon.com/events/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==
/*
Hey hey hey. So this script will pull the available tickets from an event and display them next to the event link. You must be
signed in to see the available tickets. This script is a work in progress, if you know how to fix it, feel free. Currently, I am having
an issuse with how the site filters. If you don't see the available tickets, just refresh. 
Oh also, this script waits 5 seconds to pull the ticket numbers, just to make sure there are links on the page. You can adjust this
delay at the bottom of the script.
*/

(function() {
    'use strict';

    const processedLinks = new Set();

    // Function to fetch event details and extract "Available Tickets" number
    function fetchEventDetails(eventId, linkElement) {
        console.log(`Fetching details for event ID: ${eventId}`);
        GM.xmlHttpRequest({
            method: "GET",
            url: `https://www.gencon.com/events/${eventId}`,
            onload: function(response) {
                console.log(`Response received for event ID: ${eventId}`);
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    // Try to find the "Available Tickets" element
                    const availableTicketsElement = doc.querySelector('#event_detail_ticket_purchase p b');

                    if (availableTicketsElement) {
                        const availableTicketsText = availableTicketsElement.nextSibling.nodeValue.trim();
                        const availableTicketsMatch = availableTicketsText.match(/\d+/);

                        if (availableTicketsMatch) {
                            const availableTicketsNumber = availableTicketsMatch[0];
                            displayAvailableTickets(linkElement, availableTicketsNumber);
                        } else {
                            console.error(`No available tickets number found in text: ${availableTicketsText}`);
                        }
                    } else {
                        console.error(`No available tickets element found for event ID: ${eventId}`);
                    }
                } else {
                    console.error('Failed to fetch event details:', response.status, response.statusText);
                }
            },
            onerror: function(error) {
                console.error('Request error:', error);
            }
        });
    }

    // Function to display the "Available Tickets" number alongside the event link
    function displayAvailableTickets(linkElement, availableTickets) {
        console.log(`Displaying available tickets: ${availableTickets} for link:`, linkElement);

        // Create the badge element
        const badge = document.createElement('span');
        badge.style.backgroundColor = '#4CAF50'; // Green background
        badge.style.color = 'white'; // White text
        badge.style.padding = '5px 10px'; // Padding
        badge.style.borderRadius = '12px'; // Rounded corners
        badge.style.marginLeft = '10px'; // Margin from link
        badge.style.fontSize = '14px'; // Font size
        badge.style.fontWeight = 'bold'; // Bold text
        badge.style.display = 'inline-block'; // Inline-block display
        badge.textContent = `Available Tickets: ${availableTickets}`;

        // Append the badge to the link element
        linkElement.appendChild(badge);
    }

    // Main function to process event links
    function processEventLinks(links) {
        links.forEach(link => {
            if (processedLinks.has(link.href)) {
                console.log('Already processed link:', link.href);
                return;
            }
            console.log('Processing link:', link);
            const eventIdMatch = link.href.match(/\/events\/(\d+)/);
            if (eventIdMatch) {
                const eventId = eventIdMatch[1];
                console.log(`Found event ID: ${eventId}`);
                fetchEventDetails(eventId, link);
                processedLinks.add(link.href);
            } else {
                console.error('No event ID found in link:', link);
            }
        });
    }

    // Initialize the observer to watch for newly added nodes
    function initializeObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    const addedLinks = [];
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Ensure it's an element node
                            if (node.matches && node.matches('a[href^="/events/"]')) {
                                addedLinks.push(node);
                            }
                            const childLinks = node.querySelectorAll ? node.querySelectorAll('a[href^="/events/"]') : [];
                            childLinks.forEach(link => addedLinks.push(link));
                        }
                    });
                    if (addedLinks.length) {
                        console.log(`Found ${addedLinks.length} new event links.`);
                        processEventLinks(addedLinks);
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Run the script when the page loads
    $(document).ready(function() {
        console.log('Page loaded. Waiting 5 seconds before processing event links...');
        setTimeout(() => {
            console.log('Processing initial event links...');
            const initialLinks = document.querySelectorAll('a[href^="/events/"]');
            processEventLinks(initialLinks);
            initializeObserver();
        }, 5000); // Wait for 5 seconds
    });

})();
