import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Plus,
  RefreshCw,
  School,
  Send,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import { getDashboardSummary, askCopilot } from "./services/api";

const demoData = {
  overall_metrics: {
    numeracy: 67,
    literacy: 71.5,
    attendance: 86.1,
    dropout: 4.5,
  },

  priority_schools: [
    {
      school_id: "SCH008",
      school_name: "Govt Primary School H",
      block: "Block B",
      numeracy_score: 47,
      literacy_score: 55,
      attendance_rate: 76,
      teacher_training_score: 61,
      infrastructure_score: 58,
      dropout_rate: 9.1,
      enrollment: 128,
      priority_score: 45.79,
    },
    {
      school_id: "SCH014",
      school_name: "Govt Primary School N",
      block: "Block D",
      numeracy_score: 49,
      literacy_score: 54,
      attendance_rate: 78,
      teacher_training_score: 59,
      infrastructure_score: 61,
      dropout_rate: 8.3,
      enrollment: 132,
      priority_score: 44.81,
    },
    {
      school_id: "SCH019",
      school_name: "Govt Primary School S",
      block: "Block E",
      numeracy_score: 51,
      literacy_score: 57,
      attendance_rate: 80,
      teacher_training_score: 64,
      infrastructure_score: 63,
      dropout_rate: 7.8,
      enrollment: 145,
      priority_score: 43.95,
    },
    {
      school_id: "SCH004",
      school_name: "Govt Primary School D",
      block: "Block A",
      numeracy_score: 52,
      literacy_score: 59,
      attendance_rate: 79,
      teacher_training_score: 62,
      infrastructure_score: 64,
      dropout_rate: 7.4,
      enrollment: 142,
      priority_score: 43.51,
    },
    {
      school_id: "SCH016",
      school_name: "Govt Primary School P",
      block: "Block D",
      numeracy_score: 56,
      literacy_score: 62,
      attendance_rate: 83,
      teacher_training_score: 65,
      infrastructure_score: 68,
      dropout_rate: 6.7,
      enrollment: 158,
      priority_score: 41.69,
    },
  ],

  block_summary: [
    {
      block: "Block D",
      schools: 4,
      students: 680,
      numeracy: 62.5,
      literacy: 67.2,
      attendance: 84.2,
      dropout: 5.5,
    },
    {
      block: "Block A",
      schools: 4,
      students: 685,
      numeracy: 64.5,
      literacy: 70.2,
      attendance: 86,
      dropout: 4.5,
    },
    {
      block: "Block B",
      schools: 4,
      students: 719,
      numeracy: 67.8,
      literacy: 71.8,
      attendance: 85.5,
      dropout: 4.6,
    },
    {
      block: "Block E",
      schools: 4,
      students: 740,
      numeracy: 68.2,
      literacy: 72.5,
      attendance: 86.5,
      dropout: 4.3,
    },
    {
      block: "Block C",
      schools: 4,
      students: 769,
      numeracy: 72,
      literacy: 75.8,
      attendance: 88.2,
      dropout: 3.5,
    },
  ],
};

const initialActions = [
  {
    id: 1,
    title: "Teacher training intervention",
    school: "Govt Primary School H",
    block: "Block B",
    owner: "Education Officer",
    priority: "High",
    status: "In Progress",
    due: "30 Sep 2026",
  },
  {
    id: 2,
    title: "Attendance improvement review",
    school: "Govt Primary School N",
    block: "Block D",
    owner: "Block Education Officer",
    priority: "High",
    status: "Planned",
    due: "04 Oct 2026",
  },
  {
    id: 3,
    title: "Foundational literacy support",
    school: "Govt Primary School S",
    block: "Block E",
    owner: "Cluster Coordinator",
    priority: "Medium",
    status: "Planned",
    due: "08 Oct 2026",
  },
];

