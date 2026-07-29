'use client';

import { useState, type ReactNode } from 'react';

interface AccordionItem {
    key: string;
    label: string;
    content: ReactNode;
}

export default function GovernanceRepAccordion({ items, defaultOpenKey }: { items: AccordionItem[]; defaultOpenKey?: string }) {
    const [openKey, setOpenKey] = useState<string | null>(defaultOpenKey ?? null);

    return (
        <div className="rep-accordion">
            {items.map((item) => {
                const isOpen = openKey === item.key;
                return (
                    <div key={item.key} className={`rep-collapsible${isOpen ? ' open' : ''}`}>
                        <button
                            type="button"
                            className="rep-collapsible-summary"
                            onClick={() => setOpenKey(isOpen ? null : item.key)}
                            aria-expanded={isOpen}
                        >
                            {item.label}
                            <span className="rep-collapsible-icon">{isOpen ? '−' : '+'}</span>
                        </button>
                        {isOpen && <div className="rep-collapsible-body">{item.content}</div>}
                    </div>
                );
            })}
        </div>
    );
}
