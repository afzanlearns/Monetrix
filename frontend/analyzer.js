/* ============================================================
   MONETRIX ANALYZER ENGINE (Frontend)
   Handles:
   - User authentication check
   - Input collection (comprehensive financial inputs)
   - API request to backend (save + compute)
   - Display of analytics cards
   - Triggering charts, insights, comparison
   - Logout functionality
   ============================================================ */

const API_BASE = "http://localhost:5000";  // Update on deployment

// === Check if user is logged in ===
const token = localStorage.getItem("monetrix_token");
const user = JSON.parse(localStorage.getItem("monetrix_user"));
const isLoggedIn = token && user;

// Handle guest mode vs logged in mode
if (isLoggedIn) {
    // Fill Navbar Profile for logged in users
    document.getElementById("profile-name").textContent = user.name || "User";
    document.getElementById("profile-email").textContent = user.email || "user@example.com";
    document.getElementById("profile-initial").textContent = (user.name || "U").charAt(0).toUpperCase();
    document.getElementById("logout-btn").style.display = "flex";
    // Hide guest banner
    document.getElementById("guest-banner").style.display = "none";
} else {
    // Guest mode - show sign in button instead
    const profileSection = document.querySelector(".profile-section");
    if (profileSection) {
        profileSection.innerHTML = `
            <a href="index.html#home" class="cta-btn-guest">
                <span>Sign In</span>
            </a>
        `;
    }
    // Show guest banner
    document.getElementById("guest-banner").style.display = "block";
}

// =============================
// Logout Handler
// =============================
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("monetrix_token");
            localStorage.removeItem("monetrix_user");
            window.location.href = "index.html";
        }
    });
}

// =============================
// Collect Inputs (Comprehensive)
// =============================
function getInputs() {
    return {
        businessName: document.getElementById("businessName").value,
        periodLabel: document.getElementById("periodLabel").value,

        // Revenue
        totalRevenue: Number(document.getElementById("totalRevenue").value) || 0,
        otherIncome: Number(document.getElementById("otherIncome").value) || 0,

        // COGS
        openingStock: Number(document.getElementById("openingStock").value) || 0,
        purchases: Number(document.getElementById("purchases").value) || 0,
        closingStock: Number(document.getElementById("closingStock").value) || 0,
        directLabor: Number(document.getElementById("directLabor").value) || 0,

        // Operating expenses
        rent: Number(document.getElementById("rent").value) || 0,
        salaries: Number(document.getElementById("salaries").value) || 0,
        utilities: Number(document.getElementById("utilities").value) || 0,
        marketing: Number(document.getElementById("marketing").value) || 0,
        adminExpenses: Number(document.getElementById("adminExpenses").value) || 0,
        depreciation: Number(document.getElementById("depreciation").value) || 0,
        insurance: Number(document.getElementById("insurance").value) || 0,
        professionalFees: Number(document.getElementById("professionalFees").value) || 0,

        // Financial charges
        interest: Number(document.getElementById("interest").value) || 0,
        taxRate: Number(document.getElementById("taxRate").value) || 0
    };
}

