import { LightningElement, track, api } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import flatpickrjs from '@salesforce/resourceUrl/flatpickrjs';
import flatpickrcss from '@salesforce/resourceUrl/flatpickrcss';

export default class DatesSelector extends LightningElement {
    @track displayedFormattedDates = ''; // displayed dates at front
    @api datesGroup1; // First set of dates for Flow
    @api datesGroup2; // Second set of dates for Flow
    @api datesGroup3; // Third set of dates for Flow

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

        // Format dates to "YYMMDD"
        const formatted = selectedDates.map(date => 
            date.toLocaleDateString('en-CA').replace(/-/g, '').slice(2) // 'en-CA' uses YYYY-MM-DD, slice off the century
        );

        // Display formatted dates
        this.displayedFormattedDates = formatted.join(', ').replace(/(\d{2})(\d{2})(\d{2})/g, '20$1/$2/$3');

        // Split formatted dates into groups of 42
        this.datesGroup1 = formatted.slice(0, 42).join('');
        this.datesGroup2 = formatted.slice(42, 84).join('');
        this.datesGroup3 = formatted.slice(84, 126).join('');

        // console.log('Selected dates:', this.displayedFormattedDates);
        // console.log('Group 1 Dates:', this.datesGroup1);
        // console.log('Group 2 Dates:', this.datesGroup2);
        // console.log('Group 3 Dates:', this.datesGroup3);
    }
}
