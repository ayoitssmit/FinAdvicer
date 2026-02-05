import React, { useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale, PointElement, LineElement, Title, Filler
} from 'chart.js';

ChartJS.register(
    ArcElement, Tooltip, Legend, CategoryScale, LinearScale,
    PointElement, LineElement, Title, Filler
);

// --- Calculation Helpers ---
const calculatePropertyValue = (item, yearsOffset = 0) => {
    if (!item.purchaseDate || !item.growthRate) return item.purchasePrice;
    const purchaseDate = new Date(item.purchaseDate);
    const years = ((new Date() - purchaseDate) / (1000 * 60 * 60 * 24 * 365.25)) + yearsOffset;
    return item.purchasePrice * Math.pow(1 + item.growthRate / 100, years);
};
const calculateMutualFundValue = (item, yearsOffset = 0) => {
    if (!item.startDate || !item.invested || !item.recurringMonths) return 0;
    const startDate = new Date(item.startDate);
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + yearsOffset);
    const totalMonths = Math.floor((futureDate - startDate) / (1000 * 60 * 60 * 24 * 30.44));
    if (totalMonths < 0) return 0;
    const numberOfInvestments = Math.floor(totalMonths / item.recurringMonths) + 1;
    const rate = item.isCompounded ? item.compoundRate : 12.5;
    const monthlyRate = rate / 12 / 100;
    let futureValue = 0;
    for (let i = 0; i < numberOfInvestments; i++) {
        const monthsRemaining = totalMonths - (i * item.recurringMonths);
        if (monthsRemaining >= 0) {
            futureValue += item.invested * Math.pow(1 + monthlyRate, monthsRemaining);
        }
    }
    return futureValue;
};
const calculateRemainingLoan = (item, yearsOffset = 0) => {
    if (!item.startYear || !item.cost) return 0;
    const yearsPassed = (new Date().getFullYear() + yearsOffset) - item.startYear;
    if (yearsPassed <= 0) return item.cost;
    return item.cost * Math.pow(1 - 0.05, yearsPassed);
};
const calculateInsuranceTotal = (item, yearsOffset = 0) => {
    if (!item.startYear || !item.cost) return 0;
    const yearsPassed = (new Date().getFullYear() + yearsOffset) - item.startYear;
    if (yearsPassed < 0) return 0;
    return item.cost * (yearsPassed + 1);
};


const ProjectionPage = () => {
    const location = useLocation();
    const { financialData } = location.state || {};
    const [activePeriod, setActivePeriod] = useState(0);

    const projection = useMemo(() => {
        if (!financialData) return null;

        const calculateTotals = (period) => {
            let investments = 0;
            let expenses = 0;

            // Investments
            financialData.stocks.forEach(s => investments += (s.currentPrice * s.quantity) * Math.pow(1.17, period));
            financialData.properties.forEach(p => investments += calculatePropertyValue(p, period));
            financialData.mutualFunds.forEach(m => investments += calculateMutualFundValue(m, period));
            financialData.fd.forEach(f => investments += f.principal * Math.pow(1 + f.interestRate / 100, f.years + period));
            financialData.gold.forEach(g => investments += g.currentValue * Math.pow(1.17, period));
            financialData.silver.forEach(s => investments += s.currentValue * Math.pow(1.17, period));
            financialData.postRetirement.forEach(p => investments += p.amount * Math.pow(1.17, period));

            // Expenses
            const marriageExpenses = financialData.marriage.reduce((acc, item) => acc + item.cost, 0);

            let nonMarriageExpenses = 0;
            financialData.education.forEach(i => nonMarriageExpenses += i.cost);
            financialData.bills.forEach(i => nonMarriageExpenses += i.cost);
            financialData.personalExpense.forEach(i => nonMarriageExpenses += i.cost);

            let projectedNonMarriageExpenses = nonMarriageExpenses * Math.pow(1.07, period);

            const projectedLoans = financialData.loans.reduce((acc, l) => acc + calculateRemainingLoan(l, period), 0);
            const projectedInsurance = financialData.insurance.reduce((acc, i) => acc + calculateInsuranceTotal(i, period), 0);

            expenses = marriageExpenses + projectedNonMarriageExpenses + projectedLoans + projectedInsurance;

            return { investments, expenses };
        };

        const current = calculateTotals(0);
        const threeYear = calculateTotals(3);
        const fiveYear = calculateTotals(5);
        const tenYear = calculateTotals(10);

        const pieData = {
            0: { labels: ['Investments', 'Life Events'], datasets: [{ data: [current.investments, current.expenses] }] },
            3: { labels: ['Investments', 'Life Events'], datasets: [{ data: [threeYear.investments, threeYear.expenses] }] },
            5: { labels: ['Investments', 'Life Events'], datasets: [{ data: [fiveYear.investments, fiveYear.expenses] }] },
            10: { labels: ['Investments', 'Life Events'], datasets: [{ data: [tenYear.investments, tenYear.expenses] }] }
        };

        const generateLineData = (period) => {
            const labels = Array.from({ length: period + 1 }, (_, i) => `Year ${i}`);
            const data = labels.map((_, i) => {
                const totals = calculateTotals(i);
                return totals.investments - totals.expenses; // Net Worth
            });
            return { labels, datasets: [{ label: 'Projected Net Worth', data, fill: true }] };
        };

        return {
            current, threeYear, fiveYear, tenYear,
            pie: pieData[activePeriod],
            line: activePeriod > 0 ? generateLineData(activePeriod) : null,
        };

    }, [financialData, activePeriod]);

    if (!financialData) {
        return (
            <div style={{ textAlign: 'center', padding: '5rem' }}>
                <h2>No data available to generate projection.</h2>
                <Link to="/dashboard" style={{ color: 'var(--accent-gold)' }}>Go back to Dashboard</Link>
            </div>
        );
    }

    const pieOptions = {
        responsive: true,
        plugins: { legend: { position: 'top' } },
    };
    const lineOptions = {
        responsive: true,
        plugins: { legend: { display: false }, title: { display: true, text: 'Projected Net Worth Growth' } },
        scales: {
            y: {
                ticks: {
                    callback: value => {
                        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
                        return `$${value}`;
                    }
                }
            }
        }
    };
    const pieDatasetConfig = {
        backgroundColor: ['#B6955E', '#212529', '#6c757d', '#f8f9fa'],
        borderColor: '#ffffff',
        borderWidth: 2,
    };


    return (
        <div style={{ padding: '2rem 3rem', backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
            {/* --- ADDED: Styles for buttons and variables --- */}
            <style>{`
                :root {
                  --background-light: #F8F9FA;
                  --border-color: #DEE2E6;
                  --text-primary: #212529;
                  --text-secondary: #6C757D;
                  --accent-gold: #B6955E;
                  --profit-green: #198754;
                  --loss-red: #DC3545;
                }
                .text-profit { color: var(--profit-green); }
                .text-loss { color: var(--loss-red); }
                .item-list-container {
                  background-color: #FFFFFF;
                  border: 1px solid var(--border-color);
                  border-radius: 8px;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                }
                .sign-out-button {
                    background: none;
                    border: 1px solid var(--border-color);
                    color: var(--text-secondary);
                    padding: 6px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
                .sign-out-button:hover {
                    background-color: var(--accent-gold);
                    color: white;
                    border-color: var(--accent-gold);
                }

                /* --- NEW: Button Group Styles --- */
                .button-group {
                  display: flex;
                  justify-content: center;
                  background-color: #e9ecef;
                  border-radius: 12px;
                  padding: 6px;
                  border: 1px solid var(--border-color);
                  max-width: 900px;
                  margin: 2rem auto;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }

                .category-button {
                  background-color: transparent;
                  border: none;
                  padding: 12px 16px;
                  font-size: 1rem;
                  font-weight: 600;
                  color: var(--text-secondary);
                  cursor: pointer;
                  border-radius: 8px;
                  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                  flex: 1;
                  text-align: center;
                  outline: none;
                  white-space: nowrap;
                }

                .category-button:hover:not(.active) {
                  color: var(--text-primary);
                }

                .category-button.active {
                  background-color: var(--accent-gold);
                  color: white;
                  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                  transform: translateY(-1px);
                }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h1>Projected Growth</h1>
                <Link to="/dashboard" className="sign-out-button" style={{ textDecoration: 'none' }}>Back to Dashboard</Link>
            </div>

            {/* --- UPDATED: Button container --- */}
            <div className="button-group">
                <button onClick={() => setActivePeriod(0)} className={`category-button ${activePeriod === 0 ? 'active' : ''}`}>Current Scenario</button>
                <button onClick={() => setActivePeriod(3)} className={`category-button ${activePeriod === 3 ? 'active' : ''}`}>After 3 Years</button>
                <button onClick={() => setActivePeriod(5)} className={`category-button ${activePeriod === 5 ? 'active' : ''}`}>After 5 Years</button>
                <button onClick={() => setActivePeriod(10)} className={`category-button ${activePeriod === 10 ? 'active' : ''}`}>After 10 Years</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
                <div className="item-list-container" style={{ padding: '1.5rem', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1rem' }}>
                        {activePeriod === 0 ? 'Current' : `${activePeriod}-Year`} Financial Summary
                    </h3>
                    <div style={{ fontSize: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p>
                            Total Investment Value:
                            <strong className="text-profit"> ${projection[activePeriod === 3 ? 'threeYear' : activePeriod === 5 ? 'fiveYear' : activePeriod === 10 ? 'tenYear' : 'current'].investments.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                        </p>
                        <p>
                            Total Life Event Expenses:
                            <strong className="text-loss"> ${projection[activePeriod === 3 ? 'threeYear' : activePeriod === 5 ? 'fiveYear' : activePeriod === 10 ? 'tenYear' : 'current'].expenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                        </p>
                    </div>
                    {/* Flex grow pushes chart to center/bottom space */}
                    <div style={{ flex: 1, minHeight: '300px', width: '100%', marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Pie data={{ ...projection.pie, datasets: [{ ...projection.pie.datasets[0], ...pieDatasetConfig }] }} options={{ ...pieOptions, maintainAspectRatio: false }} />
                    </div>
                </div>

                {activePeriod > 0 && projection.line && (
                    <div className="item-list-container" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ marginBottom: '1rem' }}>
                            Investment Growth Over {activePeriod} Years
                        </h3>
                        <div style={{ flex: 1, minHeight: '350px', position: 'relative' }}>
                            <Line data={{ ...projection.line, datasets: [{ ...projection.line.datasets[0], borderColor: '#B6955E', backgroundColor: 'rgba(182, 149, 94, 0.2)' }] }} options={{ ...lineOptions, maintainAspectRatio: false }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectionPage;

