
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { Icons } from '../../constants';
import { Teacher, ClassDetails } from '../../types';
import { mockTeachers as initialMockTeachers, mockClasses } from '../../services/mockData';

const AdminTeachersPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<Teacher[]>(initialMockTeachers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<Partial<Teacher>>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    assignedClasses: [],
    qualification: '',
    dateOfJoining: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);

  const formInputStyle = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-academic-blue focus:border-academic-blue sm:text-sm " + 
                         "bg-white text-gray-900 placeholder-gray-500 border-gray-300 " + // Light mode
                         "dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 " + // Dark mode
                         "hc-bg-secondary hc-text-primary hc-border-primary hc-placeholder-text"; // HC mode


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "assignedClasses") {
        const selectedOptions = (e.target as HTMLSelectElement).selectedOptions;
        const classIds = Array.from(selectedOptions).map(option => option.value);
        setFormData(prev => ({ ...prev, assignedClasses: classIds }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetFormData = () => {
    setFormData({
        name: '', email: '', phone: '', subject: '',
        assignedClasses: [], qualification: '', dateOfJoining: ''
    });
  };

  const openAddModal = () => {
    setEditingTeacher(null);
    resetFormData();
    setIsModalOpen(true);
  };

  const openEditModal = (teacherToEdit: Teacher) => {
    setEditingTeacher(teacherToEdit);
    setFormData({ ...teacherToEdit });
    setIsModalOpen(true);
  };

  const handleSubmitTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.subject) {
        alert("Name and Subject are required.");
        return;
    }

    if (editingTeacher) { // Handle Edit
        const updatedTeacher: Teacher = {
            ...editingTeacher,
            ...formData,
            name: formData.name!,
            subject: formData.subject!,
            assignedClasses: formData.assignedClasses || editingTeacher.assignedClasses,
        };
        const updatedTeachers = teachers.map(t => t.id === editingTeacher.id ? updatedTeacher : t);
        setTeachers(updatedTeachers);

        const globalIndex = initialMockTeachers.findIndex(t => t.id === editingTeacher.id);
        if (globalIndex !== -1) initialMockTeachers[globalIndex] = updatedTeacher;
        
        alert("Teacher details updated successfully!");

    } else { // Handle Add
        const fullNewTeacher: Teacher = {
            id: `T${Date.now().toString().slice(-4)}`,
            name: formData.name!,
            subject: formData.subject!,
            assignedClasses: formData.assignedClasses || [],
            email: formData.email,
            phone: formData.phone,
            qualification: formData.qualification,
            dateOfJoining: formData.dateOfJoining,
            photoUrl: `https://picsum.photos/seed/${formData.name?.split(' ')[0]}/100/100`
        };
        setTeachers(prev => [fullNewTeacher, ...prev]);
        initialMockTeachers.unshift(fullNewTeacher);
        alert("Teacher added successfully!");
    }
    
    setIsModalOpen(false);
    resetFormData();
    setEditingTeacher(null);
  };

  const openViewModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsViewModalOpen(true);
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">Manage Teachers</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search teachers..."
            className={`${formInputStyle} w-full sm:w-auto !mt-0`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={openAddModal} leftIcon={<Icons.Teachers className="w-5 h-5"/>}>
            Add Teacher
          </Button>
        </div>
      </div>

      <Card className="overflow-x-auto">
        {filteredTeachers.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 hc-divide-border-primary">
            <thead className="bg-gray-50 dark:bg-gray-700 hc-bg-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Classes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 hc-bg-secondary hc-divide-border-primary">
              {filteredTeachers.map(teacher => (
                <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 hc-hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={teacher.photoUrl || `https://ui-avatars.com/api/?name=${teacher.name.replace(' ', '+')}&background=random`} alt={teacher.name} className="w-10 h-10 rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 hc-text-primary">{teacher.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hc-text-secondary">{teacher.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hc-text-secondary">{teacher.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hc-text-secondary">{teacher.assignedClasses.join(', ')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => openViewModal(teacher)}>View</Button>
                    <Button size="sm" variant="outline" onClick={() => openEditModal(teacher)}>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8 hc-text-secondary">No teachers found{searchTerm && ' matching your search'}.</p>
        )}
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTeacher(null); resetFormData();}} title={editingTeacher ? "Edit Teacher" : "Add New Teacher"} size="lg">
        <form onSubmit={handleSubmitTeacher} className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Full Name*</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className={formInputStyle} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Email</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className={formInputStyle} />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Phone</label>
              <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className={formInputStyle} />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Primary Subject*</label>
              <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleInputChange} required className={formInputStyle} />
            </div>
            <div>
              <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Qualification</label>
              <input type="text" name="qualification" id="qualification" value={formData.qualification} onChange={handleInputChange} className={formInputStyle} />
            </div>
            <div>
              <label htmlFor="dateOfJoining" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Date of Joining</label>
              <input type="date" name="dateOfJoining" id="dateOfJoining" value={formData.dateOfJoining} onChange={handleInputChange} className={formInputStyle} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="assignedClasses" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Assign to Classes</label>
              <select
                multiple
                name="assignedClasses"
                id="assignedClasses"
                value={formData.assignedClasses}
                onChange={handleInputChange}
                className={`${formInputStyle} h-24`}
              >
                {mockClasses.map(c => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 hc-text-secondary">Hold Ctrl (or Cmd on Mac) to select multiple.</p>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => { setIsModalOpen(false); setEditingTeacher(null); resetFormData();}}>Cancel</Button>
            <Button type="submit" variant="primary">{editingTeacher ? "Save Changes" : "Add Teacher"}</Button>
          </div>
        </form>
      </Modal>

      {selectedTeacher && (
        <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={`Teacher Details: ${selectedTeacher.name}`} size="lg">
          <div className="space-y-3 text-gray-700 dark:text-gray-300 hc-text-secondary">
            <div className="flex justify-center mb-4">
                 <img src={selectedTeacher.photoUrl || `https://ui-avatars.com/api/?name=${selectedTeacher.name.replace(' ', '+')}&background=random`} alt={selectedTeacher.name} className="w-24 h-24 rounded-full shadow-md" />
            </div>
            <p><strong>ID:</strong> {selectedTeacher.id}</p>
            <p><strong>Name:</strong> <span className="text-gray-900 dark:text-gray-100 hc-text-primary">{selectedTeacher.name}</span></p>
            <p><strong>Subject:</strong> {selectedTeacher.subject}</p>
            <p><strong>Email:</strong> {selectedTeacher.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {selectedTeacher.phone || 'N/A'}</p>
            <p><strong>Qualification:</strong> {selectedTeacher.qualification || 'N/A'}</p>
            <p><strong>Date of Joining:</strong> {selectedTeacher.dateOfJoining ? new Date(selectedTeacher.dateOfJoining).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Assigned Classes:</strong> {selectedTeacher.assignedClasses.join(', ') || 'None'}</p>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminTeachersPage;