const app = () => {
    // Select all tabs and main content sections
    const tabs = document.querySelectorAll('nav.side > li');
    const mains = document.querySelectorAll('main');
  
    // Setup tabs click behavior
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class & reset styles on all tabs
        tabs.forEach(t => {
          t.classList.remove('active-tab');
          const iconPath = t.querySelector('path');
          if (iconPath) iconPath.style.fill = '#000';
          t.style.color = '#000';
        });
  
        // Set active class & styles on clicked tab
        tab.classList.add('active-tab');
        const iconPath = tab.querySelector('path');
        if (iconPath) iconPath.style.fill = 'orange';
        tab.style.color = 'orange';
  
        // Show the corresponding main content and hide others
        mains.forEach(main => {
          main.style.display = main.classList.contains(tab.classList.value) ? 'flex' : 'none';
        });
      });
    });
  
    // Sample data (consider fixing repeated IDs outside of this script)
    const rawData = [
      { id: 1, department: 'Processing', type: 'Meeting', date: '2024-01-15', location: 'GCS MUSTER ROOM', concerns: 2, attendance: 'On Time', participants: 25, on_time: 20, absent: 2, late: 10 },
      { id: 2, department: 'Processing', type: 'Meeting', date: '2024-01-20', location: 'KMS MUSTER ROOM', concerns: 1, attendance: 'Late', participants: 15, on_time: 20, absent: 2, late: 10 },
      { id: 3, department: 'Engineering', type: 'Meeting', date: '2024-02-05', location: 'GCS MUSTER ROOM', concerns: 0, attendance: 'On Time', participants: 30, on_time: 20, absent: 2, late: 10 },
      { id: 4, department: 'Engineering', type: 'Meeting', date: '2024-12-10', location: 'STP CANTEEN', concerns: 3, attendance: 'Late', participants: 20, on_time: 20, absent: 2, late: 10 },
      { id: 5, department: 'Engineering', type: 'Meeting', date: '2024-11-15', location: 'KMS MUSTER ROOM', concerns: 1, attendance: 'On Time', participants: 28, on_time: 20, absent: 2, late: 10 },
      { id: 6, department: 'Engineering', type: 'Meeting', date: '2024-03-01', location: 'STP CANTEEN', concerns: 2, attendance: 'Late', participants: 18, on_time: 20, absent: 2, late: 10 },
      { id: 7, department: 'Processing', type: 'Meeting', date: '2024-10-10', location: 'GCS MUSTER ROOM', concerns: 0, attendance: 'On Time', participants: 35, on_time: 20, absent: 2, late: 10 },
      { id: 8, department: 'Processing', type: 'Meeting', date: '2024-09-15', location: 'KMS MUSTER ROOM', concerns: 4, attendance: 'Late', participants: 22, on_time: 20, absent: 2, late: 10 },
      { id: 9, department: 'Processing', type: 'Meeting', date: '2024-04-05', location: 'STP CANTEEN', concerns: 1, attendance: 'On Time', participants: 32, on_time: 20, absent: 2, late: 10 },
      { id: 10, department: 'Processing', type: 'Meeting', date: '2024-05-05', location: 'STP CANTEEN', concerns: 1, attendance: 'On Time', participants: 32, on_time: 20, absent: 2, late: 10 },
      { id: 11, department: 'Processing', type: 'Meeting', date: '2024-06-05', location: 'STP CANTEEN', concerns: 1, attendance: 'On Time', participants: 32, on_time: 20, absent: 2, late: 10 },
      { id: 12, department: 'Processing', type: 'Meeting', date: '2024-07-05', location: 'STP CANTEEN', concerns: 1, attendance: 'On Time', participants: 32, on_time: 20, absent: 2, late: 10 },
      { id: 13, department: 'Processing', type: 'Meeting', date: '2024-08-05', location: 'STP CANTEEN', concerns: 1, attendance: 'On Time', participants: 32, on_time: 20, absent: 2, late: 10 },
      { id: 14, department: 'PSBI', type: 'Meeting', date: '2024-04-12', location: 'GCS MUSTER ROOM', concerns: 2, attendance: 'Late', participants: 16, on_time: 20, absent: 2, late: 10 }
    ];
  
    let meetingChart, concernsChart, attendanceChart;
  
    // Initialize dashboard
    function init() {
      populateFilters();
      updateCharts();
      attachEventListeners();
    }
  
    // Populate filter dropdowns dynamically
    function populateFilters() {
      const locations = [...new Set(rawData.map(item => item.location))];
      const departments = [...new Set(rawData.map(item => item.department))];
  
      const locationSelect = document.getElementById('location');
      const departmentSelect = document.getElementById('department');
  
      // Clear existing options except default
      locationSelect.innerHTML = '<option value="">All Locations</option>';
      departmentSelect.innerHTML = '<option value="">All Departments</option>';
  
      locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationSelect.appendChild(option);
      });
  
      departments.forEach(department => {
        const option = document.createElement('option');
        option.value = department;
        option.textContent = department;
        departmentSelect.appendChild(option);
      });
    }
  
    // Filter data based on filters
    function getFilteredData() {
      const startDate = document.getElementById('startDate').value;
      const endDate = document.getElementById('endDate').value;
      const location = document.getElementById('location').value;
      const department = document.getElementById('department').value;
  
      return rawData.filter(item => {
        const itemDate = new Date(item.date);
        const startMatch = !startDate || itemDate >= new Date(startDate);
        const endMatch = !endDate || itemDate <= new Date(endDate);
        const locationMatch = !location || item.location === location;
        const departmentMatch = !department || item.department === department;
        const typeMatch = item.type === "Meeting";
  
        return startMatch && endMatch && locationMatch && departmentMatch && typeMatch;
      });
    }
  
    // Prepare meeting data for bar chart
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
          label: 'Meetings',
          data: months.map(month => grouped[month].Meeting),
          backgroundColor: '#3b82f6',
          borderColor: '#1d4ed8',
          borderWidth: 1
        }]
      };
    }
  
    // Prepare concerns data for doughnut chart
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
          borderColor: '#fff',
          borderWidth: 2
        }]
      };
    }
  
    // Prepare attendance data for doughnut chart
    function prepareAttendanceData(filteredData) {
      const onTimeCount = filteredData.reduce((acc, item) => acc + (item.on_time || 0), 0);
      const lateCount = filteredData.reduce((acc, item) => acc + (item.late || 0), 0);
      const absentCount = filteredData.reduce((acc, item) => acc + (item.absent || 0), 0);
  
      return {
        labels: ['On Time', 'Late', 'Absent'],
        datasets: [{
          label: 'Attendance',
          data: [onTimeCount, lateCount, absentCount],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderColor: '#fff',
          borderWidth: 2
        }]
      };
    }
  
    // Create or update charts
    function updateCharts() {
      const filteredData = getFilteredData();
  
      // Meetings bar chart
      const meetingCtx = document.getElementById('meetingChart').getContext('2d');
      const meetingData = prepareMeetingData(filteredData);
      if (meetingChart) meetingChart.destroy();
      meetingChart = new Chart(meetingCtx, {
        type: 'bar',
        data: meetingData,
        options: {
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { display: false } }
        }
      });
  
      // Concerns doughnut chart
      const concernsCtx = document.getElementById('concernsChart').getContext('2d');
      const concernsData = prepareConcernsData(filteredData);
      if (concernsChart) concernsChart.destroy();
      concernsChart = new Chart(concernsCtx, {
        type: 'doughnut',
        data: concernsData,
        options: {
          cutout: '65%',
          plugins: { legend: { position: 'bottom' } }
        }
      });
  
      // Attendance doughnut chart
      const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
      const attendanceData = prepareAttendanceData(filteredData);
      if (attendanceChart) attendanceChart.destroy();
      attendanceChart = new Chart(attendanceCtx, {
        type: 'doughnut',
        data: attendanceData,
        options: {
          cutout: '65%',
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }
  
    // Attach event listeners for filter inputs and clear button
    function attachEventListeners() {
      ['startDate', 'endDate', 'location', 'department'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateCharts);
      });
  
      document.getElementById('clear').addEventListener('click', () => {
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        document.getElementById('location').value = '';
        document.getElementById('department').value = '';
        updateCharts();
      });
    }
  
    // Initialize the app
    init();
  };
  
  app();
  