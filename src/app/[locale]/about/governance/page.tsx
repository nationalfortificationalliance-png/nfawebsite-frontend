import type { Metadata } from 'next';
import Link from 'next/link';
import Icon from '@/components/Icon';

export const metadata: Metadata = {
    title: 'Governance & Compliance | National Fortification Alliance',
    description: 'Learn about the roles, responsibilities, regulatory monitoring, and industry compliance structure of the NFA Nigeria.',
};

const ROLES = [
    {
        name: 'Standards Organisation of Nigeria (SON)',
        roles: [
            'Elaboration, review, and adoption of standards in collaboration with stakeholders',
            'Monitoring and testing of fortified foods at factory level',
            'Capacity building on food fortification',
            'Funding of laboratory testing and monitoring activities',
            'Secretariat for the USI/IDD Taskforce and Hosting of Taskforce meetings',
            'Collaboration with IPAN on laboratory certification'
        ]
    },
    {
        name: 'National Agency for Food and Drug Administration and Control (NAFDAC)',
        roles: [
            'Issuance of marketing authorization for fortified food products',
            'Registration of micronutrient premixes',
            'Monitoring and testing of fortified foods at retail, distribution, and port levels',
            'Funding of monitoring and laboratory activities',
            'Capacity building for regulatory staff',
            'Secretariat of the National Fortification Alliance',
            'Review and development of fortification regulations'
        ]
    },
    {
        name: 'Federal Ministry of Health and Social Welfare (FMOHSW)',
        roles: [
            'Nutrition policy development',
            'Programme evaluation and impact assessment',
            'Support for NFA coordination and activities'
        ]
    },
    {
        name: 'Federal Competition and Consumer Protection Commission (FCCPC)',
        roles: [
            'Household-level monitoring',
            'Consumer sensitization and awareness creation',
            'Advocacy activities'
        ]
    },
    {
        name: 'Industry',
        roles: [
            'Production and distribution of adequately fortified foods',
            'Sponsorship of NFA activities',
            'Support for food fortification research',
            'Consumer awareness and social marketing'
        ]
    },
    {
        name: 'Development Partners',
        roles: [
            'Technical assistance',
            'Capacity building',
            'Laboratory strengthening',
            'Financial support',
            'Public awareness creation'
        ]
    }
];

const LABS = [
    { name: 'Saag Chemicals', location: 'Lagos', contact: '08025589200' },
    { name: 'Remaben Scientific Services Ltd', location: 'Ikeja', contact: '08023037743' },
    { name: 'Bato Chemical Labs Ltd', location: 'Ogun State', contact: '08091972222' },
    { name: 'Jawura Environmental Services Ltd', location: 'Lagos', contact: '09058592802' },
    { name: 'LS Scientific Limited', location: 'Ikeja', contact: '08094709004' },
    { name: 'Alfa Laboratories', location: 'Lagos', contact: '08023093103' },
    { name: 'Katchey Laboratory', location: 'Ikeja', contact: '08036209410' },
    { name: 'Bureau Veritas Nigeria Ltd', location: 'Ogun State', contact: '08095559245' }
];

const MEETINGS = [
    { year: '2026', june: 'NAFDAC', december: 'Industry' },
    { year: '2027', june: 'SON', december: 'FCCPC' },
    { year: '2028', june: 'FMoHSW', december: 'NAFDAC' }
];

const CHALLENGES = [
    'Scarcity of Vitamin A Palmitate',
    'Foreign exchange constraints affecting premix supply',
    'Technical limitations in fortification equipment',
    'Inconsistencies in laboratory analytical results',
    'Challenges with shelf-life stability studies',
    'Packaging and storage limitations',
    'Inconsistent customs tariff implementation',
    'Inadequate monitoring of imported products',
    'Informal retail packaging challenges',
    'Technical capacity gaps in micronutrient testing'
];

const STEERING_COMMITTEE = [
    'Industry Representatives',
    'Federal Ministry of Health and Social Welfare',
    'Federal Ministry of Education',
    'Standards Organisation of Nigeria',
    'National Agency for Food and Drug Administration and Control',
    'Federal Competition and Consumer Protection Commission'
];

