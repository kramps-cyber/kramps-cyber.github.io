const chartApp = ()=>{
    alert('sdfjlksjfl');




    // Sample data - replace with your actual data
const rawData = [
    { id: 1, type: 'Training', date: '2024-01-15', location: 'New York', concerns: 2, attendance: 'On Time', participants: 25 },
    { id: 2, type: 'Meeting', date: '2024-01-20', location: 'Boston', concerns: 1, attendance: 'Late', participants: 15 },
    { id: 3, type: 'Training', date: '2024-02-05', location: 'New York', concerns: 0, attendance: 'On Time', participants: 30 },
    { id: 4, type: 'Meeting', date: '2024-02-10', location: 'Chicago', concerns: 3, attendance: 'Late', participants: 20 },
    { id: 5, type: 'Training', date: '2024-02-15', location: 'Boston', concerns: 1, attendance: 'On Time', participants: 28 },
    { id: 6, type: 'Meeting', date: '2024-03-01', location: 'Chicago', concerns: 2, attendance: 'Late', participants: 18 },
    { id: 7, type: 'Training', date: '2024-03-10', location: 'New York', concerns: 0, attendance: 'On Time', participants: 35 },
    { id: 8, type: 'Meeting', date: '2024-03-15', location: 'Boston', concerns: 4, attendance: 'Late', participants: 22 },
    { id: 9, type: 'Training', date: '2024-04-05', location: 'Chicago', concerns: 1, attendance: 'On Time', participants: 32 },
    { id: 10, type: 'Meeting', date: '2024-04-12', location: 'New York', concerns: 2, attendance: 'Late', participants: 16 }
];

let meetingChart, concernsChart, attendanceChart;

// Initialize the dashboard
function init() {
    populateFilters();
    updateCharts();
    attachEventListeners();
}

// Populate filter dropdowns
function populateFilters() {
    const locations = [...new Set(rawData.map(item => item.location))];
    const types = [...new Set(rawData.map(item => item.type))];

    const locationSelect = document.getElementById('location');
    const typeSelect = document.getElementById('type');

    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationSelect.appendChild(option);
    });

    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
    });
}

// Get filtered data based on current filter values
function getFilteredData() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const location = document.getElementById('location').value;
    const type = document.getElementById('type').value;

    return rawData.filter(item => {
        const itemDate = new Date(item.date);
        const startMatch = !startDate || itemDate >= new Date(startDate);
        const endMatch = !endDate || itemDate <= new Date(endDate);
        const locationMatch = !location || item.location === location;
        const typeMatch = !type || item.type === type;

        return startMatch && endMatch && locationMatch && typeMatch;
    });
}

// Prepare data for Meeting/Training chart
function prepareMeetingData(filteredData) {
    const grouped = {};
    
    filteredData.forEach(item => {
        const month = new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        if (!grouped[month]) {
            grouped[month] = { Meeting: 0, Training: 0 };
        }
        grouped[month][item.type] += item.participants;
    });

    const months = Object.keys(grouped).sort((a, b) => new Date(a + ' 1') - new Date(b + ' 1'));
    
    return {
        labels: months,
        datasets: [
            {
                label: 'Meetings',
                data: months.map(month => grouped[month].Meeting),
                backgroundColor: '#3b82f6',
                borderColor: '#1d4ed8',
                borderWidth: 1
            },
            {
                label: 'Trainings',
                data: months.map(month => grouped[month].Training),
                backgroundColor: '#10b981',
                borderColor: '#047857',
                borderWidth: 1
            }
        ]
    };
}

// Prepare data for Concerns chart
function prepareConcernsData(filteredData) {
    const grouped = {};
    
    filteredData.forEach(item => {
        if (!grouped[item.location]) {
            grouped[item.location] = 0;
        }
        grouped[item.location] += item.concerns;
    });

    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

    return {
        labels: Object.keys(grouped),
        datasets: [{
            label: 'Concerns',
            data: Object.values(grouped),
            backgroundColor: colors.slice(0, Object.keys(grouped).length),
            borderColor: '#ffffff',
            borderWidth: 2
        }]
    };
}

// Prepare data for Attendance chart
function prepareAttendanceData(filteredData) {
    const onTimeCount = filteredData.filter(item => item.attendance === 'On Time').length;
    const lateCount = filteredData.filter(item => item.attendance === 'Late').length;
    
    return {
        labels: ['On Time', 'Late'],
        datasets: [{
            label: 'Attendance',
            data: [onTimeCount, lateCount],
            backgroundColor: ['#10b981', '#f59e0b'],
            borderColor: '#ffffff',
            borderWidth: 2
        }]
    };
}

// Update all charts
function updateCharts() {
    const filteredData = getFilteredData();

    // Destroy existing charts
    if (meetingChart) meetingChart.destroy();
    if (concernsChart) concernsChart.destroy();
    if (attendanceChart) attendanceChart.destroy();

    // Meeting/Training Chart
    const meetingCtx = document.getElementById('meetingChart').getContext('2d');
    meetingChart = new Chart(meetingCtx, {
        type: 'bar',
        data: prepareMeetingData(filteredData),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Participants'
                    }
                }
            }
        }
    });

    // Concerns Chart
    const concernsCtx = document.getElementById('concernsChart').getContext('2d');
    concernsChart = new Chart(concernsCtx, {
        type: 'bar',
        data: prepareConcernsData(filteredData),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Concerns'
                    }
                }
            }
        }
    });

    // Attendance Chart
    const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
    attendanceChart = new Chart(attendanceCtx, {
        type: 'doughnut',
        data: prepareAttendanceData(filteredData),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// Attach event listeners to filters
function attachEventListeners() {
    document.getElementById('startDate').addEventListener('change', updateCharts);
    document.getElementById('endDate').addEventListener('change', updateCharts);
    document.getElementById('location').addEventListener('change', updateCharts);
    document.getElementById('type').addEventListener('change', updateCharts);
}

// Clear all filters
function clearFilters() {
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('location').value = '';
    document.getElementById('type').value = '';
    updateCharts();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);



}


// chartApp()

export default chartApp