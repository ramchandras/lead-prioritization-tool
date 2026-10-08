import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Download,
  Users,
  TrendingUp,
  Target,
  Building2,
  MapPin,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  Globe,
  Mail,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface Lead {
  id: number;
  companyName: string;
  website: string;
  industry: string;
  location: string;
  employeeCount: number;
  email: string;
  leadScore: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [expandedLead, setExpandedLead] = useState<number | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
  try {
    const response = await axios.get(
      "https://lead-prioritization-tool.onrender.com/api/leads"
    );

    setLeads(response.data.leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
  }
};

  // -----------------------------
  // Filter leads
  // -----------------------------

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.companyName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPriority =
      priority === "" || lead.priority === priority;

    const matchesIndustry =
      industry === "" || lead.industry === industry;

    const matchesLocation =
      location === "" || lead.location === location;

    return (
      matchesSearch &&
      matchesPriority &&
      matchesIndustry &&
      matchesLocation
    );
  });

  // -----------------------------
  // Statistics
  // -----------------------------

  const highCount = leads.filter(
    (lead) => lead.priority === "HIGH"
  ).length;

  const mediumCount = leads.filter(
    (lead) => lead.priority === "MEDIUM"
  ).length;

  const lowCount = leads.filter(
    (lead) => lead.priority === "LOW"
  ).length;

  const averageScore =
    leads.length > 0
      ? Math.round(
          leads.reduce(
            (total, lead) => total + lead.leadScore,
            0
          ) / leads.length
        )
      : 0;

  const leadQuality =
    averageScore >= 75
      ? "Excellent pipeline"
      : averageScore >= 60
      ? "Strong pipeline"
      : averageScore >= 40
      ? "Moderate pipeline"
      : "Needs qualification";

  // -----------------------------
  // Score explanation
  // -----------------------------

  const getScoreReasons = (lead: Lead) => {
    const reasons: string[] = [];

    if (lead.industry === "SaaS") {
      reasons.push("SaaS industry");
    } else if (lead.industry === "Software") {
      reasons.push("Software industry");
    }

    if (lead.location === "California") {
      reasons.push("California");
    }

    if (lead.employeeCount >= 100) {
      reasons.push(`${lead.employeeCount}+ employees`);
    } else if (lead.employeeCount >= 50) {
      reasons.push(`${lead.employeeCount}+ employees`);
    }

    if (lead.website) {
      reasons.push("Website available");
    }

    if (lead.email) {
      reasons.push("Email available");
    }

    return reasons;
  };

  // -----------------------------
  // CSV Export
  // -----------------------------

  const exportCSV = () => {
    const headers = [
      "Company",
      "Industry",
      "Location",
      "Employees",
      "Score",
      "Priority",
      "Website",
      "Email",
    ];

    const rows = filteredLeads.map((lead) => [
      lead.companyName,
      lead.industry,
      lead.location,
      lead.employeeCount,
      lead.leadScore,
      lead.priority,
      lead.website,
      lead.email,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "leadiq-leads.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#070b17] text-white">

      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/2 h-80 w-80 rounded-full bg-purple-600/5 blur-3xl" />
      </div>

      {/* ========================= */}
      {/* NAVBAR */}
      {/* ========================= */}

      <header className="relative border-b border-white/10 bg-[#090e1c]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-5 py-4 lg:px-8">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Target
                size={21}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Lead<span className="text-cyan-400">IQ</span>
              </h1>

              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Lead intelligence
              </p>
            </div>

          </div>

          {/* Navbar right */}
          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-400 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Engine active
            </div>

            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02]"
            >
              <Download size={15} />
              Export
            </button>

          </div>

        </div>

      </header>

      {/* ========================= */}
      {/* MAIN */}
      {/* ========================= */}

      <main className="relative mx-auto max-w-[1450px] px-5 py-7 lg:px-8">

        {/* ========================= */}
        {/* HERO */}
        {/* ========================= */}

        <section className="mb-7">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>

              <div className="mb-3 flex items-center gap-2 text-xs font-medium text-cyan-400">
                <Sparkles size={14} />
                AI-powered lead prioritization
              </div>

              <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">

                Find the leads
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}worth pursuing.
                </span>

              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Identify high-value prospects faster with transparent
                lead scoring, smart filtering, and actionable contact data.
              </p>

            </div>

            {/* Lead Quality */}
            <div className="min-w-[250px] rounded-2xl border border-white/10 bg-[#101729]/90 p-5 shadow-xl shadow-black/20">

              <div className="mb-3 flex items-center justify-between">

                <div className="flex items-center gap-2">
                  <Zap
                    size={15}
                    className="text-cyan-400"
                  />

                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Lead quality
                  </span>
                </div>

                <span className="text-xs text-slate-600">
                  {leads.length} leads
                </span>

              </div>

              <div className="flex items-end justify-between">

                <div>

                  <p className="text-4xl font-bold text-white">
                    {averageScore}
                    <span className="text-lg text-slate-600">
                      /100
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-cyan-400">
                    {leadQuality}
                  </p>

                </div>

                <div className="relative flex h-14 w-14 items-center justify-center">

                  <svg
                    className="h-14 w-14 -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-slate-800"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0-31.831"
                    />

                    <path
                      className="text-cyan-400"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${averageScore}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0-31.831"
                    />
                  </svg>

                  <span className="absolute text-[10px] font-bold text-white">
                    AI
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ========================= */}
        {/* STAT CARDS */}
        {/* ========================= */}

        <section className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <StatCard
            title="Total Leads"
            value={leads.length}
            icon={<Users size={19} />}
            description="All prospects"
          />

          <StatCard
            title="High Priority"
            value={highCount}
            icon={<Target size={19} />}
            description="Strongest opportunities"
            accent="cyan"
          />

          <StatCard
            title="Medium Priority"
            value={mediumCount}
            icon={<TrendingUp size={19} />}
            description="Potential opportunities"
            accent="blue"
          />

          <StatCard
            title="Low Priority"
            value={lowCount}
            icon={<Building2 size={19} />}
            description="Needs qualification"
            accent="purple"
          />

        </section>

        {/* ========================= */}
        {/* SEARCH / FILTER */}
        {/* ========================= */}

        <section className="mb-6 rounded-2xl border border-white/10 bg-[#101729]/90 p-4 shadow-xl shadow-black/20">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <h3 className="text-sm font-semibold text-white">
                Lead discovery
              </h3>

              <p className="mt-1 text-xs text-slate-600">
                Search and filter your prospect database
              </p>

            </div>

            <span className="text-xs text-slate-600">
              {filteredLeads.length} results
            </span>

          </div>

          {/* Search */}
          <div className="relative mb-4">

            <Search
              size={17}
              className="absolute left-4 top-3.5 text-slate-600"
            />

            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#080d1a] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/10"
            />

          </div>

          {/* Filters */}
          <div className="flex flex-col gap-2.5 lg:flex-row">

            <DarkSelect
              value={industry}
              onChange={setIndustry}
              options={[
                ["", "All Industries"],
                ["SaaS", "SaaS"],
                ["Software", "Software"],
                ["Technology", "Technology"],
                ["Retail", "Retail"],
              ]}
            />

            <DarkSelect
              value={location}
              onChange={setLocation}
              options={[
                ["", "All Locations"],
                ["California", "California"],
                ["Texas", "Texas"],
                ["New York", "New York"],
              ]}
            />

            <div className="flex flex-wrap gap-2">

              {["", "HIGH", "MEDIUM", "LOW"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => setPriority(item)}
                    className={`rounded-lg border px-4 py-2.5 text-xs font-semibold transition ${
                      priority === item
                        ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-[#080d1a] text-slate-500 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {item === "" ? "All" : item}
                  </button>
                )
              )}

            </div>

          </div>

        </section>

        {/* ========================= */}
        {/* LEAD TABLE */}
        {/* ========================= */}

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#101729]/95 shadow-2xl shadow-black/20">

          {/* Table header */}
          <div className="flex flex-col justify-between gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center">

            <div>

              <h3 className="text-sm font-semibold text-white">
                Lead pipeline
              </h3>

              <p className="mt-1 text-xs text-slate-600">
                Ranked by AI lead score
              </p>

            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">

              <CheckCircle2
                size={13}
                className="text-emerald-400"
              />

              {filteredLeads.length} qualified results

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px] text-left">

              <thead className="border-b border-white/10 bg-[#0b1120]">

                <tr>

                  <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                    Company
                  </th>

                  <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                    Industry
                  </th>

                  <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                    Location
                  </th>

                  <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                    AI Score
                  </th>

                  <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                    Priority
                  </th>

                  <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                    Why?
                  </th>

                  <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                    Contact
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => {

                    const reasons = getScoreReasons(lead);

                    const isExpanded =
                      expandedLead === lead.id;

                    return (
                      <tr
                        key={lead.id}
                        className="border-b border-white/5 transition hover:bg-white/[0.025]"
                      >

                        {/* Company */}
                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 text-xs font-bold text-cyan-300">
                              {lead.companyName.charAt(0)}
                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-semibold text-white">
                                {lead.companyName}
                              </p>

                              <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-600">

                                <span>
                                  {lead.employeeCount} employees
                                </span>

                                {lead.website && (
                                  <>
                                    <span>•</span>

                                    <a
                                      href={lead.website}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-1 hover:text-cyan-400"
                                    >
                                      <Globe size={10} />
                                      Website
                                      <ArrowUpRight size={9} />
                                    </a>
                                  </>
                                )}

                              </div>

                            </div>

                          </div>

                        </td>

                        {/* Industry */}
                        <td className="px-4 py-4">

                          <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-slate-400">
                            {lead.industry}
                          </span>

                        </td>

                        {/* Location */}
                        <td className="px-4 py-4">

                          <div className="flex items-center gap-1.5 text-xs text-slate-500">

                            <MapPin
                              size={13}
                              className="text-slate-700"
                            />

                            {lead.location}

                          </div>

                        </td>

                        {/* Score */}
                        <td className="px-4 py-4">

                          <div className="flex items-center gap-2.5">

                            <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-800">

                              <div
                                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                                style={{
                                  width: `${lead.leadScore}%`,
                                }}
                              />

                            </div>

                            <span className="text-base font-bold text-white">
                              {lead.leadScore}
                            </span>

                          </div>

                        </td>

                        {/* Priority */}
                        <td className="px-4 py-4">

                          <PriorityBadge
                            priority={lead.priority}
                          />

                        </td>

                        {/* Why */}
                        <td className="px-4 py-4">

                          <div className="relative">

                            <button
                              onClick={() =>
                                setExpandedLead(
                                  isExpanded
                                    ? null
                                    : lead.id
                                )
                              }
                              className="flex items-center gap-2 rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-2.5 py-2 text-[10px] font-medium text-cyan-300 transition hover:border-cyan-400/30"
                            >
                              <Sparkles size={11} />

                              {reasons.length} factors

                              <ChevronDown
                                size={11}
                                className={`transition ${
                                  isExpanded
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>

                            {isExpanded && (
                              <div className="absolute left-0 top-10 z-20 w-52 rounded-xl border border-white/10 bg-[#151d31] p-3 shadow-2xl">

                                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                  Score factors
                                </p>

                                <div className="space-y-1.5">

                                  {reasons.map(
                                    (
                                      reason,
                                      index
                                    ) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-2 text-[10px] text-slate-300"
                                      >
                                        <CheckCircle2
                                          size={11}
                                          className="shrink-0 text-cyan-400"
                                        />

                                        {reason}
                                      </div>
                                    )
                                  )}

                                </div>

                              </div>
                            )}

                          </div>

                        </td>

                        {/* Contact */}
                        <td className="px-5 py-4">

                          {lead.email ? (
                            <a
                              href={`mailto:${lead.email}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300"
                            >
                              <Mail size={12} />
                              Email
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-700">
                              Not available
                            </span>
                          )}

                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>

                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center"
                    >

                      <Search
                        size={30}
                        className="mx-auto mb-3 text-slate-700"
                      />

                      <p className="text-sm font-medium text-slate-300">
                        No leads found
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Try changing your search or filters.
                      </p>

                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* Table footer */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 px-5 py-4 sm:flex-row">

            <p className="text-[10px] text-slate-700">
              LeadIQ prioritization engine • Transparent scoring
            </p>

            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-[10px] font-semibold text-white shadow-lg shadow-blue-500/10 transition hover:from-cyan-400 hover:to-blue-500"
            >
              <Download size={13} />
              Export filtered leads
            </button>

          </div>

        </section>

        {/* Footer */}
        <footer className="py-7 text-center text-[10px] text-slate-700">
          LeadIQ • AI-assisted lead prioritization
        </footer>

      </main>
    </div>
  );
}

/* ================================= */
/* STAT CARD                         */
/* ================================= */

function StatCard({
  title,
  value,
  icon,
  description,
  accent = "slate",
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  accent?: "slate" | "cyan" | "blue" | "purple";
}) {
  const accentStyles = {
    slate: "text-slate-400 bg-slate-400/10",
    cyan: "text-cyan-400 bg-cyan-400/10",
    blue: "text-blue-400 bg-blue-400/10",
    purple: "text-purple-400 bg-purple-400/10",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101729]/90 p-4 shadow-xl shadow-black/10 transition hover:border-white/15">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs text-slate-600">
            {title}
          </p>

          <p className="mt-1.5 text-2xl font-bold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-slate-700">
            {description}
          </p>

        </div>

        <div
          className={`rounded-xl p-2.5 ${accentStyles[accent]}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

/* ================================= */
/* DARK SELECT                       */
/* ================================= */

function DarkSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="relative">

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-white/10 bg-[#080d1a] px-4 py-2.5 pr-9 text-xs text-slate-400 outline-none focus:border-cyan-400/40 lg:w-48"
      >

        {options.map(([optionValue, label]) => (
          <option
            key={optionValue}
            value={optionValue}
            className="bg-[#101729]"
          >
            {label}
          </option>
        ))}

      </select>

      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-3 text-slate-700"
      />

    </div>
  );
}

/* ================================= */
/* PRIORITY BADGE                    */
/* ================================= */

function PriorityBadge({
  priority,
}: {
  priority: "HIGH" | "MEDIUM" | "LOW";
}) {
  const styles = {
    HIGH: "border-red-400/20 bg-red-400/10 text-red-300",
    MEDIUM:
      "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
    LOW: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

export default App;