const MEMBERSHIP = {
    mdas: [
        { name: 'National Agency for Food and Drug Administration and Control', logo: '/NAFDAC_emblem.png' },
        { name: 'Federal Ministry of Health and Social Welfare', logo: '/Nigeria_Federal_Ministry_of_Health_Logo.png' },
        { name: 'Federal Ministry of Education' },
        { name: 'Federal Ministry of Industry, Trade and Investment' },
        { name: 'Federal Ministry of Finance, Budget and National Planning' },
        { name: 'Standards Organisation of Nigeria', logo: '/son_png.png' },
        { name: 'Federal Competition and Consumer Protection Commission', logo: '/fccpc_logo.png' },
        { name: 'Nigerian Customs Service' },
        { name: 'National Primary Health Care Development Agency' },
        { name: 'Federal Ministry of Agriculture and Food Security' },
        { name: 'Federal Ministry of Information and National Orientation' }
    ],
    industry: [
        'Flour Millers',
        'Vegetable Oil Producers',
        'Sugar Producers',
        'Salt Producers',
        'Bouillon Producers',
        'Premix Manufacturers, Suppliers, Importers, and Blenders',
        'Rice Millers'
    ],
    professional: [
        'Nutrition Society of Nigeria (NSN)',
        'Nigerian Institute of Food Science and Technology (NIFST)',
        'Association of Food Beverage Tobacco Employees (AFBTE)'
    ],
    partners: [
        { name: 'World Food Programme (WFP)', logo: '/wfp-logo-standard-blue-en.svg' },
        { name: 'UNICEF', logo: '/UNICEF_Logo.png' },
        { name: 'Global Alliance for Improved Nutrition (GAIN)', logo: '/GAIN_logo_RVB.webp' },
        { name: 'Bill & Melinda Gates Foundation', logo: '/gates foundation logo.svg' },
        { name: 'Helen Keller International (HKI)' },
        { name: 'TechnoServe' },
        { name: 'World Health Organization (WHO)' },
        { name: 'Particle for Humanity (PFH)' }
    ],
    others: [
        'Universities and research institutions',
        'Media organizations',
        'Civil society organizations',
        'Consumer advocacy groups'
    ]
};

export default function GovernancePage() {
    return (
        <main className="governance-page">
            <style>{`
                /* Standard Hero - No Image */
                .gov-hero {
                    background: var(--wfp-navy);
                    padding: 5rem 0 4rem;
                }
                .gov-hero h1 {
                    color: #fff;
                    max-width: 720px;
                    margin-bottom: 1rem;
                }
                .gov-hero p {
                    color: rgba(255,255,255,0.85);
                    max-width: 720px;
                    font-size: 1.1rem;
                    line-height: 1.6;
                }
                .gov-hero .breadcrumb {
                    margin-bottom: 2rem;
                }
                .gov-hero .breadcrumb a,
                .gov-hero .breadcrumb span {
                    color: rgba(255,255,255,0.7);
                }
                .gov-hero .breadcrumb a:hover {
                    color: #fff;
                }

                .roles-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 2.5rem;
                    margin-top: 4rem;
                }
                .role-card {
                    background: rgba(255,255,255,0.8);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.5);
                    border-radius: 24px;
                    padding: 2.5rem;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.04);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    display: flex;
                    flex-direction: column;
                }
                .role-card:hover {
                    transform: translateY(-10px) scale(1.02);
                    box-shadow: 0 20px 60px rgba(0,0,0,0.08);
                    background: #fff;
                    border-color: var(--wfp-blue-light);
                }
                .role-card h3 {
                    color: var(--wfp-navy);
                    font-size: 1.4rem;
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .role-list {
                    list-style: none;
                    padding-left: 0;
                }
                .role-list li {
                    position: relative;
                    padding-left: 1.75rem;
                    margin-bottom: 1rem;
                    font-size: 0.95rem;
                    color: var(--text-secondary);
                    line-height: 1.6;
                }
                .role-list li::before {
                    content: "✓";
                    color: var(--wfp-blue);
                    font-weight: 900;
                    position: absolute;
                    left: 0;
                    top: 0;
                }

                .monitoring-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                    margin-top: 3rem;
                }
                .monitor-card {
                    background: #fff;
                    padding: 3rem 2rem;
                    border-radius: 32px;
                    text-align: center;
                    border: 1px solid var(--border-light);
                    transition: all 0.3s;
                }
                .monitor-card:hover {
                    border-color: var(--wfp-blue);
                    box-shadow: var(--shadow-xl);
                }
                .monitor-icon-box {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 2rem;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                }
                
                .monitor-card h3 { font-size: 1.3rem; margin-bottom: 1rem; color: var(--wfp-navy); }
                .monitor-card p { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; }

                .table-container {
                    overflow-x: auto;
                    margin-top: 2rem;
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-md);
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    background: #fff;
                }
                th, td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid var(--border-light);
                }
                th {
                    background: var(--bg-off);
                    font-weight: 700;
                    color: var(--text-primary);
                }
                tr:last-child td { border-bottom: none; }
                
                .challenges-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1rem;
                    margin-top: 2rem;
                }
                .challenge-item {
                    background: #fff;
                    padding: 1rem;
                    border: 1px solid var(--border-light);
                    border-left: 4px solid var(--wfp-red, #dc2626);
                    border-radius: 4px;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                }

                .membership-section {
                    margin-top: 4rem;
                }
                .membership-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                }
                .member-cat-card {
                    background: #fff;
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-md);
                    padding: 1.5rem;
                }
                .member-cat-card h4 {
                    font-size: 1rem;
                    color: var(--wfp-blue);
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border-bottom: 1px solid var(--bg-off);
                    padding-bottom: 0.5rem;
                }
                .member-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .member-list li {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    margin-bottom: 0.75rem;
                    line-height: 1.4;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .member-list li::before {
                    content: "•";
                    color: var(--wfp-gold);
                }
                .member-logo-mini {
                    width: 24px;
                    height: 24px;
                    object-fit: contain;
                    flex-shrink: 0;
                    filter: grayscale(100%);
                    opacity: 0.7;
                    transition: all 0.2s;
                }
                .member-list li:hover .member-logo-mini {
                    filter: grayscale(0%);
                    opacity: 1;
                    transform: scale(1.1);
                }

                @media (max-width: 900px) {
                    .monitoring-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="gov-hero">
                <div className="container">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <Link href="/about">About</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span>Governance & Compliance</span>
                    </div>
                    <h1>Governance & Compliance</h1>
                    <p>
                        The NFA operates through a collaborative governance framework involving regulators, policymakers, industry representatives, development partners, academia, and civil society.
                    </p>
                </div>
            </div>

            {/* Steering Committee Section */}
            <section className="section" style={{ background: 'var(--bg-off)', borderBottom: '1px solid var(--border-light)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <p className="section-eyebrow">Leadership</p>
                            <h2>NFA Steering Committee</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '1rem' }}>
                                The Steering Committee provides high-level strategic direction and oversight for the National Fortification Project, ensuring policy alignment and cross-sectoral accountability.
                            </p>
                        </div>
                        <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
                            <h4 style={{ marginBottom: '1.5rem', color: 'var(--wfp-navy)' }}>Committee Membership</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {STEERING_COMMITTEE.map((m, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                                        <Icon name="check-circle" size={16} style={{ color: 'var(--wfp-green)', flexShrink: 0 }} /> {m}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Roles and Responsibilities */}
            <section className="section">
                <div className="container">
                    <p className="section-eyebrow">Accountability</p>
                    <h2 className="section-title">Roles and Responsibilities</h2>
                    <p className="section-lead">The success of the National Fortification Project relies on clearly defined roles across all stakeholder groups.</p>
                    
                    <div className="roles-grid">
                        {ROLES.map((role, idx) => (
                            <div key={idx} className="role-card">
                                <h3>{role.name}</h3>
                                <ul className="role-list">
                                    {role.roles.map((r, rIdx) => (
                                        <li key={rIdx}>{r}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Regulatory Monitoring System */}
            <section className="section" style={{ background: 'var(--bg-off)' }}>
                <div className="container">
                    <p className="section-eyebrow" style={{ color: 'var(--wfp-blue)' }}>Compliance</p>
                    <h2 className="section-title">Regulatory Monitoring System</h2>
                    <p className="section-lead">According to the NFA Regulatory Framework, food fortification monitoring in Nigeria operates across three major levels to ensure product quality from production to consumption.</p>
                    
                    <div className="monitoring-grid">
                        <div className="monitor-card">
                            <div className="monitor-icon-box" style={{ background: '#f0f7ff', color: 'var(--wfp-blue)' }}>
                                <Icon name="settings" size={32} />
                            </div>
                            <h3>Factory Level</h3>
                            <p>Conducted by the <strong>Standards Organisation of Nigeria (SON)</strong> to ensure compliance during the production process.</p>
                        </div>
                        <div className="monitor-card">
                            <div className="monitor-icon-box" style={{ background: '#f5f3ff', color: 'var(--wfp-navy)' }}>
                                <Icon name="truck" size={32} />
                            </div>
                            <h3>Distribution & Retail</h3>
                            <p>Conducted by the <strong>National Agency for Food and Drug Administration and Control (NAFDAC)</strong> at market and port levels.</p>
                        </div>
                        <div className="monitor-card">
                            <div className="monitor-icon-box" style={{ background: '#f0fdf4', color: 'var(--wfp-green)' }}>
                                <Icon name="home" size={32} />
                            </div>
                            <h3>Household Level</h3>
                            <p>Conducted by the <strong>Federal Competition and Consumer Protection Commission (FCCPC)</strong> and Federal Ministry of Education (FME).</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Approved Labs */}
            <section className="section">
                <div className="container">
                    <p className="section-eyebrow">Quality Assurance</p>
                    <h2 className="section-title">Approved Micronutrient Laboratories</h2>
                    <p className="section-lead">
                        The NFA, in collaboration with the Institute of Public Analysts of Nigeria (IPAN), recognizes accredited laboratories supporting micronutrient analysis and compliance monitoring.
                    </p>
                    
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Laboratory Name</th>
                                    <th>Location</th>
                                    <th>Contact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {LABS.map((lab, idx) => (
                                    <tr key={idx}>
                                        <td><strong>{lab.name}</strong></td>
                                        <td>{lab.location}</td>
                                        <td>{lab.contact}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Biannual Meetings & Challenges */}
            <section className="section" style={{ background: 'var(--bg-off)' }}>
                <div className="container">
                    <div className="roles-grid" style={{ marginTop: 0, gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                        
                        {/* Meetings */}
                        <div>
                            <p className="section-eyebrow">Collaboration</p>
                            <h2 style={{ marginBottom: '1.5rem' }}>NFA Biannual Meetings</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                The Alliance convenes twice yearly to review programme implementation, discuss technical updates, strengthen coordination, review compliance, and agree on strategic actions.
                            </p>
                            
                            <div className="table-container" style={{ marginTop: '1rem' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Year</th>
                                            <th>June Meeting Host</th>
                                            <th>December Meeting Host</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MEETINGS.map((m, idx) => (
                                            <tr key={idx}>
                                                <td><strong>{m.year}</strong></td>
                                                <td>{m.june}</td>
                                                <td>{m.december}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Challenges */}
                        <div>
                            <p className="section-eyebrow" style={{ color: 'var(--wfp-red, #dc2626)' }}>Transparency</p>
                            <h2 style={{ marginBottom: '1.5rem' }}>Industry Challenges</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                Identifying and addressing operational hurdles is critical. The NFA actively works to mitigate the following identified industry challenges:
                            </p>
                            <div className="challenges-grid">
                                {CHALLENGES.map((challenge, idx) => (
                                    <div key={idx} className="challenge-item">
                                        {challenge}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Full Membership Categories */}
                    <div className="membership-section">
                        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Broad Participation</p>
                        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Membership of the NFA</h2>
                        
                        <div className="membership-grid">
                            <div className="member-cat-card">
                                <h4><Icon name="landmark" size={18} /> Government (MDAs)</h4>
                                <ul className="member-list">
                                    {MEMBERSHIP.mdas.map((m, i) => (
                                        <li key={i}>
                                            {typeof m === 'object' && m.logo && <img src={m.logo} alt="" className="member-logo-mini" />}
                                            {typeof m === 'object' ? m.name : m}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="member-cat-card">
                                <h4><Icon name="factory" size={18} /> Industry Stakeholders</h4>
                                <ul className="member-list">
                                    {MEMBERSHIP.industry.map((m, i) => <li key={i}>{m}</li>)}
                                </ul>
                            </div>
                            <div className="member-cat-card">
                                <h4><Icon name="graduation-cap" size={18} /> Professional Bodies</h4>
                                <ul className="member-list">
                                    {MEMBERSHIP.professional.map((m, i) => <li key={i}>{m}</li>)}
                                </ul>
                            </div>
                            <div className="member-cat-card">
                                <h4><Icon name="heart-handshake" size={18} /> Development Partners</h4>
                                <ul className="member-list">
                                    {MEMBERSHIP.partners.map((m, i) => (
                                        <li key={i}>
                                            {typeof m === 'object' && m.logo && <img src={m.logo} alt="" className="member-logo-mini" />}
                                            {typeof m === 'object' ? m.name : m}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="member-cat-card">
                                <h4><Icon name="megaphone" size={18} /> Academia & Media</h4>
                                <ul className="member-list">
                                    {MEMBERSHIP.others.map((m, i) => <li key={i}>{m}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}
