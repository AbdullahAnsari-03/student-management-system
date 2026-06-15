import { useEffect, useState } from "react";
import { getStudents, deleteStudent } from "../services/studentService";
import { toast } from "react-hot-toast";
import {
  Search,
  Edit3,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  Layers,
  FileText
} from "lucide-react";

function StudentList({ setSelectedStudent, setRefreshTrigger, refreshTrigger }) {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeProfile, setActiveProfile] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, [page, refreshTrigger]);

  const fetchStudents = async () => {
    try {
      const data = await getStudents(page, 5);
      setStudents(data.students);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await deleteStudent(id);
      toast.success("Student Deleted Successfully!");
      fetchStudents();
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete student");
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return "ST";
    const parts = name.trim().split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Helper to color fallback avatars based on name characters
  const getAvatarColorClass = (name) => {
    const colors = [
      "bg-indigo-100 text-indigo-700 border-indigo-200",
      "bg-emerald-100 text-emerald-700 border-emerald-200",
      "bg-pink-100 text-pink-700 border-pink-200",
      "bg-amber-100 text-amber-700 border-amber-200",
      "bg-violet-100 text-violet-700 border-violet-200",
    ];
    if (!name) return colors[0];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white shadow-xs border border-slate-100 rounded-2xl p-6">
        {/* Header Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Active Registrations</h3>
            <p className="text-xs text-slate-400 mt-1">
              Showing {filteredStudents.length} of {students.length} students on page {page}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium focus:border-indigo-500 focus:outline-hidden transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="p-4.5">Student Profile</th>
                <th className="p-4.5">Admission No</th>
                <th className="p-4.5">Course Details</th>
                <th className="p-4.5">Gender</th>
                <th className="p-4.5">Contact</th>
                <th className="p-4.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/70 transition-colors duration-150"
                  >
                    {/* Student Identity */}
                    <td className="p-4.5">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 shrink-0">
                          {student.photo_url ? (
                            <img
                              src={`http://localhost:5000${student.photo_url}`}
                              alt={student.name}
                              className="h-11 w-11 rounded-full object-cover border border-slate-100 shadow-xs"
                            />
                          ) : (
                            <div className={`h-11 w-11 rounded-full border flex items-center justify-center font-bold text-xs tracking-wide shadow-xs ${getAvatarColorClass(student.name)}`}>
                              {getInitials(student.name)}
                            </div>
                          )}
                        </div>
                        <div>
                          <button
                            onClick={() => setActiveProfile(student)}
                            className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer text-left focus:outline-hidden"
                          >
                            {student.name}
                          </button>
                          <span className="block text-xs text-slate-400 mt-0.5 font-medium">
                            Joined System
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Admission Number */}
                    <td className="p-4.5 font-semibold text-slate-700">
                      <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800 border border-slate-200/40">
                        {student.admission_number}
                      </span>
                    </td>

                    {/* Course and Year */}
                    <td className="p-4.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                          <GraduationCap size={15} className="text-slate-400" />
                          <span>{student.course}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                          <Layers size={13} />
                          <span>Year {student.year}</span>
                        </div>
                      </div>
                    </td>

                    {/* Gender badge */}
                    <td className="p-4.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          student.gender === "Male"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-100/50"
                            : "bg-pink-50 text-pink-700 border border-pink-100/50"
                        }`}
                      >
                        {student.gender}
                      </span>
                    </td>

                    {/* Contact Email */}
                    <td className="p-4.5">
                      <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <Mail size={14} className="text-slate-400" />
                        <span className="truncate max-w-[180px]">{student.email}</span>
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="p-4.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        {/* View Button */}
                        <button
                          onClick={() => setActiveProfile(student)}
                          title="View Profile"
                          className="h-8.5 w-8.5 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => setSelectedStudent(student)}
                          title="Edit Student"
                          className="h-8.5 w-8.5 flex items-center justify-center rounded-lg text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors cursor-pointer"
                        >
                          <Edit3 size={16} />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(student.id)}
                          title="Delete Student"
                          className="h-8.5 w-8.5 flex items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400 font-medium">
                    {searchTerm ? "No students matching your search." : "No registered students in directory."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Navigation */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
          <div className="text-xs text-slate-400 font-medium">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-45 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-extrabold px-2 shadow-2xs">
              {page}
            </span>

            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-45 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Student Details Card Modal */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-scale-in">
            {/* Header backdrop color banner */}
            <div className="h-24 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
              <button
                onClick={() => setActiveProfile(null)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Profile Avatar offset */}
            <div className="px-6 pb-6 relative">
              <div className="flex justify-between items-end -mt-12 mb-4">
                <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden shadow-md shrink-0 bg-white">
                  {activeProfile.photo_url ? (
                    <img
                      src={`http://localhost:5000${activeProfile.photo_url}`}
                      alt={activeProfile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className={`h-full w-full flex items-center justify-center font-bold text-2xl tracking-wide ${getAvatarColorClass(activeProfile.name)}`}>
                      {getInitials(activeProfile.name)}
                    </div>
                  )}
                </div>
                <span className="inline-flex items-center rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                  {activeProfile.admission_number}
                </span>
              </div>

              {/* Profile Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900">{activeProfile.name}</h4>
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-1">
                    <GraduationCap size={14} />
                    <span>{activeProfile.course} &bull; Year {activeProfile.year}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Gender</span>
                    <div className="flex items-center gap-1.5 text-slate-800">
                      <User size={14} className="text-slate-400" />
                      <span>{activeProfile.gender}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Date of Birth</span>
                    <div className="flex items-center gap-1.5 text-slate-800">
                      <Calendar size={14} className="text-slate-400" />
                      <span>{activeProfile.dob ? new Date(activeProfile.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Email Address</span>
                    <div className="flex items-center gap-1.5 text-slate-800">
                      <Mail size={14} className="text-slate-400" />
                      <span className="truncate max-w-[180px]">{activeProfile.email}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Mobile Phone</span>
                    <div className="flex items-center gap-1.5 text-slate-800">
                      <Phone size={14} className="text-slate-400" />
                      <span>{activeProfile.mobile || "N/A"}</span>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-1.5 border-t border-slate-50 pt-3">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Residential Address</span>
                    <div className="flex items-start gap-1.5 text-slate-800 leading-relaxed font-medium">
                      <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>{activeProfile.address || "No address provided"}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex gap-3.5">
                  <button
                    onClick={() => {
                      setSelectedStudent(activeProfile);
                      setActiveProfile(null);
                    }}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Edit Student
                  </button>
                  <button
                    onClick={() => {
                      const id = activeProfile.id;
                      setActiveProfile(null);
                      handleDelete(id);
                    }}
                    className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs py-2.5 rounded-xl transition-colors border border-rose-100/50 cursor-pointer text-center"
                  >
                    Delete Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;