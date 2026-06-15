import { useEffect, useState } from "react";
import { getActivityLogs } from "../services/studentService";
import {
  Plus,
  Trash2,
  Calendar,
  Clock,
  Filter,
  UserCheck,
  RefreshCw,
  UserPlus,
  UserX,
  History
} from "lucide-react";

function ActivityLogs({ refreshTrigger }) {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchLogs();
  }, [refreshTrigger]);

  const fetchLogs = async () => {
    try {
      const data = await getActivityLogs();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === "ALL") return true;
    return log.action === filter;
  });

  const getActionDetails = (action) => {
    switch (action) {
      case "CREATE":
        return {
          icon: UserPlus,
          colorClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
          text: "Registration Created",
          desc: "registered as a new student",
        };
      case "UPDATE":
        return {
          icon: RefreshCw,
          colorClass: "bg-amber-50 text-amber-600 border-amber-100",
          text: "Profile Updated",
          desc: "profile details updated",
        };
      case "DELETE":
        return {
          icon: UserX,
          colorClass: "bg-rose-50 text-rose-600 border-rose-100",
          text: "Record Deleted",
          desc: "academic record removed from directory",
        };
      default:
        return {
          icon: History,
          colorClass: "bg-slate-50 text-slate-600 border-slate-100",
          text: "Action Logged",
          desc: "action performed on student record",
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white shadow-xs border border-slate-100 rounded-2xl p-6">
        {/* Header and Filter */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-50 pb-5 mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">System Audit Log</h3>
            <p className="text-xs text-slate-400 mt-1">
              Historical activity timeline of operations on student data
            </p>
          </div>

          {/* Action Filter Pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1.5">
              <Filter size={13} />
              Filter:
            </span>
            {["ALL", "CREATE", "UPDATE", "DELETE"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filter === type
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                {type === "ALL" ? "All Actions" : type}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Container */}
        <div className="flow-root px-2">
          {filteredLogs.length > 0 ? (
            <ul className="-mb-8">
              {filteredLogs.map((log, logIdx) => {
                const isLast = logIdx === filteredLogs.length - 1;
                const { icon: Icon, colorClass, text, desc } = getActionDetails(log.action);

                return (
                  <li key={log.id}>
                    <div className="relative pb-8">
                      {/* Vertical connector line */}
                      {!isLast && (
                        <span
                          className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-slate-100"
                          aria-hidden="true"
                        />
                      )}

                      <div className="relative flex items-start space-x-4">
                        {/* Timeline Circle Node */}
                        <div className="shrink-0">
                          <div className={`h-10 w-10 rounded-full border flex items-center justify-center shadow-2xs ${colorClass}`}>
                            <Icon size={16} />
                          </div>
                        </div>

                        {/* Event Content card */}
                        <div className="min-w-0 flex-1 bg-slate-50/45 border border-slate-100 rounded-2xl p-4.5 hover:bg-slate-50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                            <span className="text-xs font-extrabold text-slate-900 tracking-tight">
                              {text}
                            </span>
                            <div className="flex items-center gap-3.5 text-xs text-slate-400 font-medium">
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {new Date(log.created_at).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {new Date(log.created_at).toLocaleTimeString(undefined, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-slate-600 font-medium leading-relaxed">
                            System administrator has {desc}:{" "}
                            <span className="font-extrabold text-indigo-600">{log.student_name}</span>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100/50 mb-3.5">
                <History size={20} />
              </div>
              <h4 className="text-sm font-bold text-slate-900">No Logs Found</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                There are no matching activities registered in the audit history logs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityLogs;