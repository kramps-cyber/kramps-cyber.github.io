const app = () => {
    const tabs = document.querySelectorAll('nav.side > li');
    const mains = document.querySelectorAll('main');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            setTimeout(() => {
                tabs.forEach(tab => {
                    tab.style.color = `#000`;
                    tab.querySelector(`path`).style.fill = `#000`;
                });
                tab.style.color = `orange`;
                tab.querySelector(`path`).style.fill = `orange`;
                mains.forEach(main => {
                    main.style.display = `none`;
                    if (main.classList.contains(`${tab.classList.value}`)) {
                        main.style.display = `flex`;
                    }
                });
            }, 1);
        });
    });

    const rawData = [
        { id: 1, department: 'Processing', type: 'Meeting', date: '2024-01-15', location: 'GCS MUSTER ROOM', concerns: 2, attendance: 'On Time', participants: 25, on_time: 20, absent: 2, late: 10 },
        { id: 2, department: 'Processing', type: 'Meeting', date: '2024-01-20', location: 'KMS MUSTER ROOM', concerns: 1, attendance: 'Late', participants: 15, on_time: 20, absent: 2, late: 10 },
        { id: 3, department: 'Engineering', type: 'Meeting', date: '2024-02-05', location: 'GCS MUSTER ROOM', concerns: 0, attendance: 'On Time', participants: 30, on_time: 20, absent: 2, late: 10 },
        { id: 4, department: 'Engineering', type: 'Meeting', date: '2024-12-10', location: 'STP CANTEEN', concerns: 3, attendance: 'Late', participants: 20, on_time: 20, absent: 2, late: 10 },
        { id: 5, department: 'Engineering', type: 'Meeting', date: '2024-11-15', location: 'KMS MUSTER ROOM', concerns: 1, attendance: 'On Time', participants: 28, on_time: 20, absent: 2, late: 10 },
        { id: 10, department: 'PSBI', type: 'Meeting', date: '2024-04-12', location: 'GCS MUSTER ROOM', concerns: 2, attendance: 'Late', participants: 16, on_time: 20, absent: 2, late: 10 },
        { id: 10, department: 'PSBI', type: 'Meeting', date: '2024-04-12', location: 'SCBC', concerns: 2, attendance: 'Late', participants: 16, on_time: 20, absent: 2, late: 10 }
    ];

    const personData = [
        { name: "John Doe", meetingId: 1 },
        { name: "Jane Smith", meetingId: 1 },
        { name: "Alice Brown", meetingId: 3 },
        { name: "David Black", meetingId: 4 },
        { name: "Jane Smith", meetingId: 5 },
        { name: "Samuel Ash", meetingId: 10 }
    ];

    let meetingChart, concernsChart, attendanceChart;

    function getDynamicMeetingTitle() {
        const location = document.getElementById('location').value;
        const department = document.getElementById('department').value;
        const name = document.getElementById('dashboardname').value;

        let title = 'Meetings by Month';
        if (name) title += ` for ${name}`;
        if (department) title += ` (${department})`;
        if (location) title += ` at ${location}`;

        return title;
    }

    function getFilteredData() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const location = document.getElementById('location').value;
        const department = document.getElementById('department').value;
        const name = document.getElementById('dashboardname').value.toLowerCase();

        const matchingIds = name
            ? personData
                .filter(person => person.name.toLowerCase().includes(name))
                .map(person => person.meetingId)
            : null;

        return rawData.filter(item => {
            const itemDate = new Date(item.date);
            const startMatch = !startDate || itemDate >= new Date(startDate);
            const endMatch = !endDate || itemDate <= new Date(endDate);
            const locationMatch = !location || item.location === location;
            const departmentMatch = !department || item.department === department;
            const nameMatch = !name || matchingIds.includes(item.id);
            const typeMatch = item.type === "Meeting";

            return startMatch && endMatch && locationMatch && departmentMatch && nameMatch && typeMatch;
        });
    }

    function prepareMeetingData(filteredData) {
        const grouped = {};
        filteredData.forEach(item => {
            const month = new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            if (!grouped[month]) grouped[month] = { Meeting: 0 };
            grouped[month][item.type] += item.participants;
        });

        const months = Object.keys(grouped).sort((a, b) => new Date(a + ' 1') - new Date(b + ' 1'));

        return {
            labels: months,
            datasets: [{
                label: getDynamicMeetingTitle(),
                data: months.map(month => grouped[month].Meeting),
                backgroundColor: '#3b82f6',
                borderColor: '#1d4ed8',
                borderWidth: 1,
                barThickness: 40,
                maxBarThickness: 40
            }]
        };
    }

    function prepareConcernsData(filteredData) {
        const grouped = {};
        filteredData.forEach(item => {
            if (!grouped[item.location]) grouped[item.location] = 0;
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

    function prepareAttendanceData(filteredData) {
        const onTime = filteredData.reduce((sum, item) => sum + (item.on_time || 0), 0);
        const late = filteredData.reduce((sum, item) => sum + (item.late || 0), 0);
        const absent = filteredData.reduce((sum, item) => sum + (item.absent || 0), 0);

        return {
            labels: ['On Time', 'Absent', 'Late'],
            datasets: [{
                label: 'Attendance',
                data: [onTime, absent, late],
                backgroundColor: ['#10b981', '#f59e0b', 'blue'],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        };
    }

    function updateCharts() {
        const filteredData = getFilteredData();
        const titleEl = document.querySelector('.chart-title');
        if (titleEl) titleEl.textContent = getDynamicMeetingTitle();

        if (meetingChart) meetingChart.destroy();
        if (concernsChart) concernsChart.destroy();
        if (attendanceChart) attendanceChart.destroy();

        meetingChart = new Chart(document.getElementById('meetingChart').getContext('2d'), {
            type: 'bar',
            data: prepareMeetingData(filteredData),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Participants' }
                    }
                }
            }
        });

        concernsChart = new Chart(document.getElementById('concernsChart').getContext('2d'), {
            type: 'doughnut',
            data: prepareConcernsData(filteredData),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 10, usePointStyle: true }
                    }
                }
            }
        });

        attendanceChart = new Chart(document.getElementById('attendanceChart').getContext('2d'), {
            type: 'doughnut',
            data: prepareAttendanceData(filteredData),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 20, usePointStyle: true }
                    }
                }
            }
        });
    }

    function populateFilters() {
        const locations = [...new Set(rawData.map(item => item.location))];
        const departments = [...new Set(rawData.map(item => item.department))];

        const locationSelect = document.getElementById('location');
        const departmentSelect = document.getElementById('department');

        locations.forEach(loc => {
            const opt = document.createElement('option');
            opt.value = loc;
            opt.textContent = loc;
            locationSelect.appendChild(opt);
        });

        departments.forEach(dep => {
            const opt = document.createElement('option');
            opt.value = dep;
            opt.textContent = dep;
            departmentSelect.appendChild(opt);
        });
    }

    function attachEventListeners() {
        document.getElementById('startDate').addEventListener('change', updateCharts);
        document.getElementById('endDate').addEventListener('change', updateCharts);
        document.getElementById('location').addEventListener('change', updateCharts);
        document.getElementById('department').addEventListener('change', updateCharts);
    }

    function setupNameAutocomplete() {
        const input = document.getElementById('dashboardname');
        const suggestionBox = document.getElementById('nameSuggestions');

        input.addEventListener('input', () => {
            const query = input.value.toLowerCase().trim();
            suggestionBox.innerHTML = '';
            if (!query) return;

            const matches = [...new Set(
                personData.map(p => p.name).filter(name => name.toLowerCase().includes(query))
            )];

            if (matches.length === 0) {
                const noMatch = document.createElement('div');
                noMatch.textContent = 'No match found';
                noMatch.className = 'no-match';
                suggestionBox.appendChild(noMatch);
                return;
            }

            matches.slice(0, 8).forEach(name => {
                const div = document.createElement('div');
                div.innerHTML = highlightMatch(name, query);
                div.addEventListener('click', () => {
                    input.value = name;
                    suggestionBox.innerHTML = '';
                    updateCharts();
                });
                suggestionBox.appendChild(div);
            });
        });

        document.addEventListener('click', e => {
            if (!input.contains(e.target) && !suggestionBox.contains(e.target)) {
                suggestionBox.innerHTML = '';
            }
        });
    }

    function highlightMatch(name, query) {
        const regex = new RegExp(`(${query})`, 'ig');
        return name.replace(regex, '<span class="autocomplete-highlight">$1</span>');
    }

    function clearFilters() {
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        document.getElementById('location').value = '';
        document.getElementById('department').value = '';
        document.getElementById('dashboardname').value = '';
        document.getElementById('nameSuggestions').innerHTML = '';
        updateCharts();
    }

    document.querySelector('.clear-btn').addEventListener('click', clearFilters);
    document.addEventListener('DOMContentLoaded', () => {
        populateFilters();
        updateCharts();
        attachEventListeners();
        setupNameAutocomplete();
    });
};

app();
