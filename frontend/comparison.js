/* ============================================================
   Monetrix – Historical Comparison Renderer
   Shows previous months' performance + trends with visual charts.
   ============================================================ */

let comparisonChartInstance = null;

function renderHistory(records) {
    const container = document.getElementById("history-section");
    container.innerHTML = "";

    if (!records || records.length === 0) {
        container.innerHTML = `
            <div class="no-history">
                <p>📊 No past records found. Generate your first analysis to start tracking trends!</p>
            </div>
        `;
        return;
    }

    // Sort by date (newest first)
    const sortedRecords = [...records].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sortedRecords.forEach((rec, index) => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.style.animationDelay = `${index * 0.1}s`;

        const prev = index < sortedRecords.length - 1 ? sortedRecords[index + 1] : null;

        // Calculate trends
        const revTrend = prev ? calculateTrend(rec.analytics.totalRevenue, prev.analytics.totalRevenue) : null;
        const profTrend = prev ? calculateTrend(rec.analytics.netProfit, prev.analytics.netProfit) : null;
        const marginTrend = prev ? calculateTrend(rec.analytics.netMargin, prev.analytics.netMargin) : null;

        div.innerHTML = `
            <div class="history-header">
                <div class="history-month">${rec.periodLabel || 'Period ' + (index + 1)}</div>
                <div class="history-date">${formatDate(rec.createdAt)}</div>
            </div>
            <div class="history-details">
                <div class="history-metric">
                    <span class="metric-label">Revenue:</span>
                    <span class="metric-value">₹${rec.analytics.totalRevenue.toLocaleString()}</span>
                    ${revTrend ? `<span class="trend ${revTrend.type}">${revTrend.symbol} ${revTrend.percentage}%</span>` : ''}
                </div>
                <div class="history-metric">
                    <span class="metric-label">Net Profit:</span>
                    <span class="metric-value ${rec.analytics.netProfit >= 0 ? 'profit' : 'loss'}">₹${rec.analytics.netProfit.toLocaleString()}</span>
                    ${profTrend ? `<span class="trend ${profTrend.type}">${profTrend.symbol} ${profTrend.percentage}%</span>` : ''}
                </div>
                <div class="history-metric">
                    <span class="metric-label">Net Margin:</span>
                    <span class="metric-value">${rec.analytics.netMargin.toFixed(2)}%</span>
                    ${marginTrend ? `<span class="trend ${marginTrend.type}">${marginTrend.symbol} ${marginTrend.percentage}%</span>` : ''}
                </div>
            </div>
        `;

        container.appendChild(div);
    });

    // Render comparison chart if we have at least 2 records
    if (sortedRecords.length >= 2) {
        renderComparisonChart(sortedRecords.slice(0, 5)); // Show last 5 records
    }
}

function calculateTrend(current, previous) {
    if (!previous || previous === 0) return null;

    const change = current - previous;
    const percentage = Math.abs((change / previous) * 100).toFixed(1);

    return {
        type: change >= 0 ? 'trend-up' : 'trend-down',
        symbol: change >= 0 ? '↑' : '↓',
        percentage: percentage,
        value: change
    };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function renderComparisonChart(records) {
    const container = document.getElementById("comparison-charts");
    if (!container) return;

    container.innerHTML = `
        <div class="chart-container">
            <h3 class="chart-title">Revenue & Profit Trend</h3>
            <canvas id="comparisonChart"></canvas>
        </div>
    `;

    // Wait for canvas to be rendered
    setTimeout(() => {
        const ctx = document.getElementById("comparisonChart");
        if (!ctx) return;

        if (comparisonChartInstance) comparisonChartInstance.destroy();

        const labels = records.map(r => r.periodLabel || formatDate(r.createdAt)).reverse();
        const revenues = records.map(r => r.analytics.totalRevenue).reverse();
        const profits = records.map(r => r.analytics.netProfit).reverse();
        const margins = records.map(r => r.analytics.netMargin).reverse();

        comparisonChartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Revenue (₹)",
                        data: revenues,
                        borderColor: '#38bdf8',
                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: "Net Profit (₹)",
                        data: profits,
                        borderColor: '#22c55e',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: "Net Margin (%)",
                        data: margins,
                        borderColor: '#a855f7',
                        backgroundColor: 'rgba(168, 85, 247, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
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
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        titleColor: '#ffffff',
                        bodyColor: '#cbd5e1',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        padding: 12
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            color: '#cbd5e1',
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        ticks: {
                            color: '#cbd5e1',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    },
                    x: {
                        ticks: {
                            color: '#cbd5e1'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    }
                }
            }
        });
    }, 100);
}
