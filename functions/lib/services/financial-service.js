"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.financialService = void 0;
const admin = require("firebase-admin");
exports.financialService = {
    async updateProfile(profile, userId) {
        // Validate the profile data
        if (!profile.riskTolerance || !profile.investmentGoals) {
            throw new Error('Missing required financial profile fields');
        }
        // Update the user's financial profile in Firestore
        await admin.firestore().collection('users').doc(userId).set({
            financialProfile: profile,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        // Generate investment recommendations based on the profile
        const recommendations = this.generateRecommendations(profile);
        return {
            success: true,
            recommendations,
        };
    },
    generateRecommendations(profile) {
        // Simple recommendation logic based on risk tolerance
        const recommendations = {
            assetAllocation: {},
            suggestedInvestments: [],
            nextSteps: [],
        };
        // Determine asset allocation based on risk tolerance
        switch (profile.riskTolerance) {
            case 'low':
                recommendations.assetAllocation = {
                    stocks: 30,
                    bonds: 50,
                    cash: 15,
                    alternatives: 5,
                };
                recommendations.suggestedInvestments = [
                    'Treasury bonds',
                    'High-quality corporate bonds',
                    'Blue-chip dividend stocks',
                    'Index funds with low volatility',
                ];
                break;
            case 'medium':
                recommendations.assetAllocation = {
                    stocks: 60,
                    bonds: 30,
                    cash: 5,
                    alternatives: 5,
                };
                recommendations.suggestedInvestments = [
                    'S&P 500 index funds',
                    'Balanced mutual funds',
                    'REITs',
                    'Investment-grade bonds',
                ];
                break;
            case 'high':
                recommendations.assetAllocation = {
                    stocks: 80,
                    bonds: 10,
                    cash: 5,
                    alternatives: 5,
                };
                recommendations.suggestedInvestments = [
                    'Growth stocks',
                    'Emerging market funds',
                    'Small-cap funds',
                    'Technology sector ETFs',
                ];
                break;
        }
        // Add next steps based on investment goals
        if (profile.investmentGoals.includes('retirement')) {
            recommendations.nextSteps.push('Set up or maximize contributions to a retirement account');
        }
        if (profile.investmentGoals.includes('shortTerm')) {
            recommendations.nextSteps.push('Establish an emergency fund with 3-6 months of expenses');
        }
        if (profile.investmentGoals.includes('education')) {
            recommendations.nextSteps.push('Consider a 529 plan for education savings');
        }
        return recommendations;
    },
    async getPortfolioData(userId) {
        // In a real implementation, this would fetch actual portfolio data
        // For this demo, we'll return mock data
        return {
            totalValue: 125000,
            assets: [
                { name: 'Stocks', value: 75000, percentage: 60 },
                { name: 'Bonds', value: 37500, percentage: 30 },
                { name: 'Cash', value: 12500, percentage: 10 }
            ],
            performance: {
                oneMonth: 2.3,
                threeMonths: 5.1,
                oneYear: 8.7,
                threeYears: 24.5
            },
            recentTransactions: [
                { date: '2023-03-15', description: 'Dividend Payment', amount: 250.75 },
                { date: '2023-03-01', description: '401(k) Contribution', amount: 500.00 },
                { date: '2023-02-15', description: 'Stock Purchase', amount: -1000.00 }
            ]
        };
    },
    async getMarketData() {
        // In a real implementation, this would fetch actual market data
        // For this demo, we'll return mock data
        return {
            indices: [
                { name: 'S&P 500', value: 4738.23, change: 0.85 },
                { name: 'Dow Jones', value: 37962.41, change: 0.67 },
                { name: 'NASDAQ', value: 14897.52, change: 1.12 }
            ],
            sectors: [
                { name: 'Technology', performance: 1.45 },
                { name: 'Healthcare', performance: 0.78 },
                { name: 'Financials', performance: 0.32 },
                { name: 'Energy', performance: -0.54 }
            ],
            topStocks: [
                { symbol: 'AAPL', name: 'Apple Inc.', price: 178.42, change: 1.23 },
                { symbol: 'MSFT', name: 'Microsoft Corp.', price: 325.76, change: 0.89 },
                { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.89, change: 1.45 }
            ],
            economicData: {
                inflation: 2.9,
                gdpGrowth: 2.1,
                unemployment: 3.7,
                fedRate: 4.75
            }
        };
    },
    async getFinancialNews() {
        // In a real implementation, this would fetch actual news
        // For this demo, we'll return mock data
        return [
            {
                title: 'Fed Signals Interest Rate Plans',
                summary: 'Federal Reserve indicates potential rate cuts later this year.',
                url: '#',
                date: '2023-03-28',
                source: 'Financial Times'
            },
            {
                title: 'Tech Stocks Rally on Earnings Reports',
                summary: 'Major technology companies exceed earnings expectations.',
                url: '#',
                date: '2023-03-27',
                source: 'Wall Street Journal'
            },
            {
                title: 'New Tax Law Changes Coming',
                summary: 'Congress passes bill with significant changes to retirement accounts.',
                url: '#',
                date: '2023-03-26',
                source: 'Bloomberg'
            },
            {
                title: 'Global Markets Respond to Trade Developments',
                summary: 'International markets fluctuate in response to new trade agreements.',
                url: '#',
                date: '2023-03-25',
                source: 'Reuters'
            },
            {
                title: 'Retirement Savings Hit Record Levels',
                summary: 'Average 401(k) balances reach new highs according to industry report.',
                url: '#',
                date: '2023-03-24',
                source: 'CNBC'
            }
        ];
    }
};
//# sourceMappingURL=financial-service.js.map