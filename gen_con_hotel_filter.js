// ==UserScript==
// @name         Gen Con Hotel Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide hotels on the Gen Con housing website unless they have specific IDs
// @author       kelvi
// @match        https://book.passkey.com/event/*/owner/*/list/hotels*
// @grant        none
// ==/UserScript==

/*
Hey Folks, all you need to do to run this script is add the IDs of the hotels that you want in the allowedIds variable
example: const allowedIds = ['1234', '5678'];
VERY IMPORTANT: Make sure the IDs in the allowedIDs array are strings. If you try to use Intergers, the script will not work.
You can get these IDs from the list at the bottom of this script
This script will refresh the page if it does not find the IDs. It will stop refreshing the pages if it does.
*/


(function() {
    'use strict';
    // List of allowed IDs
    document.body.click();
    const allowedIds = []; //AGAIN, THESE NEED TO BE STRINGS, PUT ' ON EITHER SIDE OF THE ID AND SEPARATE WITH COMMAS

    // Function to check if the allowed IDs are present
    function checkIds() {
        let idsFound = false;

        allowedIds.forEach(id => {
            if (document.getElementById(id)) {
                idsFound = true;
            }
        });

        return idsFound;
    }

    // Function to programmatically click the checkbox twice
    function refreshPage() {
        const checkbox = document.getElementById('show-available-hotels');
        if (checkbox) {
            checkbox.click();
            setTimeout(() => {
                checkbox.click();
            }, 100); // Adjust the delay if necessary
        }
    }

    // Function to hide unwanted list items
    function hideUnwantedItems() {
        const listItems = document.querySelectorAll('li.hotel-item.list-view-item');

        listItems.forEach(item => {
            const itemId = item.id;

            // If the item's ID is not in the allowed list, hide it
            if (!allowedIds.includes(itemId)) {
                item.style.display = 'none';
            }
        });
    }

    // Run the functions after the page loads
    window.addEventListener('load', () => {
        hideUnwantedItems();
        // Check if the allowed IDs are found
        if (!checkIds()) {
            refreshPage();
        }
    });
})();

/*
Alexander - '9655946'
Baymont by Wyndham - Airport/Plainfield - '9651672'
Baymont Inn & Suites Indianapolis Brookville Crossing - '57856'
Bottleworks Hotel - '50145351'
Candlewood Suites Indianapolis East - '3421202'
Candlewood Suites Indy Downtown Medical District - '45598'
Clarion Inn and Suites Northwest - '9239'
Columbia Club Hotel Indianapolis - '1640'
Comfort Inn East Indianapolis - '16382566'
Conrad Indianapolis - '24632'
Country Inn & Suites By Radisson Airport - '17771'
Courtyard by Marriott Capitol Indianapolis Hotel - '1630'
Courtyard by Marriott Downtown Indianapolis - '1143321'
Courtyard by Marriott Indianapolis Airport - '2986'
Crowne Plaza Indianapolis Airport - '1660'
Crowne Plaza Indianapolis Downtown Union Station - '1647'
Delta Hotel by Marriott Indianapolis East - '3824'
Delta Hotels by Marriott Indianapolis Airport - '50014359'
Embassy Suites Indianapolis Downtown - '1655'
Embassy Suites Plainfield / Indianapolis - '49754248'
Fairfield Inn & Suites Indianapolis Downtown - '1157280'
Fairfield Inn & Suites Indianapolis East - '3821'
Hampton Inn & Suites Indianapolis Airport - '11357918'
Hampton Inn Indianapolis Downtown Across from Circle Centre - '1657'
Hampton Inn Indianapolis South - '2027'
Hilton Garden Inn Downtown - '12001'
Hilton Garden Inn Indianapolis Airport - '76355'
Hilton Garden Inn Indianapolis Northwest - '1453558'
Hilton Indianapolis - '1824'
Holiday Inn Express Hotel & Suites Indianapolis Dtn-Conv Ctr Area - '9007'
Holiday Inn Indianapolis Airport - '12322067'
Holiday Inn Indianapolis Downtown - '59320'
Home2 Suites by Hilton Brownsburg - '50808660'
Home2 Suites by Hilton Indianapolis Airport - '49891456'
Home2 Suites Indianapolis Downtown - '14276680'
Homewood Suites by Hilton - Airport/Plainfield - '13026'
Homewood Suites Indianapolis Canal IUPUI - '50196109'
Hotel Indy, A Tribute Portfolio Hotel - '50194038'
Hyatt House Downtown Indianapolis - '49749657'
Hyatt Place - Indianapolis Airport - '1827'
Hyatt Place Indianapolis Downtown - '49749615'
Hyatt Regency Indianapolis - '1663'
Indianapolis Marriott Downtown - '2211'
Indianapolis Marriott East - '1901'
JW Marriott Indianapolis - '1487628'
Le Meridien Indianapolis - '11801355'
Omni Severin Hotel - '1666'
Residence Inn Indianapolis on the Canal - '2206'
SHERATON INDIANAPOLIS CITY CENTRE - '1669'
Sheraton Indianapolis Hotel at Keystone Crossing - '1670'
Sleep Inn & Suites And Conference Center Downtown - '12809225'
SpringHill Suites Indianapolis Downtown - '1143328'
Staybridge Suites Indianapolis Downtown Convention Center - '51608'
The Westin Indianapolis - '1680'
TownePlace Suites Indianapolis Downtown - '50111225'
Tru by Hilton Indianapolis Downtown - '50173919'
Wyndham Indianapolis West - '1823'
*/