// =============================
// Render Analytics Cards
// =============================
function renderAnalytics(analytics) {
    const container = document.getElementById("analytics-cards");
    container.innerHTML = "";

    const cards = [
        {
            title: "Total Revenue",
            value: `₹${analytics.totalRevenue.toLocaleString()}`,
            icon: "💰"
        },
        {
            title: "Cost of Goods Sold",
            value: `₹${analytics.cogs.toLocaleString()}`,
            icon: "📦"
        },
        {
            title: "Gross Profit",
            value: `₹${(analytics.totalRevenue - analytics.cogs).toLocaleString()}`,
            icon: "📈"
        },
        {
            title: "Total Expenses",
            value: `₹${analytics.totalExpenses.toLocaleString()}`,
            icon: "💼"
        },
        {
            title: "Net Profit",
            value: `₹${analytics.netProfit.toLocaleString()}`,
            tag: analytics.netProfit >= 0 ? "Profit" : "Loss",
            icon: analytics.netProfit >= 0 ? "✅" : "⚠️"
        },
        {
            title: "Net Margin",
            value: `${analytics.netMargin.toFixed(2)}%`,
            icon: "📊"
        },
        {
            title: "Profit Quality Index",
            value: analytics.pqi || "N/A",
            icon: "⭐"
        },
        {
            title: "Expense Health Score",
            value: `${analytics.expenseScore || 0}/100`,
            icon: "💚"
        }
    ];

    cards.forEach((c, index) => {
        const card = document.createElement("div");
        card.className = "analytics-card";
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="analytics-title">${c.icon} ${c.title}</div>
            <div class="analytics-value">${c.value}</div>
            ${
                c.tag
                    ? `<div class="analytics-tag ${c.tag === "Profit" ? "tag-profit" : "tag-loss"}">${c.tag}</div>`
                    : ""
            }
        `;
        container.appendChild(card);
    });

    // Show analytics section
    document.getElementById("analytics-section").style.display = "block";
}

// =============================
// Generate Analysis Handler
// =============================
document.getElementById("generate-analysis").addEventListener("click", async () => {
    const inputs = getInputs();

    if (!inputs.businessName || !inputs.periodLabel) {
        alert("Please enter Business Name and Period Label.");
        return;
    }

    const generateBtn = document.getElementById("generate-analysis");
    const originalText = generateBtn.innerHTML;
    generateBtn.innerHTML = '<span class="btn-icon">⏳</span> Generating...';
    generateBtn.disabled = true;

    try {
        let data;
        
        if (isLoggedIn) {
            // Logged in - save to backend
            const res = await fetch(`${API_BASE}/analysis/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(inputs),
            });

            data = await res.json();

            if (!res.ok) {
                alert(data.message || "Error during analysis.");
                generateBtn.innerHTML = originalText;
                generateBtn.disabled = false;
                return;
            }
        } else {
            // Guest mode - calculate locally without saving
            data = calculateAnalyticsLocally(inputs);
        }

        // Render analytics in UI
        renderAnalytics(data.analytics);

        // Trigger charts
        if (typeof renderRevenueVsExpenses === 'function') {
            renderRevenueVsExpenses(data.analytics);
        }
        if (typeof renderExpenseBreakdown === 'function') {
            renderExpenseBreakdown(data.analytics);
        }
        if (typeof renderMarginChart === 'function') {
            renderMarginChart(data.analytics);
        }
        if (typeof renderRevenueChart === 'function') {
            renderRevenueChart(data.analytics);
        }

        // Show charts section
        document.getElementById("charts-section").style.display = "block";

        // Fill AI insights
        if (typeof renderAIInsights === 'function') {
            renderAIInsights(data.insights);
            document.getElementById("ai-section").style.display = "block";
        }

        // Fill historical comparison (only if logged in)
        if (isLoggedIn) {
            loadHistory();
        } else {
            // Hide comparison section for guests
            document.getElementById("comparison-section").style.display = "none";
        }

        generateBtn.innerHTML = '<span class="btn-icon">✅</span> Analysis Complete!';
        setTimeout(() => {
            generateBtn.innerHTML = originalText;
            generateBtn.disabled = false;
        }, 2000);

        // Scroll to results
        document.getElementById("analytics-section").scrollIntoView({ behavior: "smooth", block: "start" });

    } catch (err) {
        console.error(err);
        alert("Server error. Please try again.");
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
    }
});

// =============================
// Calculate Analytics Locally (for guest mode)
// =============================
function calculateAnalyticsLocally(inputs) {
    const totalRevenue = (inputs.totalRevenue || 0) + (inputs.otherIncome || 0);
    const cogs = (inputs.openingStock || 0) + (inputs.purchases || 0) + (inputs.directLabor || 0) - (inputs.closingStock || 0);
    const totalExpenses = (inputs.rent || 0) + (inputs.salaries || 0) + (inputs.utilities || 0) + 
                         (inputs.marketing || 0) + (inputs.adminExpenses || 0) + (inputs.depreciation || 0) + 
                         (inputs.insurance || 0) + (inputs.professionalFees || 0) + (inputs.interest || 0);
    const grossProfit = totalRevenue - cogs;
    const netProfit = grossProfit - totalExpenses;
    const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const analytics = {
        totalRevenue,
        cogs,
        grossProfit,
        totalExpenses,
        netProfit,
        netMargin,
        expenses: {
            rent: inputs.rent || 0,
            salaries: inputs.salaries || 0,
            utilities: inputs.utilities || 0,
            marketing: inputs.marketing || 0,
            adminExpenses: inputs.adminExpenses || 0,
            depreciation: inputs.depreciation || 0,
            insurance: inputs.insurance || 0,
            professionalFees: inputs.professionalFees || 0,
            interest: inputs.interest || 0
        }
    };

    // Generate insights locally
    const insights = generateLocalInsights(analytics, inputs);

    return { analytics, insights };
}

