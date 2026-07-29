'use client';

import { useState } from 'react';

interface FunctionItem {
    title: string;
    body: string;
}

export default function FunctionsAccordion({ items, defaultOpenIndex = 0 }: { items: FunctionItem[]; defaultOpenIndex?: number | null }) {
    const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

    return (
        <div className="functions-accordion">
            {items.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                    <div key={item.title} className={`functions-item${isOpen ? ' open' : ''}`}>
                        <button
                            type="button"
                            className="functions-summary"
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            aria-expanded={isOpen}
                        >
                            <span>{item.title}</span>
                            <span className="functions-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                        </button>
                        {isOpen && <p className="functions-body">{item.body}</p>}
                    </div>
                );
            })}
        </div>
    );
}
