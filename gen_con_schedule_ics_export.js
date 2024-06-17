// ==UserScript==
// @name         Gen Con Calendar Export to ICS
// @namespace    http://tampermonkey.net/
// @version      2024-05-22
// @description  Export Gen Con schedule to .ics calendar file
// @author       kelvi
// @match        https://www.gencon.com/schedules/*?c=indy2024
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gencon.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function getEvents() {
        const events = [];
        const scheduleItems = document.querySelectorAll('.schedule-item');

        const dateMap = {
            'Wed': '2024-07-31',
            'Thu': '2024-08-01',
            'Fri': '2024-08-02',
            'Sat': '2024-08-03',
            'Sun': '2024-08-04'
        };

        scheduleItems.forEach(item => {
            const eventTitle = item.querySelector('.event-title').textContent.trim();
            if (eventTitle !== "Gen Con Games Library Weekend Pass") {
                const eventDetails = item.querySelectorAll('.tl-text'); // Select all elements with class tl-text
                const eventDateTime = eventDetails[0].textContent.trim(); // First element is date/time
                const eventLocation = eventDetails[1].textContent.trim(); // Second element is location
                const [eventDay, timePart] = eventDateTime.split(' at ');
                const [eventTime, durationPart] = timePart.split(' EDT for ');

                const parsedEventTime = parseEventTime(eventTime.trim());
                const eventStartDate = getEventDate(dateMap[eventDay.trim()], parsedEventTime);
                const eventEndDate = new Date(eventStartDate);

                const [eventHr, eventMin] = parseDuration(durationPart.trim());
                eventEndDate.setHours(eventEndDate.getHours() + eventHr);
                eventEndDate.setMinutes(eventEndDate.getMinutes() + eventMin);

                events.push({
                    title: eventTitle,
                    start: eventStartDate.toISOString(),
                    end: eventEndDate.toISOString(),
                    location: eventLocation
                });
            }
        });

        return events;
    }

    function parseEventTime(eventTime) {
        let [hours, minutes] = eventTime.split(':');
        const period = minutes.includes('pm') ? 'pm' : 'am';
        minutes = minutes.replace(/(am|pm)/, '').trim();
        hours = parseInt(hours);
        if (period === 'pm' && hours !== 12) hours += 12;
        if (period === 'am' && hours === 12) hours = 0;
        return { hours, minutes: parseInt(minutes) };
    }

    function getEventDate(dateString, time) {
        const [year, month, day] = dateString.split('-');
        const eventDate = new Date(Date.UTC(year, month - 1, day, time.hours, time.minutes));
        return eventDate;
    }

    function parseDuration(duration) {
        const [hours, minutes] = duration.includes('min') ?
            duration.split(' hr ').map(part => parseInt(part)) :
            [parseInt(duration), 0];
        return [hours, minutes || 0];
    }

    function generateICS(events) {
        let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Your Organization//Your Product//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n';
        events.forEach(event => {
            icsContent += 'BEGIN:VEVENT\n';
            icsContent += `SUMMARY:${event.title}\n`;
            icsContent += `DTSTART:${event.start.replace(/[-:]/g, '').replace('.000Z', 'Z')}\n`;
            icsContent += `DTEND:${event.end.replace(/[-:]/g, '').replace('.000Z', 'Z')}\n`;
            icsContent += `LOCATION:${event.location}\n`;
            icsContent += `DESCRIPTION:${event.title}\n`; // Adding description
            icsContent += `UID:${generateUID()}\n`;
            icsContent += 'END:VEVENT\n';
        });
        icsContent += 'END:VCALENDAR';

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gen_con_schedule.ics';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function generateUID() {
        return 'uid-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }

    function createDownloadButton() {
        const button = document.createElement('button');
        button.textContent = 'Download ICS';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
            const events = getEvents();
            generateICS(events);
        });

        const ribbonTop = document.querySelector('.ribbon-top .flex-row.flex-space-between');
        if (ribbonTop) {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'inline-block';
            buttonContainer.style.marginLeft = '10px';
            buttonContainer.appendChild(button);
            ribbonTop.appendChild(buttonContainer);
        } else {
            console.error('Failed to find the .ribbon-top .flex-row.flex-space-between element.');
        }
    }

    $(document).ready(function() {
        console.log('Page loaded. Adding download button...');
        createDownloadButton();
    });
})();
