    import { useState } from "react";
    import "../../styles/monitoring.css";

    const STATUS = {
    AVAILABLE: "available",
    UNAVAILABLE: "unavailable",
    };

    const STATUS_LABEL = {
    [STATUS.AVAILABLE]: "Available",
    [STATUS.UNAVAILABLE]: "Unavailable",
    };

    const INITIAL_SERVICES = [
    {
        id: "frontend",
        name: "Frontend application",
        status: STATUS.AVAILABLE,
        messages: {
        [STATUS.AVAILABLE]: "Application service is available.",
        [STATUS.UNAVAILABLE]: "Application service is currently unavailable.",
        },
    },
    {
        id: "api",
        name: "API service",
        status: STATUS.UNAVAILABLE,
        messages: {
        [STATUS.AVAILABLE]: "API service is available.",
        [STATUS.UNAVAILABLE]: "Service status is currently unavailable.",
        },
    },
    {
        id: "database",
        name: "Database connectivity",
        status: STATUS.UNAVAILABLE,
        messages: {
        [STATUS.AVAILABLE]: "Database connection is available.",
        [STATUS.UNAVAILABLE]: "Connectivity status is currently unavailable.",
        },
    },
    {
        id: "forecasting",
        name: "Forecasting service",
        status: STATUS.AVAILABLE,
        messages: {
        [STATUS.AVAILABLE]: "Forecast information is available.",
        [STATUS.UNAVAILABLE]: "Forecast information is currently unavailable.",
        },
    },
    ];

    function checkLocalStatus(services) {
    return new Promise((resolve) => {
        setTimeout(() => {
        resolve(
            Object.fromEntries(services.map(({ id, status }) => [id, status]))
        );
        }, 600);
    });
    }

    function BellIcon() {
    return (
        <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
    );
    }

    function ServiceRow({ name, status, messages }) {
    const isAvailable = status === STATUS.AVAILABLE;

    return (
        <li className="sm-row">
        <div className="sm-info">
            <h2 className="sm-name">{name}</h2>
            <p className="sm-desc">{messages[status]}</p>
        </div>
        <span
            className={`sm-badge ${isAvailable ? "sm-badge--ok" : "sm-badge--down"}`}
        >
            {STATUS_LABEL[status]}
        </span>
        </li>
    );
    }

    export default function SystemMonitoring() {
    const [services, setServices] = useState(INITIAL_SERVICES);
    const [loading, setLoading] = useState(false);
    const [checkState, setCheckState] = useState(STATUS.AVAILABLE);

    const handleRefresh = async () => {
        setLoading(true);
        try {
        const result = await checkLocalStatus(services);
        setServices((current) =>
            current.map((service) => ({
            ...service,
            status: result[service.id] ?? service.status,
            }))
        );
        setCheckState(STATUS.AVAILABLE);
        } catch {
        setCheckState(STATUS.UNAVAILABLE);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="sm-page">
        <header className="sm-header">
            <h1 className="sm-title">System Monitoring</h1>
            <button className="sm-bell" type="button" aria-label="Notifications">
            <BellIcon />
            </button>
        </header>

        <div className="sm-hero">
            <section className="sm-banner">
            <p className="sm-banner-text">Service status overview.</p>
            <button
                className="sm-refresh"
                type="button"
                onClick={handleRefresh}
                disabled={loading}
            >
                {loading ? "Checking…" : "Refresh local status"}
            </button>
            </section>

            <main className="sm-card">
            <ul className="sm-list">
                {services.map((service) => (
                <ServiceRow key={service.id} {...service} />
                ))}
            </ul>
            <p className="sm-footer">
                Last status check: {loading ? "Checking" : STATUS_LABEL[checkState]}.
            </p>
            </main>
        </div>
        </div>
    );
    }
