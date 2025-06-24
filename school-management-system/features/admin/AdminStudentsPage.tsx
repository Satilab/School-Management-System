
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { Icons } from '../../constants';
import { Student, ClassDetails } from '../../types';
import { mockStudents as initialMockStudents, mockClasses } from '../../services/mockData';

const AdminStudentsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>(initialMockStudents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null); 
  const [formData, setFormData] = useState<Partial<Student> & { interestsInput?: string }>({
    name: '',
    email: '',
    phone: '',
    classId: '',
    rollNumber: '',
    parentId: '',
    dateOfBirth: '',
    address: '',
    interestsInput: '',
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetFormData = () => {
    setFormData({
        name: '', email: '', phone: '', classId: '', rollNumber: '',
        parentId: '', dateOfBirth: '', address: '', interestsInput: ''
    });
  };

  const openAddModal = () => {
    setEditingStudent(null);
    resetFormData();
    setIsModalOpen(true);
  };

  const openEditModal = (studentToEdit: Student) => {
    setEditingStudent(studentToEdit);
    setFormData({
        ...studentToEdit,
        interestsInput: studentToEdit.interests.join(', ')
    });
    setIsModalOpen(true);
  };


  const handleSubmitStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.classId || !formData.rollNumber) {
        alert("Name, Class, and Roll Number are required.");
        return;
    }

    if (editingStudent) { // Handle Edit
      const updatedStudent: Student = {
        ...editingStudent,
        ...formData,
        name: formData.name!,
        classId: formData.classId!,
        class: mockClasses.find(c => c.id === formData.classId)?.name || editingStudent.class,
        section: mockClasses.find(c => c.id === formData.classId)?.section || editingStudent.section,
        rollNumber: formData.rollNumber!,
        interests: formData.interestsInput ? formData.interestsInput.split(',').map(i => i.trim()).filter(Boolean) : editingStudent.interests,
      };
      
      const updatedStudents = students.map(s => s.id === editingStudent.id ? updatedStudent : s);
      setStudents(updatedStudents);

      const globalIndex = initialMockStudents.findIndex(s => s.id === editingStudent.id);
      if (globalIndex !== -1) initialMockStudents[globalIndex] = updatedStudent;
      
      alert("Student details updated successfully!");

    } else { // Handle Add
      const fullNewStudent: Student = {
        id: `S${Date.now().toString().slice(-4)}`, 
        name: formData.name!,
        classId: formData.classId!,
        class: mockClasses.find(c => c.id === formData.classId)?.name || 'N/A',
        section: mockClasses.find(c => c.id === formData.classId)?.section || 'N/A',
        rollNumber: formData.rollNumber!,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        parentId: formData.parentId,
        dateOfBirth: formData.dateOfBirth,
        photoUrl: `https://picsum.photos/seed/${formData.name?.split(' ')[0]}/100/100`,
        interests: formData.interestsInput ? formData.interestsInput.split(',').map(i => i.trim()).filter(Boolean) : [],
        attendance: formData.attendance,
        grades: formData.grades,
      };
      setStudents(prev => [fullNewStudent, ...prev]);
      initialMockStudents.unshift(fullNewStudent); 
      alert("Student added successfully!");
    }
    
    setIsModalOpen(false);
    resetFormData();
    setEditingStudent(null);
  };

  const openViewModal = (student: Student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };
  
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.classId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">Manage Students</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search students..."
            className={`${formInputStyle} w-full sm:w-auto !mt-0`} // Use !mt-0 to override mt-1 from formInputStyle for this specific search input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={openAddModal} leftIcon={<Icons.Students className="w-5 h-5"/>}>
            Add Student
          </Button>
        </div>
      </div>

      <Card className="overflow-x-auto">
        {filteredStudents.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 hc-divide-border-primary">
            <thead className="bg-gray-50 dark:bg-gray-700 hc-bg-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Roll No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 hc-bg-secondary hc-divide-border-primary">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 hc-hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={student.photoUrl || `https://ui-avatars.com/api/?name=${student.name.replace(' ', '+')}&background=random`} alt={student.name} className="w-10 h-10 rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 hc-text-primary">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hc-text-secondary">{student.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hc-text-secondary">{student.classId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hc-text-secondary">{student.rollNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => openViewModal(student)}>View</Button>
                    <Button size="sm" variant="outline" onClick={() => openEditModal(student)}>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8 hc-text-secondary">No students found{searchTerm && ' matching your search'}.</p>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingStudent(null); resetFormData(); }} title={editingStudent ? "Edit Student" : "Add New Student"} size="lg">
        <form onSubmit={handleSubmitStudent} className="space-y-4">
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
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Date of Birth</label>
              <input type="date" name="dateOfBirth" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className={formInputStyle} />
            </div>
            <div>
              <label htmlFor="classId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Class*</label>
              <select name="classId" id="classId" value={formData.classId} onChange={handleInputChange} required className={formInputStyle}>
                <option value="">Select Class</option>
                {mockClasses.map(c => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Roll Number*</label>
              <input type="text" name="rollNumber" id="rollNumber" value={formData.rollNumber} onChange={handleInputChange} required className={formInputStyle} />
            </div>
            <div>
              <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Parent ID (Optional)</label>
              <input type="text" name="parentId" id="parentId" value={formData.parentId} onChange={handleInputChange} className={formInputStyle} />
            </div>
             <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Address</label>
              <textarea name="address" id="address" value={formData.address} onChange={handleInputChange} rows={2} className={formInputStyle} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="interestsInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Interests (comma-separated)</label>
              <textarea name="interestsInput" id="interestsInput" value={formData.interestsInput} onChange={handleInputChange} rows={2} className={formInputStyle} placeholder="e.g., Coding, Robotics, Music"/>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => { setIsModalOpen(false); setEditingStudent(null); resetFormData(); }}>Cancel</Button>
            <Button type="submit" variant="primary">{editingStudent ? "Save Changes" : "Add Student"}</Button>
          </div>
        </form>
      </Modal>

      {selectedStudent && (
        <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={`Student Details: ${selectedStudent.name}`} size="lg">
          <div className="space-y-3 text-gray-700 dark:text-gray-300 hc-text-secondary">
            <div className="flex justify-center mb-4">
                 <img src={selectedStudent.photoUrl || `https://ui-avatars.com/api/?name=${selectedStudent.name.replace(' ', '+')}&background=random`} alt={selectedStudent.name} className="w-24 h-24 rounded-full shadow-md" />
            </div>
            <p><strong>ID:</strong> {selectedStudent.id}</p>
            <p><strong>Name:</strong> <span className="text-gray-900 dark:text-gray-100 hc-text-primary">{selectedStudent.name}</span></p>
            <p><strong>Class:</strong> {selectedStudent.classId} ({selectedStudent.class} {selectedStudent.section})</p>
            <p><strong>Roll Number:</strong> {selectedStudent.rollNumber}</p>
            <p><strong>Email:</strong> {selectedStudent.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {selectedStudent.phone || 'N/A'}</p>
            <p><strong>Date of Birth:</strong> {selectedStudent.dateOfBirth ? new Date(selectedStudent.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Address:</strong> {selectedStudent.address || 'N/A'}</p>
            <p><strong>Parent ID:</strong> {selectedStudent.parentId || 'N/A'}</p>
            <p><strong>Interests:</strong> {selectedStudent.interests.join(', ') || 'N/A'}</p>
            <p><strong>Overall Attendance:</strong> {selectedStudent.attendance !== undefined ? `${selectedStudent.attendance}%` : 'N/A'}</p>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminStudentsPage;