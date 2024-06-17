// ==UserScript==
// @name         Gen Con Calendar View
// @namespace    http://tampermonkey.net/
// @version      2024-05-22
// @description  parse event data from gen con schedule and display it in a calendar view
// @author       kelvi
// @match        https://www.gencon.com/schedules/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gencon.com
// @require      https://cdn.jsdelivr.net/npm/fullcalendar@6.1.12/index.global.min.js
// @grant        none
// ==/UserScript==

/*
Hey Gen Con Homies! This script will add a calendar view to your Schedule page. Keep in mind, I wrote this for me.
I cannot promise it will always work. All of the processing is done client-side. This script requires the 
FullCalender library, which is imported via CDN. It *should* only run on the schedule page. 

To install:
1) Make sure you have the TamperMonkey extension installed (you can get it from your browser's extension stor)
2) Create a new userscript
3) Paste this entire script into the field and save
4) Reload schedule page

*/
(function() {
    'use strict';


    // Create a container for the calendar
    const calendarContainer = document.createElement('div');
    calendarContainer.id = 'calendar';
    calendarContainer.style = 'max-width: 900px; margin: 0 auto; background:white;';

    function initializeCalendar(events) {
        const calendarEl = document.getElementById('calendar');
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'timeGridWeek',
            initialDate: '2024-08-01',
            slotMinTime: '08:00:00',
            firstDay: 1,
            hiddenDays: [1,2],
            events: events
        });
        calendar.render();
    }

    function getEvents() {
    const events = [];
    const scheduleItems = document.querySelectorAll('.schedule-item');

    const dateMap = {
        'Thu': '2024-08-01',
        'Fri': '2024-08-02',
        'Sat': '2024-08-03',
        'Sun': '2024-08-04'
    };

    scheduleItems.forEach(item => {
        const eventTitle = item.querySelector('.event-title').textContent.trim();
        const eventDate = item.querySelector('.tl-text').textContent.trim();
        const [eventDay, timePart] = eventDate.split(' at ');
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
            end: eventEndDate.toISOString()
        });
    });

    return events;
}

function parseEventTime(eventTime) {
    let [time, period] = eventTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function getEventDate(date, time) {
    return new Date(`${date}T${time}:00-04:00`);
}

function parseDuration(duration) {
    const [hours, mins] = duration.split(' hr ').map(part => part.includes('min') ? parseInt(part.split(' ')[0]) : parseInt(part));
    return [hours || 0, mins || 0];
}

    function checkFullCalendarReady(callback) {
        if (typeof FullCalendar !== 'undefined') {
            callback();
        } else {
            console.log('Waiting for FullCalendar to load...');
            setTimeout(() => checkFullCalendarReady(callback), 100);
        }
    }

    function init() {
        console.log('Page loaded. Waiting 5 seconds before processing event links...'); //my internet is slow, you may not need the timeout.
        setTimeout(() => {
            console.log('Processing event links...');
            const events = getEvents();
            const scheduleContainer = document.querySelector('.finder');
            if (scheduleContainer) {
                scheduleContainer.appendChild(calendarContainer);
            }
            initializeCalendar(events);
        }, 5000);
    }

    init();
})();