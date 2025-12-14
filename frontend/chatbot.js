/* ============================================================
   Monetrix – Financial Terms Chatbot
   Provides explanations for financial terms and concepts.
   ============================================================ */

const chatbotButton = document.getElementById("chatbot-open");
const chatbotWindow = document.getElementById("chatbot-window");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotSend = document.getElementById("chatbot-send");
const chatbotBody = document.getElementById("chatbot-body");

// Financial terms database
const financialTerms = {
    "cogs": {
        term: "COGS (Cost of Goods Sold)",
        definition: "The direct costs attributable to the production of goods sold by a company. This includes material costs, direct labor, and manufacturing overhead.",
        formula: "COGS = Opening Stock + Purchases + Direct Labor - Closing Stock",
        example: "If you start with ₹10,000 in stock, buy ₹50,000 worth of goods, pay ₹5,000 in labor, and end with ₹8,000 in stock, your COGS is ₹57,000."
    },
    "cost of goods sold": {
        term: "COGS (Cost of Goods Sold)",
        definition: "The direct costs attributable to the production of goods sold by a company. This includes material costs, direct labor, and manufacturing overhead.",
        formula: "COGS = Opening Stock + Purchases + Direct Labor - Closing Stock",
        example: "If you start with ₹10,000 in stock, buy ₹50,000 worth of goods, pay ₹5,000 in labor, and end with ₹8,000 in stock, your COGS is ₹57,000."
    },
    "gross profit": {
        term: "Gross Profit",
        definition: "The profit a company makes after deducting the costs associated with making and selling its products, or the costs associated with providing its services.",
        formula: "Gross Profit = Total Revenue - COGS",
        example: "If your revenue is ₹100,000 and COGS is ₹60,000, your gross profit is ₹40,000."
    },
    "net profit": {
        term: "Net Profit",
        definition: "The amount of money left after all expenses, including operating expenses, interest, and taxes, have been deducted from total revenue.",
        formula: "Net Profit = Total Revenue - COGS - Operating Expenses - Interest - Taxes",
        example: "If your revenue is ₹100,000, COGS is ₹50,000, expenses are ₹30,000, and taxes are ₹5,000, your net profit is ₹15,000."
    },
    "net margin": {
        term: "Net Margin",
        definition: "A profitability ratio that shows what percentage of revenue is converted into net profit. It indicates how efficiently a company is managing its costs.",
        formula: "Net Margin = (Net Profit / Total Revenue) × 100",
        example: "If your net profit is ₹20,000 and revenue is ₹100,000, your net margin is 20%."
    },
    "profit margin": {
        term: "Profit Margin",
        definition: "A measure of profitability calculated as net income divided by revenue. It shows how much profit is generated per rupee of revenue.",
        formula: "Profit Margin = (Net Profit / Revenue) × 100",
        example: "A 15% profit margin means you earn ₹15 profit for every ₹100 in revenue."
    },
    "revenue": {
        term: "Revenue",
        definition: "The total amount of money generated from the sale of goods or services before any expenses are deducted. Also called 'sales' or 'income'.",
        formula: "Revenue = Price × Quantity Sold",
        example: "If you sell 100 products at ₹1,000 each, your revenue is ₹100,000."
    },
    "expenses": {
        term: "Operating Expenses",
        definition: "Costs incurred in the normal course of business operations, such as rent, salaries, utilities, marketing, and administrative costs.",
        formula: "Total Expenses = Sum of all operating expenses",
        example: "Rent (₹10,000) + Salaries (₹30,000) + Utilities (₹5,000) = ₹45,000 in total expenses."
    },
    "depreciation": {
        term: "Depreciation",
        definition: "The allocation of the cost of a tangible asset over its useful life. It represents how much of an asset's value has been used up.",
        formula: "Annual Depreciation = (Asset Cost - Salvage Value) / Useful Life",
        example: "A ₹100,000 machine with a 10-year life depreciates ₹10,000 per year."
    },
    "amortization": {
        term: "Amortization",
        definition: "The process of spreading out a loan or intangible asset cost over a period of time. Similar to depreciation but for intangible assets.",
        example: "A ₹50,000 patent over 5 years amortizes ₹10,000 per year."
    },
    "ebitda": {
        term: "EBITDA",
        definition: "Earnings Before Interest, Taxes, Depreciation, and Amortization. A measure of a company's operating performance.",
        formula: "EBITDA = Net Profit + Interest + Taxes + Depreciation + Amortization",
        example: "Used to compare profitability between companies without the effects of financing and accounting decisions."
    },
    "working capital": {
        term: "Working Capital",
        definition: "The difference between a company's current assets and current liabilities. It indicates the company's short-term financial health.",
        formula: "Working Capital = Current Assets - Current Liabilities",
        example: "If you have ₹100,000 in assets and ₹60,000 in liabilities, your working capital is ₹40,000."
    },
    "cash flow": {
        term: "Cash Flow",
        definition: "The net amount of cash and cash equivalents moving in and out of a business. Positive cash flow indicates more money coming in than going out.",
        example: "If you receive ₹50,000 and pay out ₹30,000, your cash flow is ₹20,000 positive."
    },
    "break even": {
        term: "Break-Even Point",
        definition: "The point at which total revenue equals total costs. At this point, the business is neither making a profit nor a loss.",
        formula: "Break-Even Point = Fixed Costs / (Price - Variable Cost per Unit)",
        example: "If fixed costs are ₹20,000 and profit per unit is ₹100, you need to sell 200 units to break even."
    },
    "roi": {
        term: "ROI (Return on Investment)",
        definition: "A performance measure used to evaluate the efficiency of an investment. It shows the return relative to the investment cost.",
        formula: "ROI = (Net Profit / Investment Cost) × 100",
        example: "If you invest ₹10,000 and earn ₹2,000 profit, your ROI is 20%."
    },
    "return on investment": {
        term: "ROI (Return on Investment)",
        definition: "A performance measure used to evaluate the efficiency of an investment. It shows the return relative to the investment cost.",
        formula: "ROI = (Net Profit / Investment Cost) × 100",
        example: "If you invest ₹10,000 and earn ₹2,000 profit, your ROI is 20%."
    }
};

