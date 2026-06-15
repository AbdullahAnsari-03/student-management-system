import { useState, useEffect } from "react";
import AddStudent from "./pages/AddStudent";
import StudentList from "./pages/StudentList";
import ActivityLogs from "./pages/ActivityLogs";
import { getStudents, getActivityLogs } from "./services/studentService";
import { Toaster } from "react-hot-toast";
import {
  LayoutDashboard,
  Users,
  History,
  Plus,
  TrendingUp,
  UserCheck,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
  Menu,
  X,
  Activity
} from "lucide-react";

function App() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [stats, setStats] = useState({
    totalStudents: 0,
    maleCount: 0,
    femaleCount: 0,
    uniqueCourses: 0,
    totalLogs: 0,
    recentLogs: [],
    allLogs: [],
  });

  // Keep time updated
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch metrics dynamically when data refreshes
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const studentData = await getStudents(1, 1000);
        const logsData = await getActivityLogs();

        const students = studentData.students || [];
        const total = studentData.total || students.length;

        const male = students.filter(s => s.gender === 'Male').length;
        const female = students.filter(s => s.gender === 'Female').length;

        const courses = new Set(students.map(s => s.course?.trim().toLowerCase()).filter(Boolean));

        setStats({
          totalStudents: total,
          maleCount: male,
          femaleCount: female,
          uniqueCourses: courses.size,
          totalLogs: logsData.length,
          recentLogs: logsData.slice(0, 4),
          allLogs: logsData,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, [refreshTrigger]);

  // Handle open modal automatically if student is selected for edit
  useEffect(() => {
    if (selectedStudent) {
      setIsAddModalOpen(true);
    }
  }, [selectedStudent]);

  const handleCloseModal = () => {
    setSelectedStudent(null);
    setIsAddModalOpen(false);
  };

  const getTrendData = () => {
    const days = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d);
    }

    const createLogs = (stats.allLogs || []).filter((log) => log.action === "CREATE");
    const mockCounts = [2, 3, 5, 4, 6];
    const hasAnyCreateLogs = createLogs.length > 0;

    return days.map((day, index) => {
      const dateStr = day.toDateString();
      const actualCount = createLogs.filter((log) => new Date(log.created_at).toDateString() === dateStr).length;
      const count = hasAnyCreateLogs ? actualCount : mockCounts[index];
      const label = day.toLocaleDateString("en-US", { month: "long", day: "numeric" });
      return { label, count };
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Student Directory", icon: Users },
    { id: "logs", label: "Activity Audit Log", icon: History },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-900 text-slate-200 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:static`}
      >
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white text-xl shadow-lg shadow-indigo-600/30">
              S
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight text-white leading-none">ScholarFlow</h1>
              <span className="text-xs text-slate-400 font-medium">Management Hub</span>
            </div>
          </div>
          <button
            className="rounded-lg p-1.5 hover:bg-slate-800 lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-4.5 rounded-xl px-4.5 py-3.5 text-sm font-semibold transition-all duration-200 ${isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  }`}
              >
                <Icon size={20} className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 rounded-xl bg-slate-800/40 p-3">
            <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-200 text-sm">
              AA
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Administrator</h4>
              <p className="text-[10px] text-slate-400">admin@scholarflow.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="flex h-20 items-center justify-between border-b border-slate-100 bg-white px-6 lg:px-10 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-900 capitalize">
                {activeTab === "dashboard" ? "Dashboard Overview" : activeTab === "students" ? "Student Directory" : "Activity Audit Log"}
              </h2>
              <p className="text-xs text-slate-400 hidden sm:block">
                {currentTime.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-sm font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200 cursor-pointer"
            >
              <Plus size={18} />
              <span>Add Student</span>
            </button>
          </div>
        </header>

        {/* Dynamic Views */}
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
          {activeTab === "dashboard" && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white shadow-xl shadow-indigo-500/10">
                <div className="relative z-10 max-w-xl space-y-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-xs">
                    <Activity size={12} /> System Status: Online
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                    {getGreeting()}, Admin!
                  </h3>
                  <p className="text-indigo-100 text-sm leading-relaxed font-medium">
                    Welcome back to ScholarFlow.
                  </p>
                </div>
                {/* Visual Accent Shapes */}
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                <div className="absolute right-12 bottom-0 -mb-20 h-48 w-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total Students Card */}
                <div className="flex items-center gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Users size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400">Total Registered</span>
                    <h4 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalStudents}</h4>
                  </div>
                </div>

                {/* Unique Courses Card */}
                <div className="flex items-center gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400">Active Courses</span>
                    <h4 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.uniqueCourses}</h4>
                  </div>
                </div>

                {/* Audit logs count */}
                <div className="flex items-center gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <History size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400">Audit Log Records</span>
                    <h4 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalLogs}</h4>
                  </div>
                </div>
              </div>

              {/* Dashboard Subgrid */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left Stack */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  {/* Gender Distribution Card */}
                  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-6">
                      <h4 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
                        <UserCheck size={16} className="text-indigo-600" />
                        Gender Ratio
                      </h4>
                    </div>

                    {stats.totalStudents > 0 ? (
                      <div className="space-y-6">
                        <div className="flex h-4.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            style={{ width: `${(stats.maleCount / stats.totalStudents) * 100}%` }}
                            className="bg-indigo-500 transition-all duration-500"
                          />
                          <div
                            style={{ width: `${(stats.femaleCount / stats.totalStudents) * 100}%` }}
                            className="bg-pink-500 transition-all duration-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-xl bg-indigo-50/55 p-3 text-center border border-indigo-50/20">
                            <span className="block text-xs font-semibold text-indigo-700">Male</span>
                            <span className="text-lg font-extrabold text-indigo-950 mt-1 block">
                              {stats.maleCount} ({Math.round((stats.maleCount / stats.totalStudents) * 100)}%)
                            </span>
                          </div>
                          <div className="rounded-xl bg-pink-50/55 p-3 text-center border border-pink-50/20">
                            <span className="block text-xs font-semibold text-pink-700">Female</span>
                            <span className="text-lg font-extrabold text-pink-950 mt-1 block">
                              {stats.femaleCount} ({Math.round((stats.femaleCount / stats.totalStudents) * 100)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <p className="text-sm text-slate-400 font-medium">No students registered yet.</p>
                        <button
                          onClick={() => setIsAddModalOpen(true)}
                          className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                        >
                          Register the first student
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Unicode Registration Trends Card */}
                  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                      <h4 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
                        <Activity size={16} className="text-indigo-600" />
                        Registration Trends
                      </h4>
                    </div>
                    <div className="font-mono text-xs space-y-3 pt-2">
                      {getTrendData().map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                          <span className="w-20 text-slate-400 font-semibold">{item.label}</span>
                          <span className="text-indigo-600 font-bold select-none text-sm tracking-wide">
                            {item.count > 0 ? "█".repeat(item.count) : <span className="text-slate-200">-</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Logs Summary Card */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-5">
                    <h4 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
                      <History size={16} className="text-indigo-600" />
                      Recent Actions Audit
                    </h4>
                    <button
                      onClick={() => setActiveTab("logs")}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                    >
                      View All <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="flow-root">
                    {stats.recentLogs.length > 0 ? (
                      <ul className="-mb-8">
                        {stats.recentLogs.map((log, logIdx) => {
                          const isLast = logIdx === stats.recentLogs.length - 1;
                          let actionColor = "bg-slate-100 text-slate-700 border-slate-200";
                          if (log.action === "CREATE") actionColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                          if (log.action === "UPDATE") actionColor = "bg-amber-50 text-amber-700 border-amber-100";
                          if (log.action === "DELETE") actionColor = "bg-rose-50 text-rose-700 border-rose-100";

                          return (
                            <li key={log.id}>
                              <div className="relative pb-8">
                                {!isLast && (
                                  <span
                                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100"
                                    aria-hidden="true"
                                  />
                                )}
                                <div className="relative flex space-x-3">
                                  <div>
                                    <span className={`h-8 w-8 rounded-full border flex items-center justify-center text-[10px] font-bold ${actionColor}`}>
                                      {log.action}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                                    <div>
                                      <p className="text-sm text-slate-600 font-medium">
                                        Admin performed <span className="font-bold text-slate-900">{log.action}</span> for student{" "}
                                        <span className="font-semibold text-indigo-600">{log.student_name}</span>
                                      </p>
                                    </div>
                                    <div className="text-right text-xs whitespace-nowrap text-slate-400 font-medium">
                                      {new Date(log.created_at).toLocaleTimeString(undefined, {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-sm text-slate-400 font-medium">No actions recorded in logs.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "students" && (
            <StudentList
              setSelectedStudent={setSelectedStudent}
              setRefreshTrigger={setRefreshTrigger}
              refreshTrigger={refreshTrigger}
            />
          )}

          {activeTab === "logs" && (
            <ActivityLogs refreshTrigger={refreshTrigger} />
          )}
        </main>
      </div>

      {/* Add / Edit Student Modal */}
      {(isAddModalOpen || selectedStudent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-100 animate-slide-up">
            <AddStudent
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
              setRefreshTrigger={setRefreshTrigger}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;