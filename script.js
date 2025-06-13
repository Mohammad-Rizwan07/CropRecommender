// Sample dataset (in a real app, you would load the CSV)
const cropData = [
    { N: 90, P: 42, K: 43, temperature: 20.879744, humidity: 82.002744, ph: 6.502985, rainfall: 202.935536, label: "rice" },
    { N: 85, P: 58, K: 41, temperature: 21.770462, humidity: 80.319644, ph: 7.038096, rainfall: 226.655537, label: "rice" },
    { N: 60, P: 55, K: 44, temperature: 23.004459, humidity: 82.320763, ph: 7.840207, rainfall: 263.964248, label: "rice" },
    { N: 74, P: 35, K: 40, temperature: 26.491096, humidity: 80.158363, ph: 6.980401, rainfall: 242.864034, label: "rice" },
    { N: 78, P: 42, K: 42, temperature: 20.130175, humidity: 81.604873, ph: 7.628473, rainfall: 262.717340, label: "rice" }
    // Add more data as needed
];

// Unique crop labels from the dataset
const cropLabels = [...new Set(cropData.map(item => item.label))];
const featureCount = Object.keys(cropData[0]).length - 1; // Exclude the label

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dataset info
    document.getElementById('crop-count').textContent = cropLabels.length;
    document.getElementById('feature-count').textContent = featureCount;
    
    // Render sample data table
    renderDataTable();
    
    // Initialize chart
    renderCropDistributionChart();
    
    // Setup form submission
    document.getElementById('prediction-form').addEventListener('submit', function(e) {
        e.preventDefault();
        predictCrop();
    });
});

function renderDataTable() {
    const tableBody = document.querySelector('#crop-table tbody');
    tableBody.innerHTML = '';
    
    // Show only first 5 rows for sample
    cropData.slice(0, 5).forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.N}</td>
            <td>${row.P}</td>
            <td>${row.K}</td>
            <td>${row.temperature.toFixed(2)}</td>
            <td>${row.humidity.toFixed(2)}</td>
            <td>${row.ph.toFixed(2)}</td>
            <td>${row.rainfall.toFixed(2)}</td>
            <td>${row.label}</td>
        `;
        tableBody.appendChild(tr);
    });
}

function renderCropDistributionChart() {
    const ctx = document.getElementById('cropDistributionChart').getContext('2d');
    
    // Count occurrences of each crop
    const cropCounts = {};
    cropLabels.forEach(label => {
        cropCounts[label] = cropData.filter(item => item.label === label).length;
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: cropLabels,
            datasets: [{
                label: 'Number of Samples',
                data: Object.values(cropCounts),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Samples'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Crop Types'
                    }
                }
            }
        }
    });
}

function predictCrop() {
    // In a real application, this would call a machine learning model
    // For this demo, we'll simulate a prediction by finding the closest match
    
    const form = document.getElementById('prediction-form');
    const inputs = form.elements;
    
    const inputData = {
        N: parseFloat(inputs.nitrogen.value),
        P: parseFloat(inputs.phosphorus.value),
        K: parseFloat(inputs.potassium.value),
        temperature: parseFloat(inputs.temperature.value),
        humidity: parseFloat(inputs.humidity.value),
        ph: parseFloat(inputs.ph.value),
        rainfall: parseFloat(inputs.rainfall.value)
    };
    
    // Simple distance calculation to find closest match (simulating ML prediction)
    let minDistance = Infinity;
    let predictedCrop = '';
    
    cropData.forEach(item => {
        const distance = Math.sqrt(
            Math.pow(item.N - inputData.N, 2) +
            Math.pow(item.P - inputData.P, 2) +
            Math.pow(item.K - inputData.K, 2) +
            Math.pow(item.temperature - inputData.temperature, 2) +
            Math.pow(item.humidity - inputData.humidity, 2) +
            Math.pow(item.ph - inputData.ph, 2) +
            Math.pow(item.rainfall - inputData.rainfall, 2)
        );
        
        if (distance < minDistance) {
            minDistance = distance;
            predictedCrop = item.label;
        }
    });
    
    // Display result
    document.getElementById('recommended-crop').textContent = predictedCrop;
    document.getElementById('prediction-result').style.display = 'block';
}
