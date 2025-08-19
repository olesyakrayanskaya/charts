'use strict'

// цвета

const root = document.querySelector(':root');
const style = getComputedStyle(root);
const firstLineChartColor = style.getPropertyValue('--First-line-chart-color');
const secondLineChartColor = style.getPropertyValue('--Second-line-chart-color');
const pointLineChartColor = style.getPropertyValue('--Point-line-chart-color');
const pointStrokeLineChartColor = style.getPropertyValue('--Point-stroke-line-chart-color');
const pointSingleLineChartColor = style.getPropertyValue('--Point-single-line-chart-color');
const pointSingleStrokeLineChartColor = style.getPropertyValue('--Point-stroke-single-line-chart-color');
const firstBarChartColor = style.getPropertyValue('--First-bar-chart-color');
const secondBarChartColor = style.getPropertyValue('--Second-bar-chart-color');
const strokeBarChartColor = style.getPropertyValue('--Stroke-bar-chart-color');
const gridColor = style.getPropertyValue('--Grid-color');
const gridSingleChartColor = style.getPropertyValue('--Grid-single-chart-color');

// breakpoints

const tablBp = 768;
const mobBp = 600;

const windowWidth = window.innerWidth;

// первый тип графика

const canvas = document.querySelector('#chart-1');
const ctx = canvas.getContext('2d');

const chart1Data = {
    data1: {
        'неделя 40': 38000,
        'неделя 42': 50000,
        'неделя 44': 45000,
        'неделя 45': 30000,
        'неделя 46': 25000,
        'неделя 43': 38000,
        'неделя 47': 30000,
        'неделя 48': 35000,
        'неделя 49': 40000,
        'неделя 50': 25000,
    },
    data2: {
        'неделя 40': 42000,
        'неделя 42': 45000,
        'неделя 44': 35000,
        'неделя 45': 45000,
        'неделя 46': 50000,
        'неделя 43': 32000,
        'неделя 47': 25000,
        'неделя 48': 30000,
        'неделя 49': 28000,
        'неделя 53': 36000,
    },
    data3: {
        'неделя 40': 35,
        'неделя 42': 50,
        'неделя 44': 100,
        'неделя 45': 50,
        'неделя 46': 70,
        'неделя 43': 100,
        'неделя 47': 60,
        'неделя 48': 70,
        'неделя 49': 100,
        'неделя 50': 90,
    },
    data4: {
        'неделя 40': 40,
        'неделя 42': 30,
        'неделя 44': 100,
        'неделя 45': 80,
        'неделя 46': 100,
        'неделя 43': 100,
        'неделя 47': 50,
        'неделя 48': 100,
        'неделя 49': 70,
        'неделя 50': 100,
    }
};

const w = document.querySelector('.canvas-wrapper').getBoundingClientRect().width * 0.99;
const h = 600;

// Функция для инициализации и перерисовки первого графика
function renderChart1() {
    initCanvas(canvas, w, h);
    drawChart(50, chart1Data.data1, chart1Data.data2, chart1Data.data3, chart1Data.data4, ctx);
}

renderChart1();