function App() {
  const [data, setData] = useState(demoData);
  const [actions, setActions] = useState(initialActions);
  const [activePage, setActivePage] = useState("overview");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const result = await getDashboardSummary();

      if (result) {
        setData((previous) => ({
          ...previous,
          ...result,
        }));
      }
    } catch {
      console.log("Using local prototype data.");
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
      />

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-menu-button">
            <button onClick={() => setMobileMenu(true)}>
              <Menu size={22} />
            </button>
          </div>

          <div>
            <div className="breadcrumb">Education Intelligence / Dashboard</div>
            <h1>
              {activePage === "overview"
                ? "District Overview"
                : activePage === "schools"
                ? "Priority Schools"
                : activePage === "blocks"
                ? "Block Comparison"
                : "Action Tracker"}
            </h1>
          </div>

          <div className="topbar-right">
            <button className="icon-button" onClick={loadDashboard}>
              <RefreshCw size={18} />
            </button>

            <div className="user-profile">
              <CircleUserRound size={32} />
              <div>
                <strong>Education Officer</strong>
                <span>District Administration</span>
              </div>
            </div>
          </div>
        </header>

        {activePage === "overview" && (
          <Overview
            data={data}
            actions={actions}
            setActivePage={setActivePage}
            setCopilotOpen={setCopilotOpen}
          />
        )}

        {activePage === "schools" && (
          <SchoolsPage
            schools={data.priority_schools}
            setCopilotOpen={setCopilotOpen}
          />
        )}

        {activePage === "blocks" && (
          <BlocksPage blocks={data.block_summary} />
        )}

        {activePage === "actions" && (
          <ActionsPage actions={actions} setActions={setActions} />
        )}
      </main>

      {copilotOpen && (
        <Copilot
          onClose={() => setCopilotOpen(false)}
        />
      )}
    </div>
  );
}

