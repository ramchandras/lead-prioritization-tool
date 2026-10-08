function calculateLeadScore(lead) {
    let score = 0;

    // Industry match
    if (lead.industry === "SaaS") {
        score += 25;
    } else if (lead.industry === "Software") {
        score += 20;
    }

    // Location
    if (lead.location === "California") {
        score += 20;
    }

    // Company size
    if (lead.employeeCount >= 100) {
        score += 20;
    } else if (lead.employeeCount >= 50) {
        score += 10;
    }

    // Website
    if (lead.website) {
        score += 15;
    }

    // Contact email
    if (lead.email) {
        score += 10;
    }

    let priority = "LOW";

    if (score >= 80) {
        priority = "HIGH";
    } else if (score >= 60) {
        priority = "MEDIUM";
    }

    return {
        ...lead,
        leadScore: score,
        priority
    };
}

module.exports = {
    calculateLeadScore
};