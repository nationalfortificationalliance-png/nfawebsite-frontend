import type { FAQ } from './api';
import type { IconName } from '@/components/Icon';

export interface CategoryMeta {
    icon: IconName;
    slug: string;
}

// Category display order + icon mapping. Any category coming from the CMS that
// isn't listed here falls back to 'help-circle' and is appended at the end.
export const CATEGORY_META: Record<string, CategoryMeta> = {
    'General': { icon: 'globe', slug: 'general' },
    'Certification & Compliance': { icon: 'shield-check', slug: 'certification-compliance' },
    'Laboratories & Testing': { icon: 'microscope', slug: 'laboratories-testing' },
    'Regulations & Standards': { icon: 'scale', slug: 'regulations-standards' },
    'Industry': { icon: 'factory', slug: 'industry' },
    'Consumers': { icon: 'users', slug: 'consumers' },
    'Partnerships': { icon: 'handshake', slug: 'partnerships' },
    'About the NFA': { icon: 'landmark', slug: 'about-the-nfa' },
};

export const CATEGORY_ORDER = Object.keys(CATEGORY_META);

export interface QuickLink {
    label: string;
    href: string;
    icon: IconName;
}

const LINK = {
    guidelines: { label: 'View Technical Guidelines', href: '/resources#guidelines', icon: 'file-text' as IconName },
    labs: { label: 'Find Approved Laboratories', href: '/resources#laboratories', icon: 'microscope' as IconName },
    partner: { label: 'Become a Partner', href: '/partners', icon: 'handshake' as IconName },
    contact: { label: 'Contact the Secretariat', href: '/contact', icon: 'mail' as IconName },
    news: { label: 'Read Latest News', href: '/news', icon: 'newspaper' as IconName },
    communiques: { label: 'View Communiqués', href: '/news?category=communique', icon: 'scroll-text' as IconName },
};

export const CATEGORY_QUICK_LINKS: Record<string, QuickLink[]> = {
    'General': [LINK.guidelines, LINK.contact],
    'Certification & Compliance': [LINK.guidelines, LINK.labs],
    'Laboratories & Testing': [LINK.labs, LINK.guidelines],
    'Regulations & Standards': [LINK.guidelines],
    'Industry': [LINK.guidelines, LINK.contact],
    'Consumers': [LINK.contact, LINK.news],
    'Partnerships': [LINK.partner, LINK.contact],
    'About the NFA': [LINK.news, LINK.communiques, LINK.contact],
};

