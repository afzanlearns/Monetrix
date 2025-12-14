/* ============================================================
   Monetrix – AI Insights Renderer
   Displays smart suggestions + warnings created by backend.
   Enhanced with better formatting and animations.
   ============================================================ */

function renderAIInsights(insights) {
    const container = document.getElementById("ai-insights");
    container.innerHTML = "";

    if (!insights || insights.length === 0) {
        container.innerHTML = `
            <div class="insight-item">
                <strong>No insights available.</strong> Generate an analysis first to receive AI-powered recommendations.
            </div>
        `;
        return;
    }

    // Categorize insights
    const positiveInsights = [];
    const warningInsights = [];
    const suggestionInsights = [];

    insights.forEach(text => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('excellent') || lowerText.includes('great') || lowerText.includes('healthy') || lowerText.includes('good')) {
            positiveInsights.push(text);
        } else if (lowerText.includes('high') || lowerText.includes('exceed') || lowerText.includes('low') || lowerText.includes('warning') || lowerText.includes('attention')) {
            warningInsights.push(text);
        } else {
            suggestionInsights.push(text);
        }
    });

    // Render positive insights
    if (positiveInsights.length > 0) {
        const section = document.createElement("div");
        section.className = "insights-section";
        section.innerHTML = `
            <h4 class="insights-section-title">✅ Positive Highlights</h4>
        `;
        container.appendChild(section);

        positiveInsights.forEach((text, index) => {
            const div = document.createElement("div");
            div.className = "insight-item insight-positive";
            div.style.animationDelay = `${index * 0.1}s`;
            div.innerHTML = `<strong>Great news!</strong> ${text}`;
            section.appendChild(div);
        });
    }

    // Render warnings
    if (warningInsights.length > 0) {
        const section = document.createElement("div");
        section.className = "insights-section";
        section.innerHTML = `
            <h4 class="insights-section-title">⚠️ Areas of Concern</h4>
        `;
        container.appendChild(section);

        warningInsights.forEach((text, index) => {
            const div = document.createElement("div");
            div.className = "insight-item insight-warning";
            div.style.animationDelay = `${(positiveInsights.length + index) * 0.1}s`;
            div.innerHTML = `<strong>Attention:</strong> ${text}`;
            section.appendChild(div);
        });
    }

    // Render suggestions
    if (suggestionInsights.length > 0) {
        const section = document.createElement("div");
        section.className = "insights-section";
        section.innerHTML = `
            <h4 class="insights-section-title">💡 Recommendations</h4>
        `;
        container.appendChild(section);

        suggestionInsights.forEach((text, index) => {
            const div = document.createElement("div");
            div.className = "insight-item insight-suggestion";
            div.style.animationDelay = `${(positiveInsights.length + warningInsights.length + index) * 0.1}s`;
            div.innerHTML = `<strong>Suggestion:</strong> ${text}`;
            section.appendChild(div);
        });
    }

    // Add overall performance summary
    const summary = generatePerformanceSummary(insights);
    if (summary) {
        const summaryDiv = document.createElement("div");
        summaryDiv.className = "insight-item insight-summary";
        summaryDiv.innerHTML = `<strong>📊 Overall Assessment:</strong> ${summary}`;
        container.insertBefore(summaryDiv, container.firstChild);
    }
}

function generatePerformanceSummary(insights) {
    if (!insights || insights.length === 0) return null;

    const positiveCount = insights.filter(i => 
        i.toLowerCase().includes('excellent') || 
        i.toLowerCase().includes('great') || 
        i.toLowerCase().includes('healthy')
    ).length;

    const warningCount = insights.filter(i => 
        i.toLowerCase().includes('high') || 
        i.toLowerCase().includes('exceed') || 
        i.toLowerCase().includes('low') || 
        i.toLowerCase().includes('attention')
    ).length;

    if (positiveCount > warningCount) {
        return "Your business is performing well overall. Continue monitoring key metrics and implementing the suggested improvements.";
    } else if (warningCount > positiveCount) {
        return "There are several areas that need attention. Focus on the highlighted concerns to improve your financial health.";
    } else {
        return "Your business shows a balanced performance. Consider implementing the recommendations to optimize further.";
    }
}
