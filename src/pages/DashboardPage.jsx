import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- CSS Styles as a Component (No changes) ---
const DashboardStyles = () => (
    <style>{`
    /* --- Global Styles & Variables --- */
    :root {
      --background-dark: #FFFFFF;    /* Main background */
      --background-light: #F8F9FA;  /* Sidebar/Card background */
      --border-color: #DEE2E6;      /* Light grey border */
      --text-primary: #212529;      /* Near-black text */
      --text-secondary: #6C757D;     /* Muted grey text */
      --accent-gold: #B6955E;       /* Muted Gold */
      --profit-green: #198754;       /* Green for profit */
      --loss-red: #DC3545;         /* Red for loss */
    }

    /* --- Main Layout --- */
    .dashboard-container {
      display: flex;
      background-color: var(--background-dark);
      color: var(--text-primary);
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
    }

    /* --- Sidebar --- */
    .sidebar {
      width: 20%;
      max-width: 240px;
      background-color: var(--background-light);
      padding: 16px;
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
    }
    
    .sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
    }

    .sidebar-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
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


    .section-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }

    .events-section, .projection-section {
      margin-top: 32px;
    }
    
    .live-update-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }
    
    .live-update-button {
        background-color: var(--accent-gold);
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: background-color 0.2s ease;
    }

    .live-update-button:hover {
        background-color: #a58450;
    }

    .live-update-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .category-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .category-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .category-button {
      width: 100%;
      text-align: left;
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 0.85rem;
      transition: background-color 0.2s ease, color 0.2s ease;
      background-color: transparent;
      border: none;
      color: var(--text-primary);
      cursor: pointer;
    }

    .category-button:hover {
      background-color: #e9ecef;
    }



    .category-button.active {
      background-color: var(--accent-gold);
      color: #FFFFFF;
    }
    
    .add-item-button {
      margin-left: 8px;
      padding: 4px;
      border-radius: 6px;
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .category-item:hover .add-item-button {
      color: var(--text-primary);
    }

    .add-item-button:hover {
      background-color: #e9ecef;
    }

    /* --- Main Content --- */
    .main-content {
      flex: 1;
      padding: 20px;
      position: relative;
    }

    .content-wrapper {
      max-width: 896px;
      margin: 0 auto;
    }

    .item-list-container {
      background-color: var(--background-dark);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }

    .item-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .item-list-entry {
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background-color 0.2s ease;
      border-bottom: 1px solid var(--border-color);
    }

    .item-list-entry:last-child {
      border-bottom: none;
    }

    .item-list-entry:hover {
      background-color: var(--background-light);
    }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1; /* Allow details to take available space */
      margin-right: 16px; /* Space between details and actions */
    }

    .item-name {
      font-weight: 500;
    }

    .item-cost {
      color: var(--text-secondary);
    }

    .item-actions {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .edit-item-button, .remove-item-button {
      color: var(--text-secondary);
      transition: all 0.2s ease;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
    }

    .edit-item-button:hover {
        color: var(--accent-gold);
        background-color: rgba(182, 149, 94, 0.1);
    }

    .remove-item-button:hover {
      color: var(--loss-red);
      background-color: rgba(220, 38, 38, 0.1);
    }
    
    .input-group.checkbox-group {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        justify-content: flex-start;
    }
    
    .input-group.checkbox-group input[type="checkbox"] {
        width: auto;
        margin: 0;
        cursor: pointer;
    }
    
    .input-group.checkbox-group label {
        margin-bottom: 0;
        cursor: pointer;
        font-weight: 500;
    }

    .no-items-message {
      padding: 16px;
      text-align: center;
      color: var(--text-secondary);
    }

    /* --- Footer --- */
    .total-footer {
      position: fixed;
      bottom: 0;
      left: 20%; /* Fallback */
      left: min(20%, 240px); /* Match sidebar width cap */
      right: 0;
      padding: 20px;
      pointer-events: none;
      z-index: 10;
    }

    .total-container {
      max-width: 896px;
      margin: 0 auto;
      background-color: var(--background-dark);
      border: 1px solid var(--border-color);
      padding: 16px;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.125rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      pointer-events: auto;
    }

    .total-label {
      margin-right: 16px;
      color: var(--text-secondary);
      font-weight: 600;
    }

    .total-amount {
      font-weight: bold;
    }

    /* --- Item Modal Styles --- */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background-color: var(--background-dark);
      padding: 24px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      width: 90%;
      max-width: 500px;
      max-height: 85vh;
      overflow-y: auto;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 24px;
    }

    .modal-form .input-group {
      margin-bottom: 16px;
    }

    .modal-form .checkbox-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .modal-form label {
      display: block;
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }

    .modal-form input[type="text"],
    .modal-form input[type="number"],
    .modal-form input[type="date"],
    .modal-form select {
      width: 100%;
      padding: 10px;
      background-color: var(--background-dark);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      color: var(--text-primary);
      font-size: 1rem;
    }

    /* Fix dropdown option colors */
    .modal-form select option {
      background-color: var(--background-dark);
      color: var(--text-primary);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }
    
    .modal-button {
      padding: 10px 20px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-cancel {
      background-color: var(--background-light);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    .btn-save {
      background-color: var(--accent-gold);
      color: white;
    }


    /* --- Helper Classes --- */
    .icon {
      height: 1.25rem;
      width: 1.25rem;
    }

    .text-profit {
      color: var(--profit-green);
    }

    .text-loss {
      color: var(--loss-red);
    }
    
    /* --- Toggle Tabs --- */
    .mode-tabs {
        display: flex;
        background-color: var(--background-dark);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 4px;
        margin-bottom: 20px;
    }
    
    .mode-tab {
        flex: 1;
        text-align: center;
        padding: 8px;
        cursor: pointer;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--text-secondary);
        transition: all 0.2s ease;
    }
    
    .mode-tab.active {
        background-color: var(--accent-gold);
        color: white;
        font-weight: 600;
    }

    /* --- Metric Badges (Phase 8) --- */
    .metric-badge {
        font-size: 0.75rem;
        padding: 2px 6px;
        border-radius: 4px;
        background-color: #e9ecef;
        color: var(--text-secondary);
        margin-right: 4px;
        display: inline-flex;
        align-items: center;
        font-weight: 500;
    }
    .metric-badge.good {
        background-color: rgba(25, 135, 84, 0.1);
        color: var(--profit-green);
        border: 1px solid rgba(25, 135, 84, 0.2);
    }
    .metric-badge.bad {
        background-color: rgba(220, 53, 69, 0.1);
        color: var(--loss-red);
        border: 1px solid rgba(220, 53, 69, 0.2);
    }
  `}</style>
);

