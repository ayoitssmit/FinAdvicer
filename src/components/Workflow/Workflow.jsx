import React from 'react';
import { motion } from 'framer-motion';
import './Workflow.css';

const Workflow = () => {
    const steps = [
        {
            id: 1,
            title: "Data Aggregation",
            desc: "Syncs live balances covering Stocks, Fixed Deposits, and Mutual Funds.",
            icon: "M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4"
        },
        {
            id: 2,
            title: "Stochastic Modeling",
            desc: "Simulates 10,000 market scenarios against your defined life events.",
            icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        },
        {
            id: 3,
            title: "Strategic Output",
            desc: "Delivers a 90% confidence interval projected net-worth timeline.",
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        }
    ];

    return (
        <section id="workflow" className="section workflow-section">
            <div className="container">
                <div className="section-header text-center mb-5">
                    <h2 className="section-title">The <span className="text-secondary-brand">Pipeline</span></h2>
                </div>

                <div className="pipeline-container">
                    {/* Horizontal Line Background */}
                    <div className="pipeline-line"></div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            className="pipeline-node"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <div className="node-icon-wrapper">
                                <svg className="node-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                                </svg>
                                <div className="node-number">{step.id}</div>
                            </div>
                            <h3 className="node-title">{step.title}</h3>
                            <p className="node-desc">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Workflow;
