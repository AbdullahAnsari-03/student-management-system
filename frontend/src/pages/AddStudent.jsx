import { useEffect, useState } from "react";
import { createStudent, updateStudent, uploadPhoto } from "../services/studentService";
import { toast } from "react-hot-toast";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  Layers,
  Upload,
  Image as ImageIcon,
  UserCheck,
  UserPlus
} from "lucide-react";

function AddStudent({ selectedStudent, setSelectedStudent, setRefreshTrigger, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    year: "",
    dob: "",
    email: "",
    mobile: "",
    gender: "",
    address: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (selectedStudent) {
      setFormData({
        name: selectedStudent.name,
        course: selectedStudent.course,
        year: selectedStudent.year,
        dob: selectedStudent.dob?.split("T")[0] || "",
        email: selectedStudent.email,
        mobile: selectedStudent.mobile,
        gender: selectedStudent.gender,
        address: selectedStudent.address,
      });

      setEditingId(selectedStudent.id);
      if (selectedStudent.photo_url) {
        setPhotoPreview(`http://localhost:5000${selectedStudent.photo_url}`);
      } else {
        setPhotoPreview(null);
      }
    } else {
      setFormData({
        name: "",
        course: "",
        year: "",
        dob: "",
        email: "",
        mobile: "",
        gender: "",
        address: "",
      });
      setEditingId(null);
      setPhoto(null);
      setPhotoPreview(null);
    }
  }, [selectedStudent]);

  // Handle local image file preview
  useEffect(() => {
    if (!photo) return;
    const objectUrl = URL.createObjectURL(photo);
    setPhotoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.course ||
      !formData.year ||
      !formData.dob ||
      !formData.email ||
      !formData.mobile ||
      !formData.gender
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      let photo_url = "";

      if (photo) {
        const uploadResponse = await uploadPhoto(photo);
        photo_url = uploadResponse.filePath;
      }

      if (editingId) {
        await updateStudent(editingId, {
          ...formData,
          photo_url: photo_url || undefined, // keep existing photo if not updated
        });

        toast.success("Student Updated Successfully!");
      } else {
        const response = await createStudent({
          ...formData,
          photo_url,
        });

        console.log("Student Created:", response);
        toast.success("Student Added Successfully!");
      }

      setFormData({
        name: "",
        course: "",
        year: "",
        dob: "",
        email: "",
        mobile: "",
        gender: "",
        address: "",
      });

      setEditingId(null);
      setSelectedStudent(null);
      setPhoto(null);
      setPhotoPreview(null);

      setRefreshTrigger((prev) => prev + 1);
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save student");
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      {/* Form Header */}
      <div className="flex items-center justify-between bg-slate-50 px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            {editingId ? <UserCheck size={20} /> : <UserPlus size={20} />}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 tracking-tight">
              {editingId ? "Update Student Profile" : "Register Student"}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {editingId ? "Modify existing academic record details" : "Add a new record to the school directory"}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Student Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <User size={16} />
              </span>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/20 focus:bg-white pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium focus:border-indigo-500 focus:outline-hidden transition-colors"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <Mail size={16} />
              </span>
              <input
                type="email"
                name="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/20 focus:bg-white pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium focus:border-indigo-500 focus:outline-hidden transition-colors"
                required
              />
            </div>
          </div>

          {/* Course Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Course / Major *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <GraduationCap size={16} />
              </span>
              <input
                type="text"
                name="course"
                placeholder="Computer Science"
                value={formData.course}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/20 focus:bg-white pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium focus:border-indigo-500 focus:outline-hidden transition-colors"
                required
              />
            </div>
          </div>

          {/* Academic Year */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Year *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <Layers size={16} />
              </span>
              <input
                type="number"
                name="year"
                placeholder="e.g. 1, 2, 3"
                value={formData.year}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/20 focus:bg-white pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium focus:border-indigo-500 focus:outline-hidden transition-colors"
                required
              />
            </div>
          </div>

          {/* Date of birth */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date of Birth *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <Calendar size={16} />
              </span>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/20 focus:bg-white pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium focus:border-indigo-500 focus:outline-hidden transition-colors"
                required
              />
            </div>
          </div>

          {/* Mobile phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile Number *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <Phone size={16} />
              </span>
              <input
                type="text"
                name="mobile"
                placeholder="10-digit phone number"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/20 focus:bg-white pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium focus:border-indigo-500 focus:outline-hidden transition-colors"
                required
              />
            </div>
          </div>

          {/* Gender selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gender *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <User size={16} />
              </span>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/20 focus:bg-white pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium focus:border-indigo-500 focus:outline-hidden transition-colors"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Custom File Upload Container */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Photo</label>
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
                  <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview(null);
                    }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="h-12 w-12 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0 bg-slate-50/40">
                  <ImageIcon size={18} />
                </div>
              )}
              
              <label className="flex-1 border border-dashed border-slate-200 hover:border-indigo-500 bg-slate-50/20 hover:bg-indigo-50/5 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all">
                <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
                  <Upload size={14} />
                  <span>Choose portrait file</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPhoto(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Address Details */}
          <div className="col-span-1 md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Residential Address</label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-slate-400 pointer-events-none">
                <MapPin size={16} />
              </span>
              <textarea
                name="address"
                placeholder="123 Main St, Apartment 4B..."
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/20 focus:bg-white pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium focus:border-indigo-500 focus:outline-hidden transition-colors"
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all cursor-pointer"
          >
            {editingId ? "Save Changes" : "Register Student"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddStudent;