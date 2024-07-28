const express = require('express');
const router = express.Router();
const moment = require('moment');
const path = require('path');

let bmiHistory = [];

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.post('/bmicalculator', (req, res) => {
    const { height, weight, age, gender, unit } = req.body;

    let heightInMeters;
    let weightInKg;

    if (unit === 'imperial') {
        heightInMeters = parseFloat(height) * 0.0254;  
        weightInKg = parseFloat(weight) * 0.453592;  
    } else {
        heightInMeters = parseFloat(height) / 100;  
        weightInKg = parseFloat(weight);
    }

    if (heightInMeters > 0) {
        const bmi = weightInKg / (heightInMeters * heightInMeters);

        let bmiCategory = '';
        if (bmi < 18.5) {
            bmiCategory = 'Underweight';
        } else if (bmi >= 18.5 && bmi < 24.9) {
            bmiCategory = 'Normal weight';
        } else if (bmi >= 25 && bmi < 29.9) {
            bmiCategory = 'Overweight';
        } else {
            bmiCategory = 'Obesity';
        }

        const result = {
            bmi: bmi.toFixed(2),
            category: bmiCategory,
            age,
            gender,
            timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
        };

        bmiHistory.push(result);

        res.json(result);
    } else {
        res.status(400).json({ error: 'Invalid height' });
    }
});

router.get('/history', (req, res) => {
    res.json(bmiHistory);
});

module.exports = router;
