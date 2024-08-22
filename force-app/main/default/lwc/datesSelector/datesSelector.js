import { LightningElement } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import flatpickrjs from '@salesforce/resourceUrl/flatpickrjs';
import flatpickrcss from '@salesforce/resourceUrl/flatpickrcss';

export default class DatesSelector extends LightningElement {
    renderedCallback() {
        Promise.all([
            loadScript(this, flatpickrjs),
            loadStyle(this, flatpickrcss)
        ])
        .then(() => {
            this.initializeCalendar();
        })
        .catch(error => {
            console.error('Error loading Flatpickr resources:', error);
        });
    }

    initializeCalendar() {
        const element = this.template.querySelector('.flatpickr');
        flatpickr(element, {
            inline: true, // Set the calendar to be always visible
            dateFormat: "Ymd",
            mode: "multiple",
            onChange: this.handleDateChange.bind(this)
        });
    }

    handleDateChange(selectedDates) {
        // Triggered when dates are selected; format and handle data as needed
        console.log('Selected dates:', selectedDates);
    }
}