// --- Helper Components (SVG Icons) (No changes) ---
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);


// --- Item Modal Component (No changes) ---
const ItemModal = ({ config, onClose, onSave, categories }) => {

    const currentYear = new Date().getFullYear();
    const initialFormState = {
        name: '', cost: 0, quantity: 1, purchasePrice: 0, currentPrice: 0,
        invested: 0, currentValue: 0, principal: 0, interestRate: 0, years: 0, amount: 0,
        startDate: new Date().toISOString().split('T')[0],
        isCompounded: false, compoundRate: 16, recurringMonths: 1,
        purchaseDate: new Date().toISOString().split('T')[0],
        startYear: currentYear,
        loanRate: 5, // Default loan rate
    };

    const [formData, setFormData] = useState(initialFormState);
    const [mfMode, setMfMode] = useState('live'); // 'live' | 'sip'
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        let dataToSet = { ...initialFormState };
        if (config.mode === 'edit' && config.item) {
            dataToSet = { ...dataToSet, ...config.item };
        }
        if (config.mode === 'add' && config.category === 'properties') {
            dataToSet.growthRate = Math.random() * (10 - 5) + 5;
        }
        // Auto-detect mode if editing existing item
        if (config.mode === 'edit' && config.item && config.category === 'mutualFunds') {
            if (config.item.symbol) {
                setMfMode('live');
            } else if (config.item.invested > 0) {
                setMfMode('sip');
            }
        }
        setFormData(dataToSet);
    }, [config]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let val;

        if (type === 'checkbox') {
            val = checked;
        } else if (type === 'number') {
            // Allow empty string to let user clear the field, otherwise parse as float
            val = value === '' ? '' : parseFloat(value);
        } else {
            val = value;
        }

        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation: Prevent mutual funds in stocks section and vice versa
        if (config.category === 'stocks' || (config.category === 'mutualFunds' && mfMode === 'live')) {
            // Determine which field acts as the Ticker Symbol
            // Stocks: The 'name' field IS the ticker (e.g. AAPL)
            // Mutual Funds: The 'symbol' field is the ticker (e.g. VFIAX), 'name' is just a label
            let tickerToValidate = '';

            if (config.category === 'stocks') {
                tickerToValidate = formData.name;
            } else {
                tickerToValidate = formData.symbol;
            }

            // Name is always required for both
            if (!formData.name?.trim()) {
                setValidationError('Please enter a Name');
                return;
            }

            tickerToValidate = tickerToValidate?.toUpperCase().trim();

            if (!tickerToValidate) {
                setValidationError('Please enter a Ticker Symbol');
                return;
            }

            // Heuristic: Mutual funds typically have 5+ characters and often end with X
            // ETFs/Stocks are typically 1-4 characters (SPY, QQQ, AAPL, MSFT)
            const isMutualFundLike = tickerToValidate.length >= 5 && tickerToValidate.endsWith('X');
            const isStockETFLike = tickerToValidate.length <= 4 || !tickerToValidate.endsWith('X');

            if (config.category === 'stocks' && isMutualFundLike) {
                setValidationError(`Not a Stock/ETF. "${tickerToValidate}" appears to be a Mutual Fund. Add it to the Mutual Funds section.`);
                return;
            }

            if (config.category === 'mutualFunds' && isStockETFLike) {
                setValidationError(`Not a Mutual Fund. "${tickerToValidate}" appears to be a Stock/ETF. Add it to the Stocks & ETFs section.`);
                return;
            }
        }

        setValidationError(''); // Clear error on success
        onSave(config.category, { ...config.item, ...formData });
        onClose();
    };

    const renderFields = () => {
        switch (config.category) {
            case 'stocks':
                return <>
                    <div className="input-group"><label>Stock/ETF Symbol (e.g. AAPL, SPY)</label><input type="text" name="name" value={formData.name} onChange={handleChange} /></div>
                    <div className="input-group"><label>Quantity</label><input type="number" name="quantity" value={formData.quantity} onChange={handleChange} /></div>
                    <div className="input-group"><label>Purchase Price ($)</label><input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} /></div>
                </>;
            case 'properties':
                return <>
                    <div className="input-group"><label>Property Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} /></div>
                    <div className="input-group"><label>Purchase Price ($)</label><input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} /></div>
                    <div className="input-group"><label>Purchase Date</label><input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} /></div>
                </>;
            case 'mutualFunds':
                return <>
                    <div className="input-group"><label>Mutual Fund Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} /></div>

                    {/* Mode Toggle */}
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', padding: '10px 0', borderBottom: '1px solid #333' }}>
                        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input
                                type="radio"
                                name="mfMode"
                                value="live"
                                checked={mfMode === 'live'}
                                onChange={() => setMfMode('live')}
                            />
                            Live Tracking (USA Tickers)
                        </label>
                        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input
                                type="radio"
                                name="mfMode"
                                value="sip"
                                checked={mfMode === 'sip'}
                                onChange={() => setMfMode('sip')}
                            />
                            SIP Calculator
                        </label>
                    </div>

                    {mfMode === 'live' ? (
                        <>
                            <div className="input-group"><label>Ticker Symbol (e.g., VTSAX, SWPPX)</label><input type="text" name="symbol" value={formData.symbol || ''} onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))} /></div>
                            <div className="input-group"><label>Total Units / Quantity</label><input type="number" name="quantity" value={formData.quantity} onChange={handleChange} /></div>
                            <div className="input-group"><label>Average Nav / Buy Price ($)</label><input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} /></div>
                        </>
                    ) : (
                        <>
                            <div className="input-group"><label>Recurring Investment Amount ($)</label><input type="number" name="invested" value={formData.invested} onChange={handleChange} /></div>
                            <div className="input-group"><label>Recurring Every (Months)</label><input type="number" name="recurringMonths" value={formData.recurringMonths} onChange={handleChange} /></div>
                            <div className="input-group"><label>Start Date</label><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} /></div>
                            <div className="input-group checkbox-group">
                                <input type="checkbox" id="isCompounded" name="isCompounded" checked={formData.isCompounded} onChange={handleChange} />
                                <label htmlFor="isCompounded">Is it compounded?</label>
                            </div>
                            {formData.isCompounded && (
                                <div className="input-group"><label>Compound Rate (%)</label><input type="number" name="compoundRate" value={formData.compoundRate} onChange={handleChange} /></div>
                            )}
                        </>
                    )}
                </>;
            case 'fd':
                return <>
                    <div className="input-group"><label>FD Name/Bank</label><input type="text" name="name" value={formData.name} onChange={handleChange} /></div>
                    <div className="input-group"><label>Principal ($)</label><input type="number" name="principal" value={formData.principal} onChange={handleChange} /></div>
                    <div className="input-group"><label>Interest Rate (%)</label><input type="number" name="interestRate" value={formData.interestRate} onChange={handleChange} /></div>
                    <div className="input-group"><label>Years</label><input type="number" name="years" value={formData.years} onChange={handleChange} /></div>
                </>;
            case 'gold':
            case 'silver':
                return <>
                    <div className="input-group"><label>Item Name (e.g., Gold Bar, Silver Coin)</label><input type="text" name="name" value={formData.name} onChange={handleChange} /></div>
                    <div className="input-group"><label>Weight (in Ounces/oz)</label><input type="number" name="quantity" value={formData.quantity} onChange={handleChange} /></div>
                    <div className="input-group"><label>Purchase Price ($)</label><input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} /></div>
                </>;
            case 'postRetirement':
                return <>
                    <div className="input-group"><label>Contribution Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} /></div>
                    <div className="input-group"><label>Amount ($)</label><input type="number" name="amount" value={formData.amount} onChange={handleChange} /></div>
                </>;
            case 'loans':
                return <>
                    <div className="input-group"><label>Loan Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} /></div>
                    <div className="input-group"><label>Initial Loan Amount ($)</label><input type="number" name="cost" value={formData.cost} onChange={handleChange} /></div>
                    <div className="input-group"><label>Loan Rate (%)</label><input type="number" name="loanRate" value={formData.loanRate} onChange={handleChange} /></div>
                    <div className="input-group"><label>Start Year</label><input type="number" name="startYear" value={formData.startYear} onChange={handleChange} /></div>
                </>;
            case 'insurance':
                return <>
                    <div className="input-group"><label>Insurance Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} /></div>
                    <div className="input-group"><label>Type</label>
                        <select name="category" value={formData.category || 'General'} onChange={(e) => {
                            const newCat = e.target.value;
                            let newInflation = 0;
                            // US Healthcare Inflation assumption (~7%)
                            if (newCat === 'Health') newInflation = 7;
                            setFormData(prev => ({ ...prev, category: newCat, inflationRate: newInflation }));
                        }}>
                            <option value="General">General / Other</option>
                            <option value="Health">Health Insurance</option>
                            <option value="Term">Term Life Insurance</option>
                            <option value="ULIP">Investment / ULIP</option>
                        </select>
                    </div>
                    <div className="input-group"><label>Yearly Premium ($)</label><input type="number" name="cost" value={formData.cost} onChange={handleChange} /></div>
                    <div className="input-group"><label>Policy Start Year</label><input type="number" name="startYear" value={formData.startYear} onChange={handleChange} /></div>
                    <div className="input-group"><label>Premium Paying Term (Years)</label><input type="number" name="policyTerm" value={formData.policyTerm} onChange={handleChange} /></div>
                </>;
            default:
                return <>
                    <div className="input-group"><label>Expense Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} /></div>
                    <div className="input-group"><label>Cost ($)</label><input type="number" name="cost" value={formData.cost} onChange={handleChange} /></div>
                </>;
        }
    };

    const categoryLabel = [...categories.investment, ...categories.lifeEvents]
        .find(c => c.id === config.category)?.label || '';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="modal-title">{config.mode === 'edit' ? 'Edit' : 'Add New'} {categoryLabel} Item</h2>
                {validationError && (
                    <div style={{
                        color: '#ff4444',
                        backgroundColor: 'rgba(255, 68, 68, 0.1)',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '15px',
                        fontSize: '0.9rem',
                        border: '1px solid rgba(255, 68, 68, 0.3)'
                    }}>
                        {validationError}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="modal-form">
                    {renderFields()}
                    <div className="modal-actions">
                        <button type="button" className="modal-button btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="modal-button btn-save">Save Item</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Calculation Helpers (No changes) ---
const calculatePropertyValue = (item) => {
    if (!item.purchaseDate || !item.growthRate) return item.purchasePrice;
    const purchaseDate = new Date(item.purchaseDate);
    const years = (new Date() - purchaseDate) / (1000 * 60 * 60 * 24 * 365.25);
    return item.purchasePrice * Math.pow(1 + item.growthRate / 100, years);
};

const calculateMutualFundValue = (item) => {
    if (!item.startDate || !item.invested || !item.recurringMonths) return 0;
    const startDate = new Date(item.startDate);
    const totalMonths = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24 * 30.44));
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

const calculateRemainingLoan = (item) => {
    if (!item.startYear || !item.cost) return 0;
    const yearsPassed = new Date().getFullYear() - item.startYear;
    if (yearsPassed <= 0) return item.cost;
    return item.cost * Math.pow(1 - 0.05, yearsPassed);
};

const calculateInsuranceTotal = (item) => {
    if (!item.startYear || !item.cost) return 0;
    const yearsPassed = new Date().getFullYear() - item.startYear;
    if (yearsPassed < 0) return 0;
    return item.cost * (yearsPassed + 1);
};


// --- Data Definitions ---
const categories = {
    investment: [
        { id: 'stocks', label: 'Stocks & ETFs' }, { id: 'properties', label: 'Properties' },
        { id: 'mutualFunds', label: 'Mutual Funds' }, { id: 'fd', label: 'FD (Bank)' },
        { id: 'gold', label: 'Gold' }, { id: 'silver', label: 'Silver' },
        { id: 'postRetirement', label: 'Post-retirement Living' },
    ],
    lifeEvents: [
        { id: 'marriage', label: 'Social Gatherings' }, { id: 'education', label: 'Education' },
        { id: 'bills', label: 'Household Bills' }, { id: 'loans', label: 'Loans' },
        { id: 'personalExpense', label: 'Personal Expense' }, { id: 'insurance', label: 'Insurance' },
    ],
};

// --- Main Dashboard Component ---
export default function DashboardPage() {
    const navigate = useNavigate();

    // --- State Management ---
    const [financialData, setFinancialData] = useState({
        stocks: [], properties: [], mutualFunds: [], fd: [],
        gold: [], silver: [],
        marriage: [], education: [], bills: [], loans: [], personalExpense: [], insurance: [],
        postRetirement: []
    });
    const [activeCategory, setActiveCategory] = useState('stocks');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ mode: 'add', category: null, item: null });
    const [isLoadingPrices, setIsLoadingPrices] = useState(false);

    // --- Fetch Data from API on Mount ---
    useEffect(() => {
        const fetchFinancialData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('/api/financial', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();

                    // Merge fetched data with initial structure to ensure all keys exist
                    setFinancialData(prev => ({
                        ...prev,
                        ...data
                    }));
                } else {
                    console.error('Failed to fetch financial data');
                }
            } catch (error) {
                console.error('Error fetching financial data:', error);
            }
        };

        fetchFinancialData();
    }, []);

    // --- API Integration (Handle Live Prices) ---
    const handleRefreshPrices = async () => {
        setIsLoadingPrices(true);
        try {
            const token = localStorage.getItem('token');
            const priceUpdates = {
                stocks: {},
                gold: null,
                silver: null
            };
            const promises = [];

            // 1. Fetch Stock and Mutual Fund Prices
            // Combine stocks and mutual funds for fetching if they have symbols
            const itemsToFetch = [
                ...(financialData.stocks || []),
                ...(financialData.mutualFunds || []).filter(mf => mf.symbol)
            ];

            const missingFundamentals = [];

            if (itemsToFetch.length > 0) {
                const stockPromises = itemsToFetch.map(item =>
                    fetch(`/api/stocks/${item.symbol || item.name}`, { // Fallback to name if symbol missing (for old stocks)
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                        .then(res => res.ok ? res.json() : Promise.reject())
                        .then(data => {
                            // Store by Symbol if available, else Name
                            const key = item.symbol || item.name;
                            priceUpdates.stocks[key] = { price: data.c, prevClose: data.pc };

                            // Self-Healing: Check if fundamentals are missing for Stocks
                            // If missing, queue a background update
                            if (financialData.stocks.find(s => s.id === item.id) && (!item.peRatio && !item.roe)) {
                                missingFundamentals.push(item);
                            }
                        })
                        .catch((err) => console.error(`Failed to fetch ${item.symbol || item.name}`, err))
                );
                promises.push(...stockPromises);
            }

            // ... (Gold/Silver logic remains same) ...

            // 2. Fetch Gold Price (if any gold items exist)
            if (financialData.gold && financialData.gold.length > 0) {
                const goldPromise = fetch(`/api/commodities/gold`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                    .then(res => res.ok ? res.json() : Promise.reject())
                    .then(data => {
                        priceUpdates.gold = data.price_per_ounce_usd;
                    })
                    .catch(err => console.error("Failed to fetch Gold price", err));
                promises.push(goldPromise);
            }

            // 3. Fetch Silver Price (if any silver items exist)
            if (financialData.silver && financialData.silver.length > 0) {
                const silverPromise = fetch(`/api/commodities/silver`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                    .then(res => res.ok ? res.json() : Promise.reject())
                    .then(data => {
                        priceUpdates.silver = data.price_per_ounce_usd;
                    })
                    .catch(err => console.error("Failed to fetch Silver price", err));
                promises.push(silverPromise);
            }

            await Promise.all(promises);

            // Trigger Background Fundamental Updates (Self-Healing)
            if (missingFundamentals.length > 0) {
                missingFundamentals.forEach(async (item) => {
                    try {
                        const res = await fetch(`/api/financial/${item.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify({ manualRefresh: true }) // Trigger backend fetch
                        });
                        if (res.ok) {
                            const updatedItem = await res.json();
                            // Update state with new fundamentals immediately
                            setFinancialData(prev => ({
                                ...prev,
                                stocks: prev.stocks.map(s => s.id === updatedItem.id ? { ...s, ...updatedItem } : s)
                            }));
                        }
                    } catch (e) {
                        console.warn("Background fundamental update failed", e);
                    }
                });
            }

            setFinancialData(prevData => {
                const newData = JSON.parse(JSON.stringify(prevData));
                let pricesWereUpdated = false;

                // Update Stocks
                if (newData.stocks) {
                    newData.stocks.forEach(stock => {
                        const key = stock.symbol || stock.name;
                        if (priceUpdates.stocks[key] !== undefined) {
                            stock.currentPrice = priceUpdates.stocks[key].price;
                            stock.previousClose = priceUpdates.stocks[key].prevClose;
                            pricesWereUpdated = true;
                        }
                    });
                }

                // Update Mutual Funds
                if (newData.mutualFunds) {
                    newData.mutualFunds.forEach(mf => {
                        if (mf.symbol && priceUpdates.stocks[mf.symbol] !== undefined) {
                            mf.currentPrice = priceUpdates.stocks[mf.symbol].price;
                            mf.previousClose = priceUpdates.stocks[mf.symbol].prevClose;
                            pricesWereUpdated = true;
                        }
                    });
                }

                // Update Gold
                if (priceUpdates.gold !== null && newData.gold) {
                    newData.gold.forEach(item => {
                        item.currentValue = priceUpdates.gold; // Per Ounce
                    });
                    pricesWereUpdated = true;
                }

                // Update Silver
                if (priceUpdates.silver !== null && newData.silver) {
                    newData.silver.forEach(item => {
                        item.currentValue = priceUpdates.silver; // Per Ounce
                    });
                    pricesWereUpdated = true;
                }

                return pricesWereUpdated ? newData : prevData;
            });

        } catch (error) {
            console.error("Error fetching live prices:", error);
        } finally {
            setIsLoadingPrices(false);
        }
    };

    // Auto-refresh prices on mount or when items change
    useEffect(() => {
        const hasStocks = financialData.stocks?.length > 0;
        const hasGold = financialData.gold?.length > 0;
        const hasSilver = financialData.silver?.length > 0;

        if (hasStocks || hasGold || hasSilver) {
            handleRefreshPrices();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [financialData.stocks?.length, financialData.gold?.length, financialData.silver?.length]);

    // --- Save Data via API ---
    const handleSaveItem = async (category, itemToSave) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to save data.");
            return;
        }

        try {
            let savedItem;
            if (modalConfig.mode === 'add') {
                const response = await fetch('/api/financial', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ type: category, ...itemToSave })
                });

                if (response.ok) {
                    savedItem = await response.json();
                    setFinancialData(prev => ({
                        ...prev,
                        [category]: [...(prev[category] || []), savedItem]
                    }));
                }
            } else {
                const { id, ...updates } = itemToSave;
                const response = await fetch(`/api/financial/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updates)
                });

                if (response.ok) {
                    savedItem = await response.json();
                    setFinancialData(prev => ({
                        ...prev,
                        [category]: prev[category].map(item => item.id === savedItem.id ? savedItem : item)
                    }));
                }
            }
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Failed to save item. Please try again.');
        }
    };

    // --- Remove Data via API ---
    const handleRemoveItem = async (category, itemId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`/api/financial/${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setFinancialData(prev => ({
                    ...prev,
                    [category]: prev[category].filter(item => item.id !== itemId)
                }));
            } else {
                console.error('Failed to delete item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item.');
        }
    };

    // --- Event Handlers ---
    const handleSignOut = () => navigate('/');
    const openModal = (mode, category, item = null) => {
        setModalConfig({ mode, category, item });
        setIsModalOpen(true);
    };
    const handleCategoryClick = (id) => {
        setActiveCategory(id);
    };
    const handleProjectionClick = () => {
        navigate('/projection', { state: { financialData } });
    };

    // --- Calculation Logic for Footer ---
    const categoryTotal = useMemo(() => {
        const items = financialData[activeCategory] || [];
        let total = 0, label = '', type = 'investment';

        switch (activeCategory) {
            case 'stocks':
                label = 'Total Stock P/L';
                total = items.reduce((acc, s) => acc + (s.currentPrice - s.purchasePrice) * s.quantity, 0);
                break;
            case 'properties':
                label = 'Total Property Value Gain';
                total = items.reduce((acc, p) => acc + (calculatePropertyValue(p) - p.purchasePrice), 0);
                break;
            case 'mutualFunds':
                label = 'Total Mutual Fund Gain';
                // Calculate P/L based on Live Price vs Avg Buy Price
                total = items.reduce((acc, m) => {
                    const currentVal = (m.currentPrice || m.purchasePrice || 0) * (m.quantity || 0);
                    const investedVal = (m.purchasePrice || 0) * (m.quantity || 0);
                    return acc + (currentVal - investedVal);
                }, 0);
                break;
            case 'fd':
                label = 'Total Interest Earned';
                total = items.reduce((acc, f) => acc + (f.principal * Math.pow(1 + f.interestRate / 100, f.years) - f.principal), 0);
                break;
            case 'gold':
                label = 'Total Gold Gain';
                total = items.reduce((acc, g) => acc + (g.currentValue - g.purchasePrice), 0);
                break;
            case 'silver':
                label = 'Total Silver Gain';
                total = items.reduce((acc, s) => acc + (s.currentValue - s.purchasePrice), 0);
                break;
            case 'postRetirement':
                label = 'Total Retirement Savings';
                total = items.reduce((acc, item) => acc + (item.amount || 0), 0);
                break;
            case 'loans':
                label = 'Total Remaining Loans';
                total = items.reduce((acc, l) => acc + calculateRemainingLoan(l), 0);
                type = 'cost';
                break;
            case 'insurance':
                label = 'Total Insurance Paid';
                total = items.reduce((acc, i) => acc + calculateInsuranceTotal(i), 0);
                type = 'cost';
                break;
            default:
                const info = categories.lifeEvents.find(c => c.id === activeCategory);
                label = `Total ${info ? info.label : ''} Cost`;
                total = items.reduce((acc, item) => acc + (item.cost || 0), 0);
                type = 'cost';
                break;
        }
        return { label, amount: total, type };
    }, [activeCategory, financialData]);

    // --- Render Functions (No changes) ---
    const renderItem = (category, item) => {
        let profitLoss, isItemProfit, currentValue;
        switch (category) {
            case 'stocks':
                const totalProfitLoss = (item.currentPrice - item.purchasePrice) * item.quantity;
                const totalProfitClass = totalProfitLoss >= 0 ? 'text-profit' : 'text-loss';

                const todayProfitLoss = item.previousClose ? (item.currentPrice - item.previousClose) * item.quantity : 0;
                const todayProfitClass = todayProfitLoss >= 0 ? 'text-profit' : 'text-loss';

                const dailyProfitPercentage = item.previousClose ? ((item.currentPrice - item.previousClose) / item.previousClose) * 100 : 0;
                const dailyProfitPercentageClass = dailyProfitPercentage >= 0 ? 'text-profit' : 'text-loss';
                const dailyProfitSign = dailyProfitPercentage >= 0 ? '+' : '';

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="item-name">{item.name} ({item.quantity} units)</span>
                            <span style={{ fontWeight: '600' }}>LTP ${item.currentPrice.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <span className={totalProfitClass}>Total P/L: ${totalProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                {item.previousClose && (
                                    <span className={todayProfitClass}>Today's P/L: ${todayProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                )}
                            </div>
                            {item.previousClose && (
                                <span className={dailyProfitPercentageClass} style={{ fontSize: '0.8rem', fontWeight: '500' }}>
                                    Today {dailyProfitSign}{dailyProfitPercentage.toFixed(2)}%
                                </span>
                            )}
                        </div>
                        {/* Phase 8: Fundamentals Hidden (Used for ML only) */}
                    </div>
                );
            case 'properties': currentValue = calculatePropertyValue(item); profitLoss = currentValue - item.purchasePrice; isItemProfit = profitLoss >= 0;
                return <><span className="item-name">{item.name}</span> <span className={isItemProfit ? 'text-profit' : 'text-loss'}>Value Gain: ${profitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></>;
            case 'mutualFunds':
                // MF Logic: Similar to Stocks now (Live Price * Qty)
                // Fallback to Purchase Price if Live Price not available yet
                const mfCurrentPrice = item.currentPrice || item.purchasePrice || 0;
                const mfTotalValue = mfCurrentPrice * (item.quantity || 0);
                const mfTotalCost = (item.purchasePrice || 0) * (item.quantity || 0);
                const mfPL = mfTotalValue - mfTotalCost;
                const isMfProfit = mfPL >= 0;
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="item-name">{item.name} ({item.symbol})</span>
                            <span style={{ fontWeight: '600' }}>NAV: ${mfCurrentPrice.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                            <span className={isMfProfit ? 'text-profit' : 'text-loss'}>
                                P/L: ${mfPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
                                Value: ${mfTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                );
            case 'fd': const maturityValue = (item.principal * Math.pow(1 + item.interestRate / 100, item.years));
                return <><span className="item-name">{item.name}</span> <span>Matures to: ${maturityValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></>;
            case 'gold': case 'silver':
                const currentRate = item.currentValue || 0;
                const totalCurrentValue = currentRate * (item.quantity || 0);
                profitLoss = totalCurrentValue - item.purchasePrice;
                isItemProfit = profitLoss >= 0;
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="item-name">{item.name} ({item.quantity} oz)</span>
                            <span style={{ fontWeight: '600' }}>Rate: ${currentRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /oz</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                            <span className={isItemProfit ? 'text-profit' : 'text-loss'}>
                                Gain: ${profitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
                                Value: ${totalCurrentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                );
            case 'postRetirement':
                return <><span className="item-name">{item.name}</span> <span className="item-cost text-profit">Contribution: ${item.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span></>;
            case 'loans':
                return <><span className="item-name">{item.name}</span> <span className="item-cost">Remaining: ${calculateRemainingLoan(item).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></>;
            case 'insurance':
                return <><span className="item-name">{item.name}</span> <span className="item-cost">Total Paid: ${calculateInsuranceTotal(item).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></>;
            default:
                return <><span className="item-name">{item.name}</span> <span className="item-cost">Cost: ${item.cost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span></>;
        }
    };

    return (
        <div className="dashboard-container">
            <DashboardStyles />
            {isModalOpen && <ItemModal config={modalConfig} onClose={() => setIsModalOpen(false)} onSave={handleSaveItem} categories={categories} />}

            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 className="sidebar-title">FinAdvice</h1>
                    <button onClick={handleSignOut} className="sign-out-button">Sign Out</button>
                </div>

                <section>
                    <h2 className="section-title">Investment</h2>
                    <ul className="category-list">
                        {categories.investment.map(({ id, label }) => (
                            <li key={id} className="category-item">
                                <button onClick={() => handleCategoryClick(id)} className={`category-button ${activeCategory === id ? 'active' : ''}`}>{label}</button>
                                <button onClick={() => openModal('add', id)} className="add-item-button"><PlusIcon /></button>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="events-section">
                    <h2 className="section-title">Life Events</h2>
                    <ul className="category-list">
                        {categories.lifeEvents.map(({ id, label }) => (
                            <li key={id} className="category-item">
                                <button onClick={() => handleCategoryClick(id)} className={`category-button ${activeCategory === id ? 'active' : ''}`}>{label}</button>
                                <button onClick={() => openModal('add', id)} className="add-item-button"><PlusIcon /></button>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="projection-section">
                    <h2 className="section-title">Projected Growth</h2>
                    <ul className="category-list">
                        <li>
                            <button onClick={handleProjectionClick} className="category-button">
                                View Full Projection
                            </button>
                        </li>
                    </ul>
                </section>
            </aside>

            <main className="main-content">
                <div className="content-wrapper">
                    <>
                        <div className="live-update-section">
                            <h2>{categories.investment.find(c => c.id === activeCategory)?.label || categories.lifeEvents.find(c => c.id === activeCategory)?.label}</h2>
                            {['stocks', 'mutualFunds', 'gold', 'silver'].includes(activeCategory) && (
                                <button onClick={handleRefreshPrices} disabled={isLoadingPrices} className="live-update-button">
                                    {isLoadingPrices ? 'Updating...' : 'Refresh Live Prices'}
                                </button>
                            )}
                        </div>
                        <div className="item-list-container">
                            <ul className="item-list">
                                {financialData[activeCategory]?.length > 0 ? (
                                    financialData[activeCategory].map(item => (
                                        <li key={item.id} className="item-list-entry">
                                            <div className="item-details">
                                                {renderItem(activeCategory, item)}
                                            </div>
                                            <div className="item-actions">
                                                <button onClick={() => openModal('edit', activeCategory, item)} className="edit-item-button"><EditIcon /></button>
                                                <button onClick={() => handleRemoveItem(activeCategory, item.id)} className="remove-item-button"><TrashIcon /></button>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="no-items-message">No items added yet. Click the '+' to add one.</li>
                                )}
                            </ul>
                        </div>
                        {categoryTotal && (
                            <footer className="total-footer">
                                <div className="total-container">
                                    <span className="total-label">{categoryTotal.label}:</span>
                                    <span className={`total-amount ${categoryTotal.type === 'cost' || categoryTotal.amount < 0 ? 'text-loss' : 'text-profit'}`}>
                                        {categoryTotal.type === 'cost' ? '-' : (categoryTotal.amount >= 0 ? '+' : '-')}$
                                        {Math.abs(categoryTotal.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </footer>
                        )}
                    </>
                </div>
            </main>
        </div>
    );
}

