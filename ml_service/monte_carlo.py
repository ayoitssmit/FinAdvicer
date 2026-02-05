import numpy as np

def run_simulation(initial_investment, expected_return, volatility, years_list=[3, 5, 10], num_simulations=10000):
    """
    Runs Monte Carlo simulation for multiple time horizons.
    """
    results = {}
    
    for years in years_list:
        # Independent simulation for each timeframe (Distribution is what matters)
        random_component = np.random.normal(0, np.sqrt(years), num_simulations)
        drift = (expected_return - 0.5 * volatility ** 2) * years
        diffusion = volatility * random_component
        
        future_values = initial_investment * np.exp(drift + diffusion)
        
        results[years] = {
            "expectedValue": float(np.mean(future_values)),
            "bestCase": float(np.percentile(future_values, 95)),
            "worstCase": float(np.percentile(future_values, 5))
        }
        
    return results
