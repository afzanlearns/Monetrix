/* ============================================================
   Monetrix Charts Engine
   Uses Chart.js to render:
   - Revenue vs Expenses vs Profit chart
   - Expense Breakdown donut chart
   - Profit Margin Trend chart
   - Revenue Composition chart
   ============================================================ */

let revExpChartInstance = null;
let expenseBreakdownInstance = null;
let marginChartInstance = null;
let revenueChartInstance = null;

const chartColors = {
    primary: 'rgba(139, 92, 246, 0.7)',
    secondary: 'rgba(192, 132, 252, 0.7)',
    danger: 'rgba(236, 72, 153, 0.7)',
    warning: 'rgba(168, 85, 247, 0.7)',
    purple: 'rgba(139, 92, 246, 0.7)',
    pink: 'rgba(236, 72, 153, 0.7)',
    cyan: 'rgba(79, 172, 254, 0.7)'
};

const chartBorderColors = {
    primary: '#8b5cf6',
    secondary: '#c084fc',
    danger: '#ec4899',
    warning: '#a855f7',
    purple: '#8b5cf6',
    pink: '#ec4899',
    cyan: '#4facfe'
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            labels: {
                color: '#cbd5e1',
                font: {
                    family: 'Poppins',
                    size: 12
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(26, 15, 46, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#c4b5fd',
            borderColor: 'rgba(168, 85, 247, 0.3)',
            borderWidth: 1,
            padding: 12,
            displayColors: true
        }
    },
    scales: {
        y: {
            ticks: {
                color: '#cbd5e1',
                font: {
                    family: 'Poppins'
                }
            },
            grid: {
                color: 'rgba(168, 85, 247, 0.1)'
            },
            beginAtZero: true
        },
        x: {
            ticks: {
                color: '#cbd5e1',
                font: {
                    family: 'Poppins'
                }
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.05)'
            }
        }
    }
};

/* =============================
   Revenue vs Expenses Bar Chart
   ============================= */
function renderRevenueVsExpenses(analytics) {
    const ctx = document.getElementById("revExpChart");

    if (!ctx) return;

    // Destroy previous chart
    if (revExpChartInstance) revExpChartInstance.destroy();

    revExpChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Revenue", "COGS", "Expenses", "Net Profit"],
            datasets: [{
                label: "Amount (₹)",
                data: [
                    analytics.totalRevenue,
                    analytics.cogs,
                    analytics.totalExpenses,
                    analytics.netProfit
                ],
                backgroundColor: [
                    chartColors.primary,
                    chartColors.danger,
                    chartColors.warning,
                    analytics.netProfit >= 0 ? chartColors.secondary : chartColors.danger
                ],
                borderColor: [
                    chartBorderColors.primary,
                    chartBorderColors.danger,
                    chartBorderColors.warning,
                    analytics.netProfit >= 0 ? chartBorderColors.secondary : chartBorderColors.danger
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            ...chartOptions,
            plugins: {
                ...chartOptions.plugins,
                legend: { display: false }
            }
        }
    });
}

/* =============================
   Expense Breakdown Donut Chart
   ============================= */
function renderExpenseBreakdown(analytics) {
    const ctx = document.getElementById("expenseBreakdown");

    if (!ctx) return;

    if (expenseBreakdownInstance) expenseBreakdownInstance.destroy();

    const expenseData = [
        analytics.expenses.rent || 0,
        analytics.expenses.salaries || 0,
        analytics.expenses.utilities || 0,
        analytics.expenses.marketing || 0,
        analytics.expenses.adminExpenses || 0,
        analytics.expenses.interest || 0
    ];

    expenseBreakdownInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Rent", "Salaries", "Utilities", "Marketing", "Admin", "Interest"],
            datasets: [{
                data: expenseData,
                backgroundColor: [
                    chartColors.danger,
                    chartColors.primary,
                    chartColors.warning,
                    chartColors.purple,
                    chartColors.secondary,
                    chartColors.pink
                ],
                borderColor: [
                    chartBorderColors.danger,
                    chartBorderColors.primary,
                    chartBorderColors.warning,
                    chartBorderColors.purple,
                    chartBorderColors.secondary,
                    chartBorderColors.pink
                ],
                borderWidth: 2,
                hoverOffset: 15
            }]
        },
        options: {
            ...chartOptions,
            cutout: '60%'
        }
    });
}

/* =============================
   Profit Margin Trend Chart
   ============================= */
function renderMarginChart(analytics) {
    const ctx = document.getElementById("marginChart");

    if (!ctx) return;

    if (marginChartInstance) marginChartInstance.destroy();

    const grossMargin = ((analytics.totalRevenue - analytics.cogs) / analytics.totalRevenue) * 100;
    const netMargin = analytics.netMargin;

    marginChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Gross Margin", "Net Margin"],
            datasets: [{
                label: "Margin (%)",
                data: [grossMargin, netMargin],
                borderColor: chartBorderColors.secondary,
                backgroundColor: chartColors.secondary,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: chartBorderColors.secondary,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            }]
        },
        options: {
            ...chartOptions,
            plugins: {
                ...chartOptions.plugins,
                legend: { display: true }
            },
            scales: {
                ...chartOptions.scales,
                y: {
                    ...chartOptions.scales.y,
                    max: 100,
                    ticks: {
                        ...chartOptions.scales.y.ticks,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

/* =============================
   Revenue Composition Chart
   ============================= */
function renderRevenueChart(analytics) {
    const ctx = document.getElementById("revenueChart");

    if (!ctx) return;

    if (revenueChartInstance) revenueChartInstance.destroy();

    const totalRevenue = analytics.totalRevenue;
    const otherIncome = analytics.totalRevenue - (analytics.totalRevenue - (analytics.otherIncome || 0));
    const mainRevenue = totalRevenue - (analytics.otherIncome || 0);

    revenueChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Main Revenue", "Other Income"],
            datasets: [{
                data: [mainRevenue, analytics.otherIncome || 0],
                backgroundColor: [
                    chartColors.primary,
                    chartColors.purple
                ],
                borderColor: [
                    chartBorderColors.primary,
                    chartBorderColors.purple
                ],
                borderWidth: 2,
                hoverOffset: 12
            }]
        },
        options: {
            ...chartOptions
        }
    });
}