// Seed / fallback content — mirrors backend/scripts/import-faqs.js.
// Keep the two in sync when editing FAQ copy.
export const FALLBACK_FAQS: FAQ[] = [
    // GENERAL
    {
        id: 1, documentId: 'faq-1', order: 1, is_active: true, category: 'General',
        question: 'What is food fortification?',
        answer: 'Food fortification is the deliberate addition of essential vitamins and minerals to commonly consumed foods to improve their nutritional value and help prevent micronutrient deficiencies. In Nigeria, mandatory food fortification is implemented as a public health strategy to improve nutrition and reduce vitamin and mineral deficiencies across the population.',
    },
    {
        id: 2, documentId: 'faq-2', order: 2, is_active: true, category: 'General',
        question: 'Why is food fortification important?',
        answer: 'Micronutrient deficiencies, often referred to as "hidden hunger," can lead to impaired growth, weakened immunity, poor cognitive development, birth defects, and reduced productivity. Food fortification helps address these deficiencies by improving the nutritional quality of staple foods consumed daily.',
    },
    {
        id: 3, documentId: 'faq-3', order: 3, is_active: true, category: 'General',
        question: 'Which foods are mandated for fortification in Nigeria?',
        answer: 'Nigeria currently mandates the fortification of selected staple foods, including:\n• Flour (Wheat, Maize, Composite)\n• Vegetable Oil\n• Sugar\n• Salt\n• Margarine\nEach food vehicle is fortified with specific micronutrients as prescribed under national regulations and standards.',
    },
    {
        id: 4, documentId: 'faq-4', order: 4, is_active: true, category: 'General',
        question: 'Is food fortification safe?',
        answer: 'Yes. Food fortification follows internationally accepted scientific standards and is implemented under national regulations. Only approved micronutrients are added in carefully controlled quantities to ensure safety and effectiveness.',
    },
    {
        id: 5, documentId: 'faq-5', order: 5, is_active: true, category: 'General',
        question: 'Who benefits from food fortification?',
        answer: 'Food fortification benefits the entire population, particularly:\n• Children\n• Pregnant and lactating women\n• Adolescents\n• Women of reproductive age\n• Vulnerable populations\n• The general public',
    },

    // CERTIFICATION & COMPLIANCE
    {
        id: 6, documentId: 'faq-6', order: 1, is_active: true, category: 'Certification & Compliance',
        question: 'How can my company become a certified fortification processor?',
        answer: 'Food processors should:\n• Register with NAFDAC.\n• Obtain all required product approvals.\n• Install appropriate fortification equipment.\n• Source approved vitamin and mineral premixes.\n• Implement quality assurance and quality control systems.\n• Train relevant personnel.\n• Comply with national fortification regulations.\n• Successfully pass facility inspections and product verification.',
    },
    {
        id: 7, documentId: 'faq-7', order: 2, is_active: true, category: 'Certification & Compliance',
        question: 'What quality assurance measures are required?',
        answer: 'Manufacturers are expected to maintain documented quality management systems, perform routine process monitoring, calibrate equipment, conduct laboratory testing, and maintain traceable production records.',
    },
    {
        id: 8, documentId: 'faq-8', order: 3, is_active: true, category: 'Certification & Compliance',
        question: 'How is compliance monitored?',
        answer: 'Compliance is monitored through routine inspections, factory audits, market surveillance, product sampling, laboratory analysis, and regulatory enforcement activities coordinated by relevant government agencies.',
    },
    {
        id: 9, documentId: 'faq-9', order: 4, is_active: true, category: 'Certification & Compliance',
        question: 'What happens if a company fails compliance testing?',
        answer: 'Products that fail to meet regulatory requirements may be subject to regulatory actions, including corrective measures, additional inspections, sanctions, product recalls, or other enforcement actions in accordance with applicable laws.',
    },
    {
        id: 10, documentId: 'faq-10', order: 5, is_active: true, category: 'Certification & Compliance',
        question: 'How often are fortified foods tested?',
        answer: 'Testing frequency depends on regulatory requirements, manufacturer quality control programmes, and routine compliance monitoring conducted by regulatory authorities.',
    },

    // LABORATORIES & TESTING
    {
        id: 11, documentId: 'faq-11', order: 1, is_active: true, category: 'Laboratories & Testing',
        question: 'Where can I find approved micronutrient laboratories?',
        answer: 'The National Fortification Alliance maintains a directory of recognized laboratories supporting micronutrient analysis and compliance monitoring. The directory is available under the Resources section of this website.',
    },
    {
        id: 12, documentId: 'faq-12', order: 2, is_active: true, category: 'Laboratories & Testing',
        question: 'Why is laboratory testing important?',
        answer: 'Laboratory analysis confirms that fortified foods contain the required micronutrients at prescribed levels and supports regulatory compliance, product quality, and consumer safety.',
    },
    {
        id: 13, documentId: 'faq-13', order: 3, is_active: true, category: 'Laboratories & Testing',
        question: 'Can any laboratory perform micronutrient analysis?',
        answer: 'Only laboratories with the required technical capacity, validated methods, qualified personnel, and appropriate equipment should perform micronutrient analysis for regulatory purposes.',
    },
    {
        id: 14, documentId: 'faq-14', order: 4, is_active: true, category: 'Laboratories & Testing',
        question: 'How can laboratories become recognized?',
        answer: 'Laboratories seeking recognition should demonstrate technical competence, maintain appropriate quality management systems, participate in proficiency testing where applicable, and satisfy established technical requirements.',
    },

    // REGULATIONS & STANDARDS
    {
        id: 15, documentId: 'faq-15', order: 1, is_active: true, category: 'Regulations & Standards',
        question: 'Which regulations govern food fortification in Nigeria?',
        answer: 'Food fortification is governed by national regulations, standards, and technical guidelines developed by relevant government institutions, including NAFDAC and the Standards Organisation of Nigeria (SON), in collaboration with other stakeholders.',
    },
    {
        id: 16, documentId: 'faq-16', order: 2, is_active: true, category: 'Regulations & Standards',
        question: 'Where can I access official fortification guidelines?',
        answer: 'Official technical guidelines, standards, regulations, manuals, and reference documents are available in the Resources section of this website.',
    },
    {
        id: 17, documentId: 'faq-17', order: 3, is_active: true, category: 'Regulations & Standards',
        question: 'Are Nigerian regulations aligned with international standards?',
        answer: "Nigeria's fortification programme is informed by international best practices and scientific recommendations while addressing national nutrition priorities and local consumption patterns.",
    },

    // INDUSTRY
    {
        id: 18, documentId: 'faq-18', order: 1, is_active: true, category: 'Industry',
        question: 'Where can manufacturers obtain vitamin premixes?',
        answer: 'Vitamin and mineral premixes should be sourced from reputable suppliers that meet national regulatory requirements and recognized quality standards.',
    },
    {
        id: 19, documentId: 'faq-19', order: 2, is_active: true, category: 'Industry',
        question: 'What equipment is required for fortification?',
        answer: 'The required equipment depends on the specific food vehicle but generally includes dosing systems, mixers, monitoring devices, quality control equipment, and appropriate storage facilities.',
    },
    {
        id: 20, documentId: 'faq-20', order: 3, is_active: true, category: 'Industry',
        question: 'What are the most common challenges affecting food fortification?',
        answer: 'Common challenges include:\n• High cost of premixes\n• Foreign exchange constraints\n• Equipment maintenance\n• Laboratory testing costs\n• Supply chain disruptions\n• Capacity gaps\n• Quality assurance challenges',
    },
    {
        id: 21, documentId: 'faq-21', order: 4, is_active: true, category: 'Industry',
        question: 'Does the NFA provide technical support?',
        answer: 'Yes. The National Fortification Alliance facilitates technical guidance, stakeholder coordination, knowledge sharing, capacity building, and collaboration among programme partners.',
    },

    // CONSUMERS
    {
        id: 22, documentId: 'faq-22', order: 1, is_active: true, category: 'Consumers',
        question: 'How can I identify fortified food products?',
        answer: 'Consumers should purchase products that are properly registered with NAFDAC, bear the required product labeling (Fortification logo), and comply with national food regulations. Always read product labels before purchase.',
    },
    {
        id: 23, documentId: 'faq-23', order: 2, is_active: true, category: 'Consumers',
        question: 'Can fortified foods replace a balanced diet?',
        answer: 'No. Food fortification complements a healthy and balanced diet but does not replace good nutrition or healthy eating practices.',
    },
    {
        id: 24, documentId: 'faq-24', order: 3, is_active: true, category: 'Consumers',
        question: 'How can I report suspected non-compliance?',
        answer: 'Suspected cases of non-compliance may be reported to NAFDAC through its established consumer complaint channels or by contacting the National Fortification Alliance Secretariat.',
    },
    {
        id: 25, documentId: 'faq-25', order: 4, is_active: true, category: 'Consumers',
        question: 'Are fortified foods more expensive?',
        answer: 'Food fortification is designed to provide significant public health benefits at a relatively low cost while minimizing any impact on product affordability.',
    },

    // PARTNERSHIPS
    {
        id: 26, documentId: 'faq-26', order: 1, is_active: true, category: 'Partnerships',
        question: 'What is the National Fortification Alliance?',
        answer: "The National Fortification Alliance (NFA) is Nigeria's national multi-sectoral coordination platform for food fortification. It brings together government institutions, industry, academia, professional bodies, development partners, civil society organizations, and other stakeholders to strengthen and sustain food fortification programmes.",
    },
    {
        id: 27, documentId: 'faq-27', order: 2, is_active: true, category: 'Partnerships',
        question: 'Who are the members of the Alliance?',
        answer: 'Membership includes representatives from:\n• Government Ministries, Departments and Agencies (MDAs)\n• Regulatory authorities\n• Food industry stakeholders\n• Development partners\n• Professional associations\n• Academic and research institutions\n• Civil society organizations\n• Consumer advocacy groups',
    },
    {
        id: 28, documentId: 'faq-28', order: 3, is_active: true, category: 'Partnerships',
        question: 'How can my organization become a partner?',
        answer: "Organizations interested in supporting Nigeria's food fortification programme may submit an Expression of Interest through the Partnership section of this website or contact the Secretariat for further guidance.",
    },
    {
        id: 29, documentId: 'faq-29', order: 4, is_active: true, category: 'Partnerships',
        question: 'What benefits do partners receive?',
        answer: 'Partners benefit from:\n• Technical collaboration\n• Policy dialogue\n• Access to stakeholder networks\n• Capacity-building opportunities\n• Knowledge sharing\n• Programme coordination\n• Joint implementation initiatives',
    },

    // ABOUT THE NFA
    {
        id: 30, documentId: 'faq-30', order: 1, is_active: true, category: 'About the NFA',
        question: 'What is the role of the NFA Secretariat?',
        answer: 'The Secretariat coordinates the day-to-day operations of the Alliance, organizes meetings, facilitates stakeholder engagement, supports programme implementation, manages communications, maintains documentation, and monitors implementation of Alliance decisions.',
    },
    {
        id: 31, documentId: 'faq-31', order: 2, is_active: true, category: 'About the NFA',
        question: 'Which organization hosts the Secretariat?',
        answer: 'The National Fortification Alliance Secretariat is hosted by the National Agency for Food and Drug Administration and Control (NAFDAC).',
    },
    {
        id: 32, documentId: 'faq-32', order: 3, is_active: true, category: 'About the NFA',
        question: 'How often does the Alliance meet?',
        answer: 'The Alliance convenes bi-annual Steering Committee meetings, technical working sessions, stakeholder consultations, and bi-annual meetings to review progress and guide programme implementation.',
    },
    {
        id: 33, documentId: 'faq-33', order: 4, is_active: true, category: 'About the NFA',
        question: 'Does the NFA publish reports and communiqués?',
        answer: 'Yes. Meeting communiqués, technical resources, reports, and other official publications are made available through the News & Events and Resources sections of this website.',
    },
    {
        id: 34, documentId: 'faq-34', order: 5, is_active: true, category: 'About the NFA',
        question: 'How can I contact the Secretariat?',
        answer: 'You may contact the Secretariat through the Contact page using the published email address, telephone numbers, or office address. Organizations may also submit partnership inquiries, technical requests, or general enquiries through the official contact channels.',
    },
];
