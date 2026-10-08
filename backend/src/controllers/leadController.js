const leads = require("../data/leads.json");

const {
    calculateLeadScore
} = require("../services/leadScoringService");

const getLeads = (req, res) => {
    const {
        search,
        priority,
        industry,
        location
    } = req.query;

    let filteredLeads = leads.map(calculateLeadScore);

    // Search by company name
    if (search) {
        filteredLeads = filteredLeads.filter(lead =>
            lead.companyName
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }

    // Filter by priority
    if (priority) {
        filteredLeads = filteredLeads.filter(lead =>
            lead.priority.toLowerCase() === priority.toLowerCase()
        );
    }

    // Filter by industry
    if (industry) {
        filteredLeads = filteredLeads.filter(lead =>
            lead.industry.toLowerCase() === industry.toLowerCase()
        );
    }

    // Filter by location
    if (location) {
        filteredLeads = filteredLeads.filter(lead =>
            lead.location.toLowerCase() === location.toLowerCase()
        );
    }

    res.json({
        count: filteredLeads.length,
        leads: filteredLeads
    });
};

module.exports = {
    getLeads
};