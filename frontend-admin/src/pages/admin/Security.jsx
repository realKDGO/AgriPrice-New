    import "../../styles/security.css";

    const accountStatus = [
    { label: "Active accounts", value: 10 },
    { label: "Suspended accounts", value: 0 },
    ];

    const securityControls = [
    { name: "Server-enforced role authorization", status: "Not connected" },
    { name: "Password hashing and secure sessions", status: "Not connected" },
    { name: "Rate limiting and security event collection", status: "Not connected" },
    ];

    const securityEvents = [];

    function Icon({ name }) {
    const props = {
        width: 20,
        height: 20,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
    };

    if (name === "bell") {
        return (
        <svg {...props}>
            <path d="M6 9a6 6 0 1 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9Z" />
            <path d="M10 20a2 2 0 0 0 4 0" />
        </svg>
        );
    }

    if (name === "search") {
        return (
        <svg {...props} width={32} height={32}>
            <circle cx="11" cy="11" r="6.5" />
            <path d="m20 20-4.2-4.2" />
        </svg>
        );
    }

    return null;
    }

    export default function Security() {
    return (
        <div className="security">
        <header className="security__header">
            <h1 className="security__title">Security</h1>
            <button type="button" className="security__bell" aria-label="Notifications">
            <Icon name="bell" />
            </button>
        </header>

        <main className="security__body">
            <p className="security__subtitle">
            Account security information and integration status.
            </p>

            <section className="security__panels">
            <article className="security-panel">
                <h2 className="security-panel__title">Account status</h2>
                <ul className="security-list">
                {accountStatus.map((item) => (
                    <li key={item.label} className="security-list__item">
                    <span className="security-list__name">{item.label}</span>
                    <span className="security-list__value">{item.value}</span>
                    </li>
                ))}
                </ul>
                <p className="security-panel__note">
                Use account management to suspend or reactivate accounts.
                </p>
            </article>

            <article className="security-panel">
                <h2 className="security-panel__title">Production security controls</h2>
                <ul className="security-list">
                {securityControls.map((control) => (
                    <li key={control.name} className="security-list__item">
                    <span className="security-list__name">{control.name}</span>
                    <span className="security-badge">{control.status}</span>
                    </li>
                ))}
                </ul>
            </article>
            </section>

            <section className="security-panel security-events">
            <h2 className="security-panel__title">Recorded security events</h2>

            {securityEvents.length === 0 ? (
                <div className="security-empty">
                <span className="security-empty__icon">
                    <Icon name="search" />
                </span>
                <p className="security-empty__title">No matching records</p>
                <p className="security-empty__text">Try changing your search or filters.</p>
                </div>
            ) : (
                <ul className="security-list">
                {securityEvents.map((event) => (
                    <li key={event.id} className="security-list__item">
                    <span className="security-list__name">{event.description}</span>
                    <span className="security-list__value">{event.date}</span>
                    </li>
                ))}
                </ul>
            )}
            </section>
        </main>
        </div>
    );
    }