function generateLocalInsights(analytics, inputs) {
    const insights = [];
    const netMargin = analytics.netMargin;
    const expenseRatio = analytics.totalRevenue > 0 ? analytics.totalExpenses / analytics.totalRevenue : 1;

    if (netMargin > 20) {
        insights.push("Excellent! Your profit margin exceeds 20%, indicating very healthy profitability.");
    } else if (netMargin > 10) {
        insights.push("Great performance! Your profit margin is above 10%, showing strong financial health.");
    } else if (netMargin > 0) {
        insights.push("Your profitability is positive. Consider optimizing expenses to improve margins.");
    } else {
        insights.push("Warning: Your business is operating at a loss. Review expenses and revenue streams.");
    }

    if (expenseRatio <= 0.50) {
        insights.push("Outstanding expense management! Your expenses are well-controlled relative to revenue.");
    } else if (expenseRatio > 0.80) {
        insights.push("Expenses are high relative to revenue. Focus on cost reduction strategies.");
    }

    return insights;
}

// =============================
// JSON Download
// =============================
document.getElementById("download-json").addEventListener("click", async () => {
    try {
        let data;
        
        if (isLoggedIn) {
            const res = await fetch(`${API_BASE}/analysis/latest`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) {
                alert("No analysis data available. Please generate an analysis first.");
                return;
            }

            data = await res.json();
        } else {
            // Guest mode - get current inputs and calculate
            const inputs = getInputs();
            if (!inputs.businessName || !inputs.periodLabel) {
                alert("Please generate an analysis first.");
                return;
            }
            const result = calculateAnalyticsLocally(inputs);
            data = {
                businessName: inputs.businessName,
                periodLabel: inputs.periodLabel,
                inputs: inputs,
                analytics: result.analytics,
                insights: result.insights
            };
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json"
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `monetrix-analysis-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

    } catch (err) {
        alert("Could not download JSON.");
        console.error(err);
    }
});

// =============================
// PDF Download
// =============================
document.getElementById("download-pdf").addEventListener("click", async () => {
    try {
        let data;
        
        if (isLoggedIn) {
            const res = await fetch(`${API_BASE}/analysis/latest`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) {
                alert("No analysis data available. Please generate an analysis first.");
                return;
            }

            data = await res.json();

            // Call PDF generation endpoint
            const pdfRes = await fetch(`${API_BASE}/analysis/pdf`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (pdfRes.ok) {
                const blob = await pdfRes.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `monetrix-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
                a.click();
                URL.revokeObjectURL(url);
                return;
            }
        } else {
            // Guest mode - get current inputs and calculate
            const inputs = getInputs();
            if (!inputs.businessName || !inputs.periodLabel) {
                alert("Please generate an analysis first.");
                return;
            }
            const result = calculateAnalyticsLocally(inputs);
            data = {
                businessName: inputs.businessName,
                periodLabel: inputs.periodLabel,
                inputs: inputs,
                analytics: result.analytics,
                insights: result.insights
            };
        }

        // Fallback: Use browser print
        alert("Opening print dialog. You can save as PDF from there.");
        window.print();

    } catch (err) {
        console.error("PDF generation error:", err);
        alert("Opening print dialog as fallback. You can save as PDF from there.");
        window.print();
    }
});

// =============================
// Load Historical Comparison
// =============================
async function loadHistory() {
    try {
        const res = await fetch(`${API_BASE}/analysis/history`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            return;
        }

        const data = await res.json();
        
        if (typeof renderHistory === 'function') {
            renderHistory(data.records);
            if (data.records && data.records.length > 0) {
                document.getElementById("comparison-section").style.display = "block";
            }
        }

    } catch (err) {
        console.error("Error loading history:", err);
    }
}

// Load on page load (only if logged in)
if (isLoggedIn) {
    loadHistory();
} else {
    // Hide comparison section for guests
    document.getElementById("comparison-section").style.display = "none";
}