// Open chatbot
chatbotButton.addEventListener("click", () => {
    chatbotWindow.classList.add("active");
    chatbotInput.focus();
});

// Close chatbot
chatbotClose.addEventListener("click", () => {
    chatbotWindow.classList.remove("active");
});

// Send message on button click
chatbotSend.addEventListener("click", sendMessage);

// Send message on Enter key
chatbotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    const query = chatbotInput.value.trim().toLowerCase();
    
    if (!query) return;

    // Add user message
    addMessage(query, "user");

    // Clear input
    chatbotInput.value = "";

    // Process query
    setTimeout(() => {
        const response = getResponse(query);
        addMessage(response, "bot");
    }, 500);
}

function addMessage(text, type) {
    const messageDiv = document.createElement("div");
    messageDiv.className = type === "user" ? "user-msg" : "bot-msg";

    if (type === "bot") {
        messageDiv.innerHTML = `
            <div class="msg-avatar">🤖</div>
            <div class="msg-content">${text}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="msg-avatar">👤</div>
            <div class="msg-content">${text}</div>
        `;
    }

    chatbotBody.appendChild(messageDiv);
    
    // Scroll to bottom smoothly
    setTimeout(() => {
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }, 0);
}

function getResponse(query) {
    // Check for exact term matches
    for (const [key, value] of Object.entries(financialTerms)) {
        if (query.includes(key)) {
            return formatTermResponse(value);
        }
    }

    // Check for partial matches
    const matchedTerm = findPartialMatch(query);
    if (matchedTerm) {
        return formatTermResponse(matchedTerm);
    }

    // Default responses
    if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
        return "Hello! I'm here to help you understand financial terms. Ask me about COGS, Gross Profit, Net Margin, Depreciation, or any other financial concept!";
    }

    if (query.includes("help") || query.includes("what can you")) {
        return "I can explain financial terms like COGS, Revenue, Net Profit, Profit Margin, Depreciation, EBITDA, Working Capital, Cash Flow, Break-Even Point, ROI, and more! Just ask me about any term.";
    }

    if (query.includes("thank")) {
        return "You're welcome! Feel free to ask me anything else about financial terms.";
    }

    return `I'm not sure about "${query}". Try asking me about specific financial terms like:<br><br>• COGS (Cost of Goods Sold)<br>• Gross Profit<br>• Net Profit<br>• Profit Margin<br>• Depreciation<br>• Revenue<br>• Expenses<br><br>Or type "help" for more options!`;
}

function findPartialMatch(query) {
    for (const [key, value] of Object.entries(financialTerms)) {
        const keywords = key.split(" ");
        if (keywords.some(kw => query.includes(kw))) {
            return value;
        }
    }
    return null;
}

function formatTermResponse(termData) {
    return `
        <strong>${termData.term}</strong><br><br>
        <strong>Definition:</strong> ${termData.definition}<br><br>
        ${termData.formula ? `<strong>Formula:</strong> ${termData.formula}<br><br>` : ''}
        <strong>Example:</strong> ${termData.example}
    `;
}

