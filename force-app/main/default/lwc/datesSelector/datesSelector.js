import { LightningElement, track, api } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import flatpickrjs from '@salesforce/resourceUrl/flatpickrjs';
import flatpickrcss from '@salesforce/resourceUrl/flatpickrcss';

export default class DatesSelector extends LightningElement {
    @track formattedDates = '';

    japaneseLocale = {
        weekdays: {
            shorthand: ["日", "月", "火", "水", "木", "金", "土"],
            longhand: [
                "日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"
            ]
        },
        months: {
            shorthand: [
                "1月", "2月", "3月", "4月", "5月", "6月",
                "7月", "8月", "9月", "10月", "11月", "12月"
            ],
            longhand: [
                "1月", "2月", "3月", "4月", "5月", "6月",
                "7月", "8月", "9月", "10月", "11月", "12月"
            ]
        },
        firstDayOfWeek: 0, // Start the week on Sunday
        time_24hr: true,
        rangeSeparator: ' から ',
        monthAriaLabel: '月',
        amPM: ['午前', '午後'],
        yearAriaLabel: '年',
        hourAriaLabel: '時間',
        minuteAriaLabel: '分'
    };

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
            locale: this.japaneseLocale,
            dateFormat: "Ymd",
            mode: "multiple",
            static: true, // Keep the calendar view static
            onChange: this.handleDateChange.bind(this)
        });
    }

    handleDateChange(selectedDates) {
        // Sort dates from earliest to latest
        selectedDates.sort((a, b) => a - b);

        // Format dates to "YYYY/MM/DD"
        this.formattedDates = selectedDates.map(date => {
            return date.toLocaleDateString('en-CA'); // 'en-CA' uses YYYY-MM-DD format, which we then replace
        }).join(', ').replace(/-/g, '/');

        console.log('Selected dates:', this.formattedDates);
    }
}
