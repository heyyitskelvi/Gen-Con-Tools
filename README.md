# Gen Con Tools

Welcome to the Gen Con Tools repository! This project contains a set of TamperMonkey scripts designed to enhance your Gen Con experience by providing additional functionalities for managing hotels, tickets, and event schedules.

## Table of Contents
- [Gen Con Hotel Filter](#gen-con-hotel-filter)
- [Gen Con Available Ticket Tool](#gen-con-available-ticket-tool)
- [Gen Con Cal View](#gen-con-cal-view)
- [Gen Con Schedule ICS Tool](#gen-con-schedule-ics-tool)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Gen Con Hotel Filter

This script hides all but the selected hotels on the Gen Con hotel page. If the selected hotel is not present, the page will automatically refresh until it becomes available. The refreshing will stop once the selected hotel is found.

## Gen Con Available Ticket Tool

The Available Ticket Tool script displays the number of tickets available for an event directly on the events page, saving you the hassle of navigating away from the page to check availability.

## Gen Con Cal View

The Cal View script enhances your Schedule page by displaying your events in a calendar format, providing a more visual and organized way to view your schedule.

## Gen Con Schedule ICS Tool

This script allows you to export the events on your Schedule page as a .ics file, which can be easily imported into your preferred calendar application.

## Installation

To use these TamperMonkey scripts, follow these steps:

1. Install TamperMonkey for your browser:
    - [Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
    - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
    - [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/iikmkjmpaadaobahmlepeloendndfphd)
    - [Safari App Store](https://apps.apple.com/us/app/tampermonkey/id1482490089)

2. Open TamperMonkey and create a new script for each tool by copying and pasting the corresponding script file content directly from the repository.

## Usage

### Gen Con Hotel Filter

1. Open the Gen Con hotel page in your browser.
2. The script will filter hotels and refresh the page if the selected hotel is not present.

### Gen Con Available Ticket Tool

1. Open the Gen Con events page in your browser.
2. The script will display the number of available tickets for each event.

### Gen Con Cal View

1. Open your Gen Con Schedule page in your browser.
2. The script will transform the list of events into a calendar view.

### Gen Con Schedule ICS Tool

1. Open your Gen Con Schedule page in your browser.
2. The script will provide an option to export your schedule as a .ics file.