function Sidebar({
  activePage,
  setActivePage,
  mobileMenu,
  setMobileMenu,
}) {
  const items = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "schools",
      label: "Priority Schools",
      icon: School,
    },
    {
      id: "blocks",
      label: "Block Comparison",
      icon: BarChart3,
    },
    {
      id: "actions",
      label: "Action Tracker",
      icon: ClipboardCheck,
    },
  ];

  return (
    <>
      {mobileMenu && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenu ? "mobile-visible" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={25} />
          </div>

          <div>
            <strong>ShikshaPulse</strong>
            <span>AI</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="platform-label">EDUCATION INTELLIGENCE</div>

        <nav>
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`nav-item ${
                  activePage === item.id ? "active" : ""
                }`}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenu(false);
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="ai-status">
            <div className="status-dot" />
            <div>
              <strong>AI System Online</strong>
              <span>Local AI engine</span>
            </div>
          </div>

          <div className="prototype-note">
            <span>Prototype</span>
            <p>
              Data shown is synthetic and intended for demonstration.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

function Overview({
  data,
  actions,
  setActivePage,
  setCopilotOpen,
}) {
  const metrics = data.overall_metrics;

  return (
    <div className="page">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">DISTRICT EDUCATION COMMAND CENTER</p>
          <h2>Turn education data into action.</h2>
          <p className="subtitle">
            Monitor learning outcomes, identify priority schools and
            coordinate targeted interventions.
          </p>
        </div>

        <button
          className="ai-button"
          onClick={() => setCopilotOpen(true)}
        >
          <Bot size={19} />
          Ask AI Copilot
        </button>
      </section>

      <section className="metric-grid">
        <MetricCard
          title="Numeracy"
          value={`${metrics.numeracy}%`}
          icon={<Target />}
          change="-3.2%"
          negative
          description="Average learning score"
        />

        <MetricCard
          title="Literacy"
          value={`${metrics.literacy}%`}
          icon={<GraduationCap />}
          change="+1.8%"
          description="Average learning score"
        />

        <MetricCard
          title="Attendance"
          value={`${metrics.attendance}%`}
          icon={<Users />}
          change="+0.9%"
          description="Average attendance rate"
        />

        <MetricCard
          title="Dropout"
          value={`${metrics.dropout}%`}
          icon={<TrendingUp />}
          change="-0.6%"
          description="Average dropout rate"
          negative
          inverse
        />
      </section>

      <section className="dashboard-grid">
        <div className="card priority-card">
          <CardHeader
            title="Priority Schools"
            subtitle="Schools requiring closer attention"
            action="View all"
            onAction={() => setActivePage("schools")}
          />

          <div className="priority-list">
            {data.priority_schools.slice(0, 5).map((school, index) => (
              <PrioritySchool
                key={school.school_id}
                school={school}
                rank={index + 1}
              />
            ))}
          </div>
        </div>

        <div className="card insight-card">
          <CardHeader
            title="AI Priority Insight"
            subtitle="Generated from current indicators"
          />

          <div className="insight-highlight">
            <AlertTriangle size={20} />
            <div>
              <strong>Block D needs closer monitoring</strong>
              <p>
                Block D records 62.5% numeracy, 67.2% literacy,
                84.2% attendance and 5.5% dropout.
              </p>
            </div>
          </div>

          <div className="insight-points">
            <div>
              <span>01</span>
              <p>
                Govt Primary School N has a 54% literacy score and
                8.3% dropout rate.
              </p>
            </div>

            <div>
              <span>02</span>
              <p>
                Govt Primary School H shows particularly low
                attendance at 76%.
              </p>
            </div>

            <div>
              <span>03</span>
              <p>
                Teacher training scores indicate an area for
                targeted support.
              </p>
            </div>
          </div>

          <button
            className="outline-button full-width"
            onClick={() => setCopilotOpen(true)}
          >
            <MessageSquare size={17} />
            Explore with AI
          </button>
        </div>
      </section>

      <section className="dashboard-grid lower-grid">
        <BlockComparisonMini
          blocks={data.block_summary}
          onView={() => setActivePage("blocks")}
        />

        <ActionSummary
          actions={actions}
          onView={() => setActivePage("actions")}
        />
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  change,
  negative,
  description,
  inverse,
}) {
  const isPositive = inverse ? negative : !negative;

  return (
    <div className="metric-card">
      <div className="metric-top">
        <div className="metric-icon">{icon}</div>

        <span className={`change ${isPositive ? "positive" : "negative"}`}>
          {isPositive ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
          {change}
        </span>
      </div>

      <div className="metric-value">{value}</div>
      <div className="metric-title">{title}</div>
      <div className="metric-description">{description}</div>
    </div>
  );
}

function PrioritySchool({ school, rank }) {
  return (
    <div className="priority-school">
      <div className="school-rank">{String(rank).padStart(2, "0")}</div>

      <div className="school-info">
        <strong>{school.school_name}</strong>
        <span>
          {school.school_id} · {school.block}
        </span>
      </div>

      <div className="school-metric">
        <span>Numeracy</span>
        <strong>{school.numeracy_score}%</strong>
      </div>

      <div className="school-metric">
        <span>Attendance</span>
        <strong>{school.attendance_rate}%</strong>
      </div>

      <div className="priority-score">
        <span>Priority</span>
        <strong>{school.priority_score}</strong>
      </div>

      <ChevronRight size={17} className="school-arrow" />
    </div>
  );
}

function CardHeader({ title, subtitle, action, onAction }) {
  return (
    <div className="card-header">
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      {action && (
        <button className="text-button" onClick={onAction}>
          {action}
          <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}

function BlockComparisonMini({ blocks, onView }) {
  const max = Math.max(...blocks.map((b) => b.numeracy));

  return (
    <div className="card">
      <CardHeader
        title="Block Comparison"
        subtitle="Learning outcomes across blocks"
        action="View details"
        onAction={onView}
      />

      <div className="block-bars">
        {blocks.map((block) => (
          <div className="block-row" key={block.block}>
            <div className="block-label">
              <strong>{block.block}</strong>
              <span>{block.numeracy}% numeracy</span>
            </div>

            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${(block.numeracy / max) * 100}%`,
                }}
              />
            </div>

            <strong className="bar-value">{block.numeracy}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionSummary({ actions, onView }) {
  const completed = actions.filter(
    (a) => a.status === "Completed"
  ).length;

  return (
    <div className="card">
      <CardHeader
        title="Action Tracker"
        subtitle={`${completed} completed · ${actions.length} total`}
        action="Manage actions"
        onAction={onView}
      />

      <div className="action-mini-list">
        {actions.map((action) => (
          <div className="action-mini" key={action.id}>
            <div
              className={`action-status ${action.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {action.status === "Completed" ? (
                <CheckCircle2 size={17} />
              ) : (
                <Activity size={17} />
              )}
            </div>

            <div>
              <strong>{action.title}</strong>
              <span>
                {action.school} · Due {action.due}
              </span>
            </div>

            <PriorityBadge priority={action.priority} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SchoolsPage({ schools, setCopilotOpen }) {
  return (
    <div className="page">
      <section className="page-intro">
        <div>
          <p className="eyebrow">DATA-DRIVEN PRIORITIZATION</p>
          <h2>Priority Schools</h2>
          <p className="subtitle">
            Schools ranked using the prototype priority scoring model.
          </p>
        </div>

        <button
          className="ai-button"
          onClick={() => setCopilotOpen(true)}
        >
          <Bot size={18} />
          Analyze with AI
        </button>
      </section>

      <div className="card table-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>School</th>
                <th>Block</th>
                <th>Numeracy</th>
                <th>Literacy</th>
                <th>Attendance</th>
                <th>Dropout</th>
                <th>Priority</th>
              </tr>
            </thead>

            <tbody>
              {schools.map((school) => (
                <tr key={school.school_id}>
                  <td>
                    <div className="table-school">
                      <strong>{school.school_name}</strong>
                      <span>{school.school_id}</span>
                    </div>
                  </td>

                  <td>{school.block}</td>

                  <td>
                    <ScoreValue value={school.numeracy_score} />
                  </td>

                  <td>
                    <ScoreValue value={school.literacy_score} />
                  </td>

                  <td>{school.attendance_rate}%</td>

                  <td>
                    <span className="danger-value">
                      {school.dropout_rate}%
                    </span>
                  </td>

                  <td>
                    <span className="priority-number">
                      {school.priority_score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="data-note">
        <AlertTriangle size={17} />
        <span>
          Priority scores are prototype heuristics for demonstration,
          not official government scoring.
        </span>
      </div>
    </div>
  );
}

function ScoreValue({ value }) {
  return (
    <span className={value < 60 ? "danger-value" : ""}>
      {value}%
    </span>
  );
}

function BlocksPage({ blocks }) {
  const max = Math.max(...blocks.map((b) => b.literacy));

  return (
    <div className="page">
      <section className="page-intro">
        <div>
          <p className="eyebrow">REGIONAL COMPARISON</p>
          <h2>Block Performance</h2>
          <p className="subtitle">
            Compare learning, attendance and dropout indicators
            across blocks.
          </p>
        </div>
      </section>

      <div className="block-card-grid">
        {blocks.map((block) => (
          <div className="card block-performance" key={block.block}>
            <div className="block-heading">
              <div>
                <span>BLOCK</span>
                <h3>{block.block}</h3>
              </div>

              <div className="school-count">
                <School size={16} />
                {block.schools} schools
              </div>
            </div>

            <div className="performance-bars">
              <PerformanceBar
                label="Numeracy"
                value={block.numeracy}
                max={100}
              />

              <PerformanceBar
                label="Literacy"
                value={block.literacy}
                max={100}
              />

              <PerformanceBar
                label="Attendance"
                value={block.attendance}
                max={100}
              />
            </div>

            <div className="block-footer">
              <div>
                <span>Students</span>
                <strong>{block.students}</strong>
              </div>

              <div>
                <span>Dropout</span>
                <strong>{block.dropout}%</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PerformanceBar({ label, value, max }) {
  return (
    <div className="performance-row">
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>

      <div className="bar-track">
        <div
          className="bar-fill"
          style={{
            width: `${Math.min((value / max) * 100, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

function ActionsPage({ actions, setActions }) {
  const [showForm, setShowForm] = useState(false);

  function updateStatus(id, status) {
    setActions((current) =>
      current.map((action) =>
        action.id === id ? { ...action, status } : action
      )
    );
  }

  function addAction(event) {
    event.preventDefault();

    const form = new FormData(event.target);

    const newAction = {
      id: Date.now(),
      title: form.get("title"),
      school: form.get("school"),
      block: form.get("block"),
      owner: form.get("owner"),
      priority: form.get("priority"),
      status: "Planned",
      due: form.get("due"),
    };

    setActions((current) => [newAction, ...current]);
    setShowForm(false);
    event.target.reset();
  }

  return (
    <div className="page">
      <section className="page-intro">
        <div>
          <p className="eyebrow">FROM INSIGHT TO EXECUTION</p>
          <h2>Action Tracker</h2>
          <p className="subtitle">
            Assign ownership, track progress and monitor interventions.
          </p>
        </div>

        <button
          className="ai-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          New Action
        </button>
      </section>

      {showForm && (
        <div className="card action-form-card">
          <div className="card-header">
            <div>
              <h3>Create Action</h3>
              <p>Assign a practical intervention.</p>
            </div>

            <button
              className="icon-button"
              onClick={() => setShowForm(false)}
            >
              <X size={18} />
            </button>
          </div>

          <form className="action-form" onSubmit={addAction}>
            <input
              name="title"
              placeholder="Action title"
              required
            />

            <input
              name="school"
              placeholder="School"
              required
            />

            <input
              name="block"
              placeholder="Block"
              required
            />

            <input
              name="owner"
              placeholder="Owner"
              required
            />

            <select name="priority" defaultValue="Medium">
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <input
              name="due"
              placeholder="Due date"
              required
            />

            <button className="primary-button" type="submit">
              Create Action
            </button>
          </form>
        </div>
      )}

      <div className="card action-table-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>School</th>
                <th>Owner</th>
                <th>Priority</th>
                <th>Due</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {actions.map((action) => (
                <tr key={action.id}>
                  <td>
                    <strong>{action.title}</strong>
                  </td>

                  <td>
                    {action.school}
                    <br />
                    <small>{action.block}</small>
                  </td>

                  <td>{action.owner}</td>

                  <td>
                    <PriorityBadge priority={action.priority} />
                  </td>

                  <td>{action.due}</td>

                  <td>
                    <select
                      className="status-select"
                      value={action.status}
                      onChange={(event) =>
                        updateStatus(action.id, event.target.value)
                      }
                    >
                      <option>Planned</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span className={`priority-badge ${priority.toLowerCase()}`}>
      {priority}
    </span>
  );
}

function Copilot({ onClose }) {
  const [question, setQuestion] = useState(
    "Which areas appear to need the most attention, and what practical actions should an education officer consider?"
  );

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Hello. I am ShikshaPulse AI Copilot. I can analyze education indicators and translate them into practical actions.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const suggestions = [
    "Which areas need the most attention?",
    "Why is Block D a priority?",
    "What actions should we take first?",
  ];

  async function sendQuestion(customQuestion) {
    const finalQuestion = customQuestion || question;

    if (!finalQuestion.trim() || loading) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text: finalQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const result = await askCopilot(finalQuestion);

      const answer =
        result?.analysis?.answer ||
        result?.answer ||
        "The AI service returned no answer.";

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: answer,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            "The local AI service is currently unavailable. The dashboard is still operational using the available education data.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="copilot-overlay">
      <div className="copilot-panel">
        <div className="copilot-header">
          <div className="copilot-title">
            <div className="copilot-icon">
              <Bot size={21} />
            </div>

            <div>
              <strong>ShikshaPulse AI Copilot</strong>
              <span>
                Evidence-grounded education intelligence
              </span>
            </div>
          </div>

          <button className="icon-button" onClick={onClose}>
            <X size={19} />
          </button>
        </div>

        <div className="copilot-body">
          <div className="suggestion-list">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => sendQuestion(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role}`}
              >
                {message.role === "assistant" && (
                  <div className="message-icon">
                    <Bot size={15} />
                  </div>
                )}

                <div className="message-bubble">
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message assistant">
                <div className="message-icon">
                  <Bot size={15} />
                </div>

                <div className="message-bubble typing">
                  Analyzing education data...
                </div>
              </div>
            )}
          </div>
        </div>

        <form
          className="copilot-input"
          onSubmit={(event) => {
            event.preventDefault();
            sendQuestion();
          }}
        >
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask about schools, blocks or interventions..."
          />

          <button type="submit" disabled={loading}>
            <Send size={18} />
          </button>
        </form>

        <div className="copilot-disclaimer">
          AI recommendations should be reviewed by an authorized
          education officer before action.
        </div>
      </div>
    </div>
  );
}

export default App;