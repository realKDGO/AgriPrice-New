  import "../../styles/dashboard.css";

  const stats = [
    { id: "total", label: "Total user accounts", value: "10", icon: "users" },
    { id: "mao", label: "Active MAO accounts", value: "2", icon: "userCog" },
    { id: "suspended", label: "Suspended accounts", value: "0", icon: "shield" },
    {
      id: "environment",
      label: "System environment",
      value: "Available",
      note: "No live backend connected",
      icon: "pulse",
      large: true,
    },
  ];

  const services = [
    { name: "Frontend", status: "Available", ok: true },
    { name: "Backend API", status: "Not connected", ok: false },
    { name: "Database", status: "Not connected", ok: false },
  ];

  const activities = [
    {
      account: "AgriPrice user",
      activity: "Added users record",
      date: "2026-09-06 12:29",
      result: "Success",
    },
    {
      account: "Juan dela Cruz",
      activity: "Signed in to farmer Account",
      date: "2026-09-05 08:20",
      result: "Success",
    },
    {
      account: "Elena Reyes",
      activity: "Reviewed price submissions",
      date: "2026-09-05 08:00",
      result: "Success",
    },
    {
      account: "System Administrator",
      activity: "Reviewed account access",
      date: "2026-09-04 15:10",
      result: "Success",
    },
  ];

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

    switch (name) {
      case "users":
        return (
          <svg {...props}>
            <circle cx="9" cy="8" r="3.2" />
            <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            <path d="M16 4.6a3.2 3.2 0 0 1 0 6.2" />
            <path d="M18 14.4c1.8.8 3 2.7 3 5.6" />
          </svg>
        );
      case "userCog":
        return (
          <svg {...props}>
            <circle cx="9" cy="8" r="3.2" />
            <path d="M3 20c0-3.3 2.7-6 6-6 1.2 0 2.3.3 3.2.9" />
            <circle cx="18" cy="17" r="2.2" />
            <path d="M18 12.8v1.1M18 20.1v1.1M14.4 17h1.1M20.5 17h1.1M15.5 14.5l.8.8M19.7 18.7l.8.8M15.5 19.5l.8-.8M19.7 15.3l.8-.8" />
          </svg>
        );
      case "shield":
        return (
          <svg {...props}>
            <path d="M12 3 5 6v5.5c0 4.4 2.9 8 7 9.5 4.1-1.5 7-5.1 7-9.5V6l-7-3Z" />
          </svg>
        );
      case "pulse":
        return (
          <svg {...props}>
            <path d="M3 12h4l3-8 4 16 3-8h4" />
          </svg>
        );
      case "bell":
        return (
          <svg {...props}>
            <path d="M6 9a6 6 0 1 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9Z" />
            <path d="M10 20a2 2 0 0 0 4 0" />
          </svg>
        );
      case "arrow":
        return (
          <svg {...props} width={16} height={16}>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        );
      default:
        return null;
    }
  }

  function StatCard({ label, value, note, icon, large }) {
    return (
      <article className="stat-card">
        <div className="stat-card__top">
          <span className="stat-card__label">{label}</span>
          <span className="stat-card__icon">
            <Icon name={icon} />
          </span>
        </div>
        <strong className={large ? "stat-card__value stat-card__value--large" : "stat-card__value"}>
          {value}
        </strong>
        {note && <span className="stat-card__note">{note}</span>}
      </article>
    );
  }

  export default function AdminDashboard() {
    return (
      <div className="admin">
        <header className="admin__header">
          <h1 className="admin__title">Admin Dashboard</h1>
          <button type="button" className="admin__bell" aria-label="Notifications">
            <Icon name="bell" />
          </button>
        </header>

        <main className="admin__body">
          <p className="admin__subtitle">
            Manage accounts, review activity, and monitor the application.
          </p>

          <section className="admin__stats" aria-label="Summary">
            {stats.map((stat) => (
              <StatCard key={stat.id} {...stat} />
            ))}
          </section>

          <section className="admin__panels">
            <article className="panel">
              <div className="panel__head">
                <h2 className="panel__title">Service status</h2>
                <a href="#service-details" className="link">
                  View details
                  <Icon name="arrow" />
                </a>
              </div>
              <ul className="service-list">
                {services.map((service) => (
                  <li key={service.name} className="service-list__item">
                    <span className="service-list__name">{service.name}</span>
                    <span
                      className={
                        service.ok
                          ? "badge badge--ok"
                          : "badge badge--off"
                      }
                    >
                      {service.status}
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="panel">
              <h2 className="panel__title">Access administration</h2>
              <p className="panel__text">
                Review account status and role responsibilities. Agricultural
                records are managed in the MAO Account.
              </p>
              <div className="panel__actions">
                <button type="button" className="chip">
                  User accounts
                </button>
                <button type="button" className="chip">
                  Roles &amp; access
                </button>
              </div>
            </article>
          </section>

          <section className="panel activity">
            <div className="panel__head">
              <h2 className="panel__title">Recent system activity</h2>
              <a href="#audit-logs" className="link">
                All audit logs
                <Icon name="arrow" />
              </a>
            </div>

            <div className="activity__scroll">
              <table className="activity__table">
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>Activity</th>
                    <th>Date &amp; time</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((row) => (
                    <tr key={`${row.account}-${row.date}`}>
                      <td>{row.account}</td>
                      <td>{row.activity}</td>
                      <td>{row.date}</td>
                      <td>
                        <span className="result">{row.result}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    );
  }