function drawChart(scaleY, data1, data2, data3, data4, ctx) {

    ctx.clearRect(0, 0, w, h);

    const paddingLR = 50;
    const xValues = Array.from(Object.keys({ ...data1, ...data1, ...data1, ...data4 }).sort((a, b) => a.localeCompare(b)));
    const scaleX = Math.ceil((w - paddingLR * 2) / xValues.length);

    // сетка

    const pixelRatio = window.devicePixelRatio || 1;
    ctx.lineWidth = 1 * pixelRatio;
    const gridWidth = 1;

    ctx.beginPath();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = gridWidth;
    ctx.setLineDash([0, 0]);

    // Рисуем горизонтальные линии сетки
    for (let i = scaleY; i < h; i += scaleY) {
        const y = Math.ceil(i) + 0.5; // выравнивание по полупикселю
        ctx.moveTo(paddingLR, y);
        ctx.lineTo(w - paddingLR, y);
    }

    ctx.stroke();
    ctx.closePath();

    // оси координат

    const x0 = paddingLR; // начало координат Ох
    const y0 = h - scaleY; // начало координат Оy

    ctx.font = 'normal 14px sans-serif';
    const axisPoint = 5;

    // Ox

    for (let i = 0; i < xValues.length; i++) {
        const shiftY = 20;
        const textX = x0 + i * scaleX + scaleX / 2;
        const textY = h - shiftY;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(-Math.PI / 8);
        ctx.fillText(xValues[i], 0, 0);
        ctx.restore();
        ctx.moveTo(x0 + i * scaleX, h);
    }

    for (let i = 0; i < xValues.length; i++) {
        ctx.beginPath();
        const x = Math.ceil(x0 + i * scaleX) + 0.5; // выравнивание по полупикселю
        ctx.moveTo(x, y0 + axisPoint);
        ctx.lineTo(x, y0);
        ctx.stroke();
        ctx.closePath();
    }

    // Oy

    const yValuesL = [...Object.values(data1), ...Object.values(data2)];
    const maxValueL = Math.max(...yValuesL);

    const yValuesR = [...Object.values(data3), ...Object.values(data4)];
    const maxValueR = Math.max(...yValuesR);

    const stepsCount = Math.ceil((y0 - scaleY) / scaleY);

    const valueMultL = maxValueL / stepsCount / scaleY;
    const valueMultR = maxValueR / stepsCount / scaleY * 4;

    for (let i = h - scaleY; i >= 0; i -= scaleY) {

        let axisYValueL = ((y0 - i) * valueMultL).toLocaleString('ru-RU');
        let axisYValueR = ((y0 - i) * valueMultR).toLocaleString('ru-RU');

        const shiftXL = 25;
        const shiftYL = 1;
        ctx.moveTo(x0, i);
        if ((y0 - i) >= 0 && (y0 - i) < h - scaleY) {
            ctx.fillText(axisYValueL, x0 - shiftXL, i + shiftYL);
        }
        const shiftXR = 25;
        const shiftYR = 1;
        ctx.moveTo(w, i);
        if ((y0 - i) >= 0 && (y0 - i) < h - scaleY) {
            ctx.fillText(axisYValueR, w - shiftXR, i + shiftYR);
        }
    }

    // линии графика

    const lineColor = firstLineChartColor;
    const lineWidth = 4;

    for (let i = 0; i < xValues.length; i++) {
        let x1Cord = scaleX * i + paddingLR + scaleX / 2;
        let y1Cord = y0 - data1[xValues[i]] / valueMultL;
        let x2Cord = scaleX * (i + 1) + paddingLR + scaleX / 2;
        let y2Cord = y0 - data1[xValues[i + 1]] / valueMultL;
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1Cord, y1Cord);
        ctx.lineTo(x2Cord, y2Cord);
        ctx.stroke();
        ctx.closePath();
    }

    const lineColor2 = secondLineChartColor;

    for (let i = 0; i < xValues.length; i++) {
        let x1Cord = scaleX * i + paddingLR + scaleX / 2;
        let y1Cord = y0 - data2[xValues[i]] / valueMultL;
        let x2Cord = scaleX * (i + 1) + paddingLR + scaleX / 2;
        let y2Cord = y0 - data2[xValues[i + 1]] / valueMultL;
        ctx.strokeStyle = lineColor2;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1Cord, y1Cord);
        ctx.lineTo(x2Cord, y2Cord);
        ctx.stroke();
        ctx.closePath();
    }

    // точки на графике

    const pointR = 3; //радиус точки
    const pointColor = pointLineChartColor;
    const strokePointColor = pointStrokeLineChartColor;
    const widthPointStroke = 2;

    for (let i = 0; i < xValues.length; i++) {
        let xCord = scaleX * i + paddingLR + scaleX / 2;
        let yCord = y0 - data1[xValues[i]] / valueMultL;
        ctx.beginPath();
        ctx.moveTo(xCord, yCord);
        ctx.strokeStyle = strokePointColor;
        ctx.fillStyle = pointColor;
        ctx.lineWidth = widthPointStroke;
        ctx.arc(xCord, yCord, pointR, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    for (let i = 0; i < xValues.length; i++) {
        let xCord = scaleX * i + paddingLR + scaleX / 2;
        let yCord = y0 - data2[xValues[i]] / valueMultL;
        ctx.beginPath();
        ctx.moveTo(xCord, yCord);
        ctx.strokeStyle = strokePointColor;
        ctx.fillStyle = pointColor;
        ctx.lineWidth = widthPointStroke;
        ctx.arc(xCord, yCord, pointR, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    // столбчатая диаграмма

    const barStrokeColor = strokeBarChartColor;
    const barColor = firstBarChartColor;
    const barStrokeColor2 = strokeBarChartColor;
    const barColor2 = secondBarChartColor;
    let barWidth;
    if (windowWidth > mobBp) {
        barWidth = 15;
    } else {
        barWidth = 5;
    }

    for (let i = 0; i < xValues.length; i++) {
        let xCord = scaleX * i + paddingLR + scaleX / 2;
        let yCord = y0 - data3[xValues[i]] / valueMultR;
        ctx.strokeStyle = barStrokeColor;
        ctx.fillStyle = barColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xCord, y0);
        ctx.rect(xCord - barWidth, yCord, barWidth, y0 - yCord);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    for (let i = 0; i < xValues.length; i++) {
        let xCord = scaleX * i + paddingLR + scaleX / 2;
        let yCord = y0 - data4[xValues[i]] / valueMultR;
        ctx.strokeStyle = barStrokeColor2;
        ctx.fillStyle = barColor2;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xCord, y0);
        ctx.rect(xCord, yCord, barWidth, y0 - yCord);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
}

// получение данных, заменить url на нужный
// из полученных данных нужно получить данные для отрисовки диаграмм
// data1, data2, data3, data4: {'неделя№': значение}

async function fetchData() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        console.log('Данные получены:', data);
        processData(data);
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

function processData(data) {
    console.log('Обработка данных:', data);
    // Работа с данными
}

// fetchData();

// второй тип графика 

const canvasSingle = document.querySelector('#chart-2');
const ctx2 = canvasSingle.getContext('2d');

const chart2Data = {
    "неделя 48'24": '2.7%',
    "неделя 49'24": '6.9%',
    "неделя 50'24": '7.3%',
    "неделя 51'24": '7.7%',
    "неделя 52'24": '5.3%',
    "неделя 53'24": '8.7%',
    "неделя 1'25": '9.3%',
    "неделя 2'25": '9.7%',
    "неделя 3'25": '10.5%',
    "неделя 4'25": '9.5%',
    "неделя 5'25": '8.5%',
    "неделя 6'25": '9.5%',
    "неделя 7'25": '7.5%',
    "неделя 8'25": '10.5%',
    "неделя 9'25": '9.5%',
    "неделя 10'25": '7.5%',
};

const w2 = document.querySelector('.canvas-wrapper-2').getBoundingClientRect().width * 0.99;
const h2 = 400;

function renderChart2() {
    initCanvas(canvasSingle, w2, h2);
    drawSingleChart(50, chart2Data, ctx2);
}

renderChart2();

function initCanvas(canvasElement, width, height) {
    canvasElement.setAttribute('width', width);
    canvasElement.setAttribute('height', height);
}

function drawSingleChart(scaleY, data, ctx) {

    ctx.clearRect(0, 0, w2, h2);

    const paddingLR = 55;
    const xValues = Array.from(Object.keys({ ...data }));
    const scaleX = Math.ceil((w2 - paddingLR * 2) / xValues.length) + 0.5;

    // сетка

    const gridColor = gridSingleChartColor;
    const pixelRatio = window.devicePixelRatio || 1;
    ctx.lineWidth = 1 * pixelRatio;
    const gridWidth = 1;

    ctx.beginPath();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = gridWidth;
    ctx.setLineDash([0, 0]);

    // оси координат

    const x0 = paddingLR; // начало координат Ох
    const y0 = h2 - scaleY; // начало координат Оy

    // Рисуем Оx:

    ctx.moveTo(x0, y0);
    ctx.lineTo(w2, y0);
    ctx.stroke();
    ctx.closePath();

    ctx.font = 'normal 14px serif';

    // Ox

    for (let i = 0; i < xValues.length; i++) {
        const shiftY = 30;
        const textX = x0 + i * scaleX + scaleX / 2;
        const textY = h2 - shiftY;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.save();
        ctx.translate(textX, textY);
        if (windowWidth <= tablBp) {
            ctx.rotate(-Math.PI / 4);
        } else {
            ctx.rotate(-Math.PI / 8);
        }
        if (windowWidth <= tablBp) {
            ctx.fillText(xValues[i].replace('еля', ''), 0, 0);
        } else {
            ctx.fillText(xValues[i], 0, 0);
        }
        ctx.restore();
        ctx.moveTo(x0 + i * scaleX, h2);
    }

    ctx.beginPath();
    for (let i = 0; i <= w2; i += scaleX) {
        let x = x0 + i;
        ctx.moveTo(x, scaleY);
        ctx.lineTo(x, y0);
    }
    ctx.stroke();
    ctx.closePath();

    // Oy

    // Oy - Подписи и сетка
    const yValues = Object.values(data).map(v => parseFloat(v));
    const maxValue = Math.ceil(Math.max(...yValues) * 1.05);
    const minValue = 0;
    const valueRange = maxValue - minValue;
    const pixelPerValue = (y0 - scaleY) / valueRange;
    const stepCount = y0 / scaleY;

    // Рассчитываем шаг для подписей
    const stepValue = maxValue / stepCount;

    ctx.font = 'normal 12px sans-serif';
    ctx.fillStyle = '#2e2e2d';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    // Рисуем подписи
    for (let value = minValue; value <= maxValue + 1; value += stepValue) {
        const yPos = y0 - (value * pixelPerValue);
        // Подписи
        const labelText = Math.round(value).toFixed(2).replace('.', ',') + '%';
        ctx.fillText(labelText, x0 - 10, yPos);
    }

    // линии графика
    const lineColor = firstLineChartColor;  // цвет обводки
    const fillColor = '#ffffff';  // цвет заливки
    const lineWidth = 2;          // толщина обводки
    const fillWidth = lineWidth + 4; // толщина заливки

    for (let i = 0; i < xValues.length - 1; i++) {
        let x1Cord = scaleX * i + paddingLR + scaleX / 2;
        let y1Cord = y0 - (yValues[i] * pixelPerValue);
        let x2Cord = scaleX * (i + 1) + paddingLR + scaleX / 2;
        let y2Cord = y0 - (yValues[i + 1] * pixelPerValue);

        // 1. Рисуем заливку
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = fillWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1Cord, y1Cord);
        ctx.lineTo(x2Cord, y2Cord);
        ctx.stroke();
        ctx.closePath();

        // 2. Рисуем обводку
        ctx.strokeStyle = fillColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1Cord, y1Cord);
        ctx.lineTo(x2Cord, y2Cord);
        ctx.stroke();
        ctx.closePath();
    }

    // точки на графике

    const pointR = 4; //радиус точки
    const pointColor = pointSingleLineChartColor;
    const strokePointColor = pointSingleStrokeLineChartColor;
    const widthPointStroke = 2;

    for (let i = 0; i < xValues.length; i++) {
        let xCord = scaleX * i + paddingLR + scaleX / 2;
        let yCord = y0 - (yValues[i] * pixelPerValue);
        ctx.beginPath();
        ctx.moveTo(xCord, yCord);
        ctx.strokeStyle = strokePointColor;
        ctx.fillStyle = pointColor;
        ctx.lineWidth = widthPointStroke;
        ctx.arc(xCord, yCord, pointR, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    // подписи точек

    ctx.font = 'normal 16px serif';
    ctx.fillStyle = pointSingleStrokeLineChartColor;

    if (windowWidth >= mobBp) {

        for (let i = 0; i < xValues.length; i++) {
            let xCord = scaleX * i + paddingLR + scaleX;
            let yCord = y0 - (yValues[i] * pixelPerValue);
            ctx.moveTo(xCord, yCord - 20);
            ctx.fillText(parseFloat(data[xValues[i]]) + '%', xCord, yCord - 20);
        }

    }
}

let resizeTimeout;

function debouncedResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        renderChart1();
        renderChart2();
        location.reload(true);
    }, 50);
}

window.addEventListener('resize', debouncedResize);