import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, Title
} from 'chart.js';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer, Area, ComposedChart
} from 'recharts';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

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



const ProjectionPage = () => {
    const location = useLocation();
    const { financialData } = location.state || {};
    const [activePeriod, setActivePeriod] = useState(0);

    // --- ML Projection State ---
    const [mlProjections, setMlProjections] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch ML Data on Mount (for all periods)
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('/api/financial/projection', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setMlProjections(data.projections);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("ML Fetch Failed", err);
                setIsLoading(false);
            });
    }, []);

    // --- Risk-Aware Mode State ---
    const [isRiskMode, setIsRiskMode] = useState(true); // Default to TRUE so user sees it

    // REMOVED: Redundant riskData state and useEffect. 
    // We already have 'mlProjections' from the first fetch which contains all Best/Worst case data.

    // Calculate Risk Totals (Aggregating best/worst case of all stocks)
    const riskTotals = useMemo(() => {
        if (!mlProjections || !financialData || activePeriod < 3) return null;

        let totalBest = 0;
        let totalWorst = 0;

        // 1. Calculate base value (Non-Stock Investments) - Static Growth for 3 years logic
        // (Reusing logic from previous implementation for non-stock items)
        let nonStockInvestments = 0;
        financialData.properties.forEach(p => nonStockInvestments += calculatePropertyValue(p, 3));
        financialData.mutualFunds.forEach(m => nonStockInvestments += calculateMutualFundValue(m, 3));
        financialData.fd.forEach(f => nonStockInvestments += f.principal * Math.pow(1 + f.interestRate / 100, f.years + 3));
        financialData.gold.forEach(g => nonStockInvestments += g.currentValue * Math.pow(1.17, 3));
        financialData.silver.forEach(s => nonStockInvestments += s.currentValue * Math.pow(1.17, 3));
        financialData.postRetirement.forEach(p => nonStockInvestments += p.amount * Math.pow(1.17, 3));

        // 2. Add ML Stock Projections (Best/Worst)
        mlProjections.forEach(item => {
            const periodData = item[activePeriod.toString()] || item['3']; // Fallback/Use active
            // Note: mlProjections structure depends on backend. 
            // Assuming it returns { symbol, 3: {..}, 5: {..}, 10: {..} }

            // Actually, let's just use the loop logic from the render method to be consistent
            if (item[activePeriod]) {
                totalBest += item[activePeriod].bestCase;
                totalWorst += item[activePeriod].worstCase;
            } else if (item['3']) {
                // Fallback if specific year missing (shouldn't happen with new ML)
                totalBest += item['3'].bestCase;
                totalWorst += item['3'].worstCase;
            }
        });

        return {
            best: nonStockInvestments + totalBest,
            worst: nonStockInvestments + totalWorst
        };
    }, [mlProjections, financialData, activePeriod]);


    const projection = useMemo(() => {
        if (!financialData) return null;

        const calculateTotals = (period) => {
            let investments = 0;
            let expenses = 0;

            // 1. ML-Supported Assets (Stocks, Mutual Funds, Gold, Silver)
            // If period is 0, we calculate current value manually.
            // If period > 0, we use the ML response if available.

            if (period === 0) {
                // Current Value Calculation (Standardized)
                const sumAsset = (list) => {
                    if (!list) return;
                    list.forEach(item => {
                        const price = item.currentPrice || item.purchasePrice || item.averagePrice || 0;
                        const qty = item.quantity || 1;
                        investments += price * qty;
                    });
                };
                sumAsset(financialData.stocks);
                sumAsset(financialData.mutualFunds);
                sumAsset(financialData.gold);
                sumAsset(financialData.silver);
            } else {
                // Future Value: Use ML Projections
                // The ML response contains ALL these assets now (Phase 4 Unification)
                if (mlProjections && mlProjections.length > 0) {
                    mlProjections.forEach(proj => {
                        const yearKey = period.toString();
                        // Add Expected Value from ML
                        // FIXED: Backend returns flattened keys ("3", "5", "10") at root level
                        if (proj[yearKey]) {
                            investments += proj[yearKey].expectedValue;
                        } else {
                            // Fallback if specific year missing (shouldn't happen)
                            const baseInvest = proj.params?.mu ? 0 : 0; // Just safety
                        }
                    });
                } else {
                    // Fallback if ML is loading or failed: Use simple growth (but this should be rare now)
                    const simpleGrow = (list) => {
                        if (!list) return;
                        list.forEach(i => {
                            const val = (i.currentPrice || i.purchasePrice || 0) * (i.quantity || 1);
                            investments += val * Math.pow(1.08, period); // Conservative 8% fallback
                        });
                    };
                    simpleGrow(financialData.stocks);
                    simpleGrow(financialData.mutualFunds);
                    simpleGrow(financialData.gold);
                    simpleGrow(financialData.silver);
                }
            }

            // 2. Non-ML Assets (Properties, FDs, Post-Retirement) - Manual Projection
            financialData.properties.forEach(p => investments += calculatePropertyValue(p, period));
            financialData.fd.forEach(f => investments += f.principal * Math.pow(1 + f.interestRate / 100, f.years + period));
            financialData.postRetirement.forEach(p => investments += p.amount * Math.pow(1.06, period)); // Conservative 6%

            // Expenses
            // 1. Social Gatherings (formerly Marriage) - Only if year matches
            let marriageExpenses = 0;
            const projectedYear = new Date().getFullYear() + period;

            financialData.marriage.forEach(item => {
                if (item.startYear === projectedYear) {
                    // Apply 8% inflation from now until event
                    marriageExpenses += item.cost * Math.pow(1.08, period);
                }
            });

            let nonMarriageExpenses = 0;

            // 2. Education - Apply 10% Inflation
            financialData.education.forEach(i => {
                nonMarriageExpenses += i.cost * Math.pow(1.10, period);
            });

            // 3. Bills & Personal - Apply Standard 7% Inflation
            financialData.bills.forEach(i => {
                nonMarriageExpenses += i.cost * Math.pow(1.07, period);
            });
            financialData.personalExpense.forEach(i => {
                nonMarriageExpenses += i.cost * Math.pow(1.07, period);
            });

            // Note: We don't apply another layer of inflation here since we applied it individually above
            let projectedNonMarriageExpenses = nonMarriageExpenses;

            const projectedLoans = financialData.loans.reduce((acc, l) => acc + calculateRemainingLoan(l, period), 0);

            // 4. Insurance - Smart Logic (Term Limits + Inflation)
            const calculateSmartInsurance = (item, yearsOffset) => {
                const currentYear = new Date().getFullYear() + yearsOffset;
                const startYear = item.startYear || new Date().getFullYear(); // Default to now if missing
                const term = item.policyTerm || 99; // Default to life if missing

                // Check if policy is active
                if (currentYear < startYear || currentYear > (startYear + term)) {
                    return 0;
                }

                // Apply Inflation (e.g. Health Insurance increases)
                const inflation = item.inflationRate || 0;
                return item.cost * Math.pow(1 + inflation / 100, yearsOffset);
            };

            const projectedInsurance = financialData.insurance.reduce((acc, i) => acc + calculateSmartInsurance(i, period), 0);

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

            // Format for Recharts: Array of objects
            const data = labels.map((label, i) => {
                const totals = calculateTotals(i);

                // For Year 0, all scenarios are the same (Current Value)
                if (i === 0) {
                    const val = totals.investments - totals.expenses;
                    return { name: `Year ${i}`, MostProbable: val, BestCase: val, WorstCase: val };
                } else {
                    // For Year 1+, calculate variances
                    let varianceBest = 0;
                    let varianceWorst = 0;

                    if (mlProjections) {
                        mlProjections.forEach(item => {
                            const p = item[i.toString()];
                            if (p) {
                                varianceBest += (p.bestCase - p.expectedValue);
                                varianceWorst += (p.worstCase - p.expectedValue);
                            }
                        });
                    }

                    const baseNetWorth = totals.investments - totals.expenses;
                    return {
                        name: `Year ${i}`,
                        MostProbable: baseNetWorth,
                        BestCase: baseNetWorth + varianceBest,
                        WorstCase: baseNetWorth + varianceWorst
                    };
                }
            });
            return data;
        };

        return {
            current, threeYear, fiveYear, tenYear,
            pie: pieData[activePeriod],
            lineData: activePeriod > 0 ? generateLineData(activePeriod) : null,
        };

    }, [financialData, activePeriod, mlProjections]);

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
        animation: {
            duration: 2000,
            easing: 'easeOutQuart',
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: { display: true, position: 'bottom' },
            title: { display: true, text: 'Projected Net Worth Growth' },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
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
                
                /* Risk Toggle */
                .risk-toggle-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 2rem;
                    align-items: center;
                    gap: 12px;
                }
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 34px;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .slider {
                    background-color: var(--accent-gold);
                }
                input:checked + .slider:before {
                    transform: translateX(26px);
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

            {/* Risk Mode Toggle */}
            <div className="risk-toggle-container">
                <span style={{ fontWeight: '600', color: '#555' }}>Show Risk Scenarios (Best/Worst Case)</span>
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={isRiskMode}
                        onChange={() => setIsRiskMode(!isRiskMode)}
                    />
                    <span className="slider"></span>
                </label>
            </div>

            {/* --- Info Banner (Removed as per user request) --- */}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
                <div className="item-list-container" style={{ padding: '1.5rem', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1rem' }}>
                        {activePeriod === 0 ? 'Current' : `${activePeriod}-Year`} Financial Summary
                    </h3>
                    <div style={{ fontSize: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p>
                            Most Probable Value:
                            <strong className="text-profit"> ${projection[activePeriod === 3 ? 'threeYear' : activePeriod === 5 ? 'fiveYear' : activePeriod === 10 ? 'tenYear' : 'current'].investments.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                        </p>

                        {/* Risk Stats (Best/Worst) - Now consistent list items without box */}
                        {isRiskMode && activePeriod >= 3 && riskTotals && (
                            <>
                                {(() => {
                                    let totalBest = 0;
                                    let totalWorst = 0;
                                    mlProjections.forEach(p => {
                                        const d = p[activePeriod.toString()];
                                        if (d) {
                                            totalBest += d.bestCase;
                                            totalWorst += d.worstCase;
                                        }
                                    });
                                    // Add non-stock investments
                                    // We need to fetch the non-stock component from the riskTotals calculation in useMemo 
                                    // But riskTotals returns the FINAL sum (non-stock + stock best/worst)
                                    // So we can just use riskTotals.best and riskTotals.worst directly!

                                    return (
                                        <>
                                            <p>
                                                Best Case: <strong style={{ color: '#198754' }}>${riskTotals.best.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                                            </p>
                                            <p>
                                                Worst Case: <strong style={{ color: '#DC3545' }}>${riskTotals.worst.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                                            </p>
                                        </>
                                    );
                                })()}
                            </>
                        )}

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

                {activePeriod > 0 && projection.lineData && (
                    <div className="item-list-container" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ marginBottom: '1rem' }}>
                            Investment Growth Over {activePeriod} Years
                        </h3>
                        <div style={{ flex: 1, minHeight: '600px', position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={projection.lineData}
                                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="name" stroke="#6C757D" startOffset={100} />
                                    <YAxis
                                        stroke="#6C757D"
                                        tickFormatter={value => {
                                            if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                                            if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
                                            return `$${value}`;
                                        }}
                                    />
                                    <RechartsTooltip
                                        formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                                    />
                                    <RechartsLegend verticalAlign="top" height={36} />

                                    <Line
                                        type="monotone"
                                        dataKey="MostProbable"
                                        name="Most Probable"
                                        stroke="#B6955E"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#B6955E', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6 }}
                                        animationDuration={2500}
                                        animationEasing="ease-in-out"
                                    />
                                    {isRiskMode && (
                                        <>
                                            <Line
                                                type="monotone"
                                                dataKey="BestCase"
                                                name="Best Case"
                                                stroke="#198754"
                                                strokeWidth={2}
                                                strokeDasharray="5 5"
                                                dot={false}
                                                activeDot={{ r: 5 }}
                                                animationDuration={2500}
                                                animationEasing="ease-in-out"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="WorstCase"
                                                name="Worst Case"
                                                stroke="#DC3545"
                                                strokeWidth={2}
                                                strokeDasharray="5 5"
                                                dot={false}
                                                activeDot={{ r: 5 }}
                                                animationDuration={2500}
                                                animationEasing="ease-in-out"
                                            />
                                        </>
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectionPage;

