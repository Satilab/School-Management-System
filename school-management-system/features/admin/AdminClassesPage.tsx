import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { Icons } from '../../constants';
import { ClassDetails, Teacher, Student } from '../../types';
import { mockClasses as initialMockClasses, mockTeachers, mockStudents, getTeacherById, getStudentsByClass, getClassDetailsById } from '../../services/mockData';

const AdminClassesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassDetails[]>(initialMockClasses.map(c => getClassDetailsById(c.id)!));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassDetails | null>(null);
  const [studentsInSelectedClass, setStudentsInSelectedClass] = useState<Student[]>([]);
  const [newClass, setNewClass] = useState<Partial<ClassDetails>>({
    name: '',
    section: '',
    teacherId: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);
  
  const refreshClasses = () => {
     setClasses(initialMockClasses.map(c => getClassDetailsById(c.id)!));
  }
  
  const formInputStyle = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-academic-blue focus:border-academic-blue sm:text-sm " + 
                         "bg-white text-gray-900 placeholder-gray-500 border-gray-300 " + // Light mode
                         "dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 " + // Dark mode
                         "hc-bg-secondary hc-text-primary hc-border-primary hc-placeholder-text"; // HC mode

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewClass(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.name || !newClass.section) {
        alert("Class Name and Section are required.");
        return;
    }
    const classId = `${newClass.name?.replace(/\s+/g, '')}${newClass.section}`; 
    const fullNewClass: ClassDetails = {
      id: classId,
      name: newClass.name!,
      section: newClass.section!,
      teacherId: newClass.teacherId,
      studentCount: 0, 
      students: [],
    };
    setClasses(prev => [getClassDetailsById(fullNewClass.id) || fullNewClass, ...prev]);
    initialMockClasses.unshift(fullNewClass);
    refreshClasses();
    setIsAddModalOpen(false);
    setNewClass({ name: '', section: '', teacherId: '' });
  };

  const openViewModal = (classDetail: ClassDetails) => {
    const detailedClass = getClassDetailsById(classDetail.id);
    setSelectedClass(detailedClass || classDetail);
    setStudentsInSelectedClass(getStudentsByClass(classDetail.id));
    setIsViewModalOpen(true);
  };
  
  const handleAssignTeacher = (classId: string, teacherId: string) => {
    const classIndex = initialMockClasses.findIndex(c => c.id === classId);
    if(classIndex > -1) {
        initialMockClasses[classIndex].teacherId = teacherId;
        refreshClasses(); 
        if(selectedClass && selectedClass.id === classId) {
            setSelectedClass(prev => prev ? {...prev, teacherId: teacherId, teacherName: getTeacherById(teacherId)?.name} : null);
        }
        alert(`Teacher ${getTeacherById(teacherId)?.name} assigned to class ${classId}.`);
    }
  };

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cls.teacherName && cls.teacherName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">Manage Classes</h1>
         <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search classes..."
            className={`${formInputStyle} w-full sm:w-auto !mt-0`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => setIsAddModalOpen(true)} leftIcon={<Icons.Classes className="w-5 h-5"/>}>
            Add Class
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.length > 0 ? filteredClasses.map(cls => (
          <Card key={cls.id} title={`${cls.name} - Section ${cls.section}`} className="hover:shadow-lg transition-shadow">
            <p className="text-sm text-gray-600 dark:text-gray-300 hc-text-secondary">ID: {cls.id}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 hc-text-secondary">Teacher: {cls.teacherName || 'Not Assigned'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 hc-text-secondary">Students: {cls.studentCount}</p>
            <div className="mt-4 flex justify-end">
              <Button size="sm" variant="primary" onClick={() => openViewModal(cls)}>View Details</Button>
            </div>
          </Card>
        )) : (
             <p className="text-center text-gray-500 dark:text-gray-400 py-8 md:col-span-2 lg:col-span-3 hc-text-secondary">No classes found{searchTerm && ' matching your search'}.</p>
        )}
      </div>
      
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Class" size="md">
        <form onSubmit={handleAddClass} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Class Name (e.g., Class 10)*</label>
            <input type="text" name="name" id="name" value={newClass.name} onChange={handleInputChange} required className={formInputStyle} />
          </div>
          <div>
            <label htmlFor="section" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Section (e.g., A)*</label>
            <input type="text" name="section" id="section" value={newClass.section} onChange={handleInputChange} required className={formInputStyle} />
          </div>
          <div>
            <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Assign Teacher (Optional)</label>
            <select name="teacherId" id="teacherId" value={newClass.teacherId} onChange={handleInputChange} className={formInputStyle}>
              <option value="">Select Teacher</option>
              {mockTeachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>)}
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Class</Button>
          </div>
        </form>
      </Modal>

      {selectedClass && (
        <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={`Class Details: ${selectedClass.name} ${selectedClass.section}`} size="lg">
          <div className="space-y-4 text-gray-700 dark:text-gray-300 hc-text-secondary">
            <p><strong>ID:</strong> {selectedClass.id}</p>
            <p><strong>Teacher:</strong> <span className="text-gray-900 dark:text-gray-100 hc-text-primary">{selectedClass.teacherName || 'Not Assigned'}</span></p>
            <p><strong>Number of Students:</strong> {studentsInSelectedClass.length}</p>

            <div className="my-4">
              <label htmlFor="assignTeacherSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Assign/Change Teacher:</label>
              <div className="flex gap-2 mt-1">
                <select 
                    id="assignTeacherSelect" 
                    defaultValue={selectedClass.teacherId || ""}
                    className={`${formInputStyle} flex-grow`}
                >
                  <option value="">Select Teacher to Assign</option>
                  {mockTeachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>)}
                </select>
                <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                        const selectElement = document.getElementById('assignTeacherSelect') as HTMLSelectElement;
                        if(selectElement.value) {
                           handleAssignTeacher(selectedClass.id, selectElement.value);
                        } else {
                            alert("Please select a teacher.");
                        }
                    }}
                >Assign</Button>
              </div>
            </div>

            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-100 hc-text-primary mt-4">Students in this class:</h4>
            {studentsInSelectedClass.length > 0 ? (
              <ul className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-2 space-y-1 hc-border-primary">
                {studentsInSelectedClass.map(student => (
                  <li key={student.id} className="text-sm p-1 bg-gray-50 dark:bg-gray-700/50 rounded hc-bg-secondary">{student.name} (ID: {student.id}, Roll: {student.rollNumber})</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 hc-text-secondary">No students currently in this class.</p>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminClassesPage;