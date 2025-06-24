import { Student, Teacher, ClassDetails, Fee, Announcement, Assignment, SchoolEvent, UserRole, TeacherTimetable, StudentTimetable, TimetableEntry, PremiumFeature, ChartDataPoint, ReportCard, SubjectGrade, DailyAttendance, AttendanceStatus, ParentLink, ParentUserProfile, Subject, SubjectTopic, StudentEnrollment, AssignmentSubmission } from '../types';

export let mockStudents: Student[] = [
  { id: 'S001', name: 'Alice Wonderland', class: '10', section: 'A', classId: '10A', rollNumber: '10A01', attendance: 95, grades: { Math: 'A+', Science: 'A' }, photoUrl: 'https://picsum.photos/seed/alice/100/100', email: 'alice@example.com', phone: '555-0101', address: '123 Wonderland Ave', parentId: 'P001', dateOfBirth: '2008-05-10', interests: ['Reading Fiction', 'Chess', 'Creative Writing'] },
  { id: 'S002', name: 'Bob The Builder', class: '9', section: 'B', classId: '9B', rollNumber: '09B05', attendance: 88, grades: { English: 'B', History: 'A-' }, photoUrl: 'https://picsum.photos/seed/bob/100/100', email: 'bob@example.com', phone: '555-0102', address: '456 Builder Rd', parentId: 'P002', dateOfBirth: '2009-02-15', interests: ['Building Models', 'Woodwork'] },
  { id: 'S003', name: 'Charlie Brown', class: '10', section: 'A', classId: '10A', rollNumber: '10A02', attendance: 92, grades: { Math: 'B+', Science: 'B' }, photoUrl: 'https://picsum.photos/seed/charlie/100/100', email: 'charlie@example.com', phone: '555-0103', address: '789 Kite St', parentId: 'P003', dateOfBirth: '2008-08-20', interests: ['Baseball', 'Drawing Comics'] },
  { id: 'S004', name: 'Diana Prince', class: '10', section: 'B', classId: '10B', rollNumber: '10B01', attendance: 97, grades: { Physics: 'A', Chemistry: 'A+' }, photoUrl: 'https://picsum.photos/seed/diana/100/100', email: 'diana@example.com', phone: '555-0104', address: '111 Amazon Ln', parentId: 'P004', dateOfBirth: '2008-03-25', interests: ['Archaeology', 'Ancient Languages', 'Combat Sports'] },
  { id: 'S005', name: 'Student Jane', class: '10', section: 'B', classId: '10B', rollNumber: '10B02', attendance: 90, grades: { Math: 'A', English: 'A-' }, photoUrl: 'https://picsum.photos/seed/jane/100/100', email: 'jane.student@example.com', phone: '555-0105', address: '222 Scholar St', parentId: 'P001', dateOfBirth: '2008-11-05', interests: ['Coding', 'Robotics', 'Space Exploration', 'Photography'] }, 
];

export let mockTeachers: Teacher[] = [
  { id: 'T001', name: 'Prof. Dumbledore', subject: 'Math', assignedClasses: ['10A', '9B'], photoUrl: 'https://picsum.photos/seed/dumbledore/100/100', email: 'dumbledore@hogwarts.edu', phone: '555-0201', dateOfJoining: '1990-09-01', qualification: 'PhD in Transfiguration' },
  { id: 'T002', name: 'Ms. Frizzle', subject: 'Science', assignedClasses: ['10A', '10B', '8C'], photoUrl: 'https://picsum.photos/seed/frizzle/100/100', email: 'frizzle@magicbus.com', phone: '555-0202', dateOfJoining: '1995-08-15', qualification: 'MSc in Adventure Education' },
  { id: 'T003', name: 'Teacher Smith', subject: 'Physics', assignedClasses: ['10A', '10B', '8C'], photoUrl: 'https://picsum.photos/seed/smith/100/100', email: 'smith.teacher@example.com', phone: '555-0203', dateOfJoining: '2010-07-20', qualification: 'MSc Physics' },
];

export let mockClasses: ClassDetails[] = [
  { id: '10A', name: 'Class 10', section: 'A', teacherId: 'T001', studentCount: 30, timetableId: 'TT10A', students: ['S001', 'S003'] },
  { id: '9B', name: 'Class 9', section: 'B', teacherId: 'T001', studentCount: 25, timetableId: 'TT9B', students: ['S002'] },
  { id: '8C', name: 'Class 8', section: 'C', teacherId: 'T002', studentCount: 28, timetableId: 'TT8C', students: [] },
  { id: '10B', name: 'Class 10', section: 'B', teacherId: 'T002', studentCount: 29, timetableId: 'TT10B', students: ['S004', 'S005'] },
];

export let mockFees: Fee[] = [
  { id: 'F001', studentId: 'S001', studentName: 'Alice Wonderland', amount: 5000, dueDate: '2024-08-15', status: 'Paid', paymentDate: '2024-08-10' },
  { id: 'F002', studentId: 'S002', studentName: 'Bob The Builder', amount: 4500, dueDate: '2024-08-15', status: 'Due' },
  { id: 'F003', studentId: 'S003', studentName: 'Charlie Brown', amount: 5000, dueDate: '2024-07-15', status: 'Overdue' },
  { id: 'F004', studentId: 'S004', studentName: 'Diana Prince', amount: 5000, dueDate: '2024-08-15', status: 'Paid', paymentDate: '2024-08-12' },
  { id: 'F005', studentId: 'S005', studentName: 'Student Jane', amount: 5000, dueDate: '2024-08-15', status: 'Due' },
];

export let mockAnnouncements: Announcement[] = [
  { id: 'A001', title: 'School Reopens Tomorrow', content: 'Please note that the school reopens tomorrow after the summer break.', date: '2024-07-31', author: 'Principal Office', roleAudience: [UserRole.STUDENT, UserRole.PARENT, UserRole.TEACHER, UserRole.ADMIN] },
  { id: 'A002', title: 'PTA Meeting Schedule', content: 'The PTA meeting is scheduled for next Saturday at 10 AM in the auditorium.', date: '2024-07-28', author: 'Admin Staff', roleAudience: [UserRole.PARENT, UserRole.TEACHER] },
  { id: 'A003', title: 'Science Fair Submissions Due', content: 'All students participating in the Science Fair must submit their projects by Friday.', date: '2024-09-10', author: 'Science Department', roleAudience: [UserRole.STUDENT, UserRole.TEACHER] },
];

const janeSubmissions: AssignmentSubmission[] = [
    { studentId: 'S005', studentName: 'Student Jane', submissionDate: '2024-08-18', grade: 'A', marksObtained: 18, maxMarks: 20, comments: 'Good understanding of concepts.'}, // For AS002 (Science Project)
    { studentId: 'S005', studentName: 'Student Jane', submissionDate: '2024-08-22', grade: 'A+', marksObtained: 20, maxMarks: 20, comments: 'Excellent work! Clearly presented.'}, // For AS004 (Physics Lab Report)
    { studentId: 'S005', studentName: 'Student Jane', submissionDate: '2024-07-15', grade: 'B+', marksObtained: 17, maxMarks: 20, comments: 'Good effort, a few areas to improve calculation speed.'}, // For AS005 (Math Worksheet)
];

export let mockAssignments: Assignment[] = [
  { id: 'AS001', title: 'Math Homework Chapter 5', description: 'Complete all exercises from Chapter 5. Ensure all steps are shown.', dueDate: '2024-08-10', subject: 'Math', teacherId: 'T001', teacherName: 'Prof. Dumbledore', classIds: ['10A', '9B'], maxMarks: 25 },
  { id: 'AS002', title: 'Science Project: Volcano Model', description: 'Create a working model of a volcano. Presentation required.', dueDate: '2024-09-20', subject: 'Science', teacherId: 'T002', teacherName: 'Ms. Frizzle', classIds: ['10A', '10B'], submissions: janeSubmissions.filter(s => s.studentId === 'S005'), maxMarks: 20 },
  { id: 'AS003', title: 'History Essay: Ancient Rome', description: 'Write a 500-word essay on the rise and fall of Ancient Rome.', dueDate: '2024-08-15', subject: 'History', teacherId: 'T001', teacherName: 'Prof. Dumbledore', classIds: ['9B'], maxMarks: 50 },
  { id: 'AS004', title: 'Physics Lab Report: Optics', description: 'Submit the lab report for the optics experiment conducted last week.', dueDate: '2024-09-25', subject: 'Physics', teacherId: 'T003', teacherName: 'Teacher Smith', classIds: ['10B'], submissions: janeSubmissions.filter(s => s.studentId === 'S005'), maxMarks: 20 },
  { id: 'AS005', title: 'Math Worksheet: Algebra II', description: 'Complete the attached worksheet on advanced algebra.', dueDate: '2024-07-20', subject: 'Math', teacherId: 'T003', teacherName: 'Teacher Smith', classIds: ['10B'], submissions: janeSubmissions.filter(s => s.studentId === 'S005'), maxMarks: 20},
  { id: 'AS006', title: 'English Essay: My Summer Vacation', description: 'Write a 300-word essay about your summer vacation experiences.', dueDate: '2024-10-05', subject: 'English', teacherId: 'T001', teacherName: 'Prof. Dumbledore', classIds: ['10B'], maxMarks: 30 },
];


export const mockEvents: SchoolEvent[] = [
    { id: 'E001', title: 'Mid-Term Exams', date: '2024-09-01', type: 'Exam', description: 'Mid-term examinations for all classes.', audience: [UserRole.STUDENT, UserRole.TEACHER, UserRole.PARENT, UserRole.ADMIN] },
    { id: 'E002', title: 'Independence Day Celebration', date: '2024-08-15', type: 'Activity', description: 'School assembly and cultural programs.', rsvp: false, audience: [UserRole.STUDENT, UserRole.TEACHER, UserRole.PARENT, UserRole.ADMIN] },
    { id: 'E003', title: 'Science Fair', date: '2024-09-15', type: 'Seminar', description: 'Annual science fair. All are invited.', audience: [UserRole.STUDENT, UserRole.TEACHER, UserRole.PARENT] },
    { id: 'E004', title: 'Parent-Teacher Meeting - Class 10', date: '2024-09-20', type: 'Meeting', description: 'Discuss student progress for Class 10.', audience: [UserRole.PARENT, UserRole.TEACHER] },
    { id: 'E005', title: 'Staff Development Workshop', date: '2024-09-05', type: 'Meeting', description: 'Mandatory workshop for all teaching staff.', audience: [UserRole.TEACHER, UserRole.ADMIN] },
];

const commonSchedulePart: TimetableEntry[] = [
  { day: 'Monday', time: '09:00 AM - 09:50 AM', subject: 'Math', room: '101'},
  { day: 'Monday', time: '10:00 AM - 10:50 AM', subject: 'Science', room: 'Lab A'},
  { day: 'Monday', time: '11:00 AM - 11:50 AM', subject: 'English', room: '102'},
  { day: 'Tuesday', time: '09:00 AM - 09:50 AM', subject: 'Social Studies', room: '103'},
  { day: 'Tuesday', time: '10:00 AM - 10:50 AM', subject: 'Art', room: 'Art Room'},
];

export const mockStudentTimetables: StudentTimetable[] = [
  {
    classId: '10A',
    schedule: [
      ...commonSchedulePart,
      { day: 'Wednesday', time: '09:00 AM - 09:50 AM', subject: 'Physics', teacherName: 'Ms. Frizzle', room: 'Lab B'},
      { day: 'Wednesday', time: '10:00 AM - 10:50 AM', subject: 'Chemistry', teacherName: 'Ms. Frizzle', room: 'Lab C'},
      { day: 'Thursday', time: '09:00 AM - 09:50 AM', subject: 'Math', teacherName: 'Prof. Dumbledore', room: '101'},
      { day: 'Friday', time: '10:00 AM - 10:50 AM', subject: 'Physical Education', teacherName: 'Coach K', room: 'Gym'},
    ].map(s => ({
        ...s,
        day: s.day as TimetableEntry['day'], 
        teacherName: s.teacherName || (s.subject === 'Math' ? 'Prof. Dumbledore' : 'Ms. Frizzle')
    })),
  },
  {
    classId: '9B',
    schedule: [
      { day: 'Monday', time: '09:00 AM - 09:50 AM', subject: 'English', teacherName: 'Mr. Keating', room: '201'},
      { day: 'Monday', time: '10:00 AM - 10:50 AM', subject: 'History', teacherName: 'Prof. Binns', room: '202'},
      { day: 'Tuesday', time: '09:00 AM - 09:50 AM', subject: 'Math', teacherName: 'Prof. Dumbledore', room: '101'},
    ],
  },
   {
    classId: '10B', 
    schedule: [
      { day: 'Monday', time: '09:00 AM - 09:50 AM', subject: 'Physics', teacherName: 'Ms. Frizzle', room: 'Lab B'},
      { day: 'Monday', time: '10:00 AM - 10:50 AM', subject: 'Chemistry', teacherName: 'Ms. Frizzle', room: 'Lab C'},
      { day: 'Tuesday', time: '09:00 AM - 09:50 AM', subject: 'Biology', teacherName: 'Ms. Sprout', room: 'Greenhouse'},
      { day: 'Wednesday', time: '10:00 AM - 10:50 AM', subject: 'Computer Science', teacherName: 'Mr. Robot', room: 'CS Lab'},
      { day: 'Thursday', time: '09:00 AM - 09:50 AM', subject: 'Math', teacherName: 'Teacher Smith', room: '102'}, // Student Jane's Math
      { day: 'Thursday', time: '10:00 AM - 10:50 AM', subject: 'English', teacherName: 'Mr. Keating', room: '201'}, // Student Jane's English
    ],
  }
];

export const mockTeacherTimetables: TeacherTimetable[] = [
  {
    teacherId: 'T001', // Prof. Dumbledore
    schedule: [
      { day: 'Monday', time: '09:00 AM - 09:50 AM', subject: 'Math', className: '10A', room: '101' },
      { day: 'Tuesday', time: '09:00 AM - 09:50 AM', subject: 'Math', className: '9B', room: '101' },
      { day: 'Wednesday', time: '11:00 AM - 11:50 AM', subject: 'Advanced Math', className: '10A', room: '101' },
      { day: 'Thursday', time: '09:00 AM - 09:50 AM', subject: 'Math', teacherName: 'Prof. Dumbledore', room: '101', className: '10A'},
    ],
  },
  {
    teacherId: 'T002', // Ms. Frizzle
    schedule: [
      { day: 'Monday', time: '10:00 AM - 10:50 AM', subject: 'Science', className: '10A', room: 'Lab A' },
      { day: 'Monday', time: '09:00 AM - 09:50 AM', subject: 'Physics', className: '10B', room: 'Lab B'},
      { day: 'Monday', time: '10:00 AM - 10:50 AM', subject: 'Chemistry', className: '10B', room: 'Lab C'},
      { day: 'Tuesday', time: '10:00 AM - 10:50 AM', subject: 'General Science', className: '8C', room: 'Lab A' },
      { day: 'Wednesday', time: '09:00 AM - 09:50 AM', subject: 'Physics', className: '10A', room: 'Lab B'},
      { day: 'Wednesday', time: '10:00 AM - 10:50 AM', subject: 'Chemistry', className: '10A', room: 'Lab C'},
    ],
  },
  {
    teacherId: 'T003', // Teacher Smith
    schedule: [
      { day: 'Thursday', time: '09:00 AM - 09:50 AM', subject: 'Math', className: '10B', room: '102'}, 
      { day: 'Monday', time: '09:00 AM - 09:50 AM', subject: 'Physics', className: '10A', room: 'Lab B'},
    ],
  },
];

export const mockSmsBalance = 5750; 

export const mockPremiumFeatures: PremiumFeature[] = [
  { id: 'PF001', name: 'Real-time Bus Tracking', description: 'Parents can track the school bus location in real-time.', isActive: true, monthlyPrice: 100 },
  { id: 'PF002', name: 'Instant Grade Notifications', description: 'Receive SMS/Push notifications as soon as grades are published.', isActive: true, monthlyPrice: 50 },
  { id: 'PF003', name: 'Extended Digital Library Access', description: 'Access to a wider range of e-books and learning materials.', isActive: false, monthlyPrice: 150 },
  { id: 'PF004', name: 'Personalized Learning Reports', description: 'Detailed monthly reports on student progress with AI insights.', isActive: true, monthlyPrice: 200 },
];

export const mockMonthlyRevenue: ChartDataPoint[] = [
  { name: 'Jan', value: 15000, fill: '#8884d8' },
  { name: 'Feb', value: 18000, fill: '#82ca9d' },
  { name: 'Mar', value: 17500, fill: '#ffc658' },
  { name: 'Apr', value: 21000, fill: '#FF8042' },
  { name: 'May', value: 19500, fill: '#00C49F' },
  { name: 'Jun', value: 22000, fill: '#0088FE' },
];

export const mockReportCards: ReportCard[] = [
  {
    id: 'RC001',
    studentId: 'S001', // Alice Wonderland
    termName: 'Mid-Term Examination - 2024',
    issueDate: '2024-10-15',
    overallPercentage: 88.5,
    overallGrade: 'A',
    subjects: [
      { subjectName: 'Math', marksObtained: 92, maxMarks: 100, grade: 'A+' },
      { subjectName: 'Science', marksObtained: 85, maxMarks: 100, grade: 'A' },
      { subjectName: 'English', marksObtained: 80, maxMarks: 100, grade: 'A-' },
      { subjectName: 'Social Studies', marksObtained: 90, maxMarks: 100, grade: 'A+' },
      { subjectName: 'Art', marksObtained: 95, maxMarks: 100, grade: 'A+' },
    ],
    teacherComments: 'Alice is a bright and diligent student. Keep up the excellent work!',
  },
  {
    id: 'RC002',
    studentId: 'S002', // Bob The Builder
    termName: 'Mid-Term Examination - 2024',
    issueDate: '2024-10-15',
    overallPercentage: 75.0,
    overallGrade: 'B+',
    subjects: [
      { subjectName: 'Math', marksObtained: 70, maxMarks: 100, grade: 'B' },
      { subjectName: 'Science', marksObtained: 78, maxMarks: 100, grade: 'B+' },
      { subjectName: 'English', marksObtained: 82, maxMarks: 100, grade: 'A-' },
      { subjectName: 'History', marksObtained: 70, maxMarks: 100, grade: 'B' },
    ],
    teacherComments: 'Bob shows good potential. Consistent effort in Math and History will yield better results.',
  },
  { // First report for Jane (more recent)
    id: 'RC003',
    studentId: 'S005', // Student Jane
    termName: 'Mid-Term Examination - 2024', 
    issueDate: '2024-10-15', 
    overallPercentage: 91.0,
    overallGrade: 'A+',
    subjects: [
      { subjectName: 'Math', marksObtained: 95, maxMarks: 100, grade: 'A+' }, // Trend: 88 -> 95 (Improved)
      { subjectName: 'Physics', marksObtained: 88, maxMarks: 100, grade: 'A' }, // Trend: 85 -> 88 (Improved)
      { subjectName: 'Chemistry', marksObtained: 90, maxMarks: 100, grade: 'A+' },// Trend: 92 -> 90 (Slight Dip)
      { subjectName: 'English', marksObtained: 92, maxMarks: 100, grade: 'A+' },// Trend: 80 -> 92 (Improved)
      { subjectName: 'Computer Science', marksObtained: 90, maxMarks: 100, grade: 'A+' }, // New subject or steady
    ],
    teacherComments: 'Jane has performed exceptionally well. Her analytical skills are commendable.',
  },
   { // Second report for Jane (older)
    id: 'RC005',
    studentId: 'S005', // Student Jane
    termName: 'First Term Examination - 2024',
    issueDate: '2024-06-15', // Older date
    overallPercentage: 86.25,
    overallGrade: 'A',
    subjects: [
      { subjectName: 'Math', marksObtained: 88, maxMarks: 100, grade: 'A' },
      { subjectName: 'Physics', marksObtained: 85, maxMarks: 100, grade: 'A' },
      { subjectName: 'Chemistry', marksObtained: 92, maxMarks: 100, grade: 'A+' },
      { subjectName: 'English', marksObtained: 80, maxMarks: 100, grade: 'A-' },
    ],
    teacherComments: 'A very good start to the year, Jane. Keep focusing on Chemistry!',
  },
   {
    id: 'RC004',
    studentId: 'S001', // Alice Wonderland - another term
    termName: 'Final Examination - 2023',
    issueDate: '2024-03-15',
    overallPercentage: 90.5,
    overallGrade: 'A+',
    subjects: [
      { subjectName: 'Math', marksObtained: 95, maxMarks: 100, grade: 'A+' },
      { subjectName: 'Science', marksObtained: 88, maxMarks: 100, grade: 'A' },
      { subjectName: 'English', marksObtained: 85, maxMarks: 100, grade: 'A' },
      { subjectName: 'Social Studies', marksObtained: 94, maxMarks: 100, grade: 'A+' },
    ],
    teacherComments: 'Excellent performance throughout the year, Alice!',
  },
];

export const mockDailyAttendance: DailyAttendance[] = [
    { id: 'ATT001', studentId: 'S001', date: '2024-07-29', status: AttendanceStatus.PRESENT, classId: '10A' },
    { id: 'ATT002', studentId: 'S001', date: '2024-07-30', status: AttendanceStatus.PRESENT, classId: '10A' },
    { id: 'ATT003', studentId: 'S001', date: '2024-07-31', status: AttendanceStatus.ABSENT, classId: '10A', remarks: 'Fever' },
    { id: 'ATT004', studentId: 'S002', date: '2024-07-29', status: AttendanceStatus.PRESENT, classId: '9B' },
    { id: 'ATT005', studentId: 'S002', date: '2024-07-30', status: AttendanceStatus.LATE, classId: '9B', remarks: 'Bus delay' },
    { id: 'ATT006', studentId: 'S005', date: '2024-07-29', status: AttendanceStatus.PRESENT, classId: '10B' },
    { id: 'ATT007', studentId: 'S005', date: '2024-07-30', status: AttendanceStatus.PRESENT, classId: '10B' },
    { id: 'ATT008', studentId: 'S005', date: '2024-07-31', status: AttendanceStatus.PRESENT, classId: '10B' },
    { id: 'ATT009', studentId: 'S005', date: '2024-08-01', status: AttendanceStatus.ABSENT, classId: '10B', remarks: 'Family event' },
    { id: 'ATT010', studentId: 'S005', date: '2024-08-02', status: AttendanceStatus.PRESENT, classId: '10B' },
    // Add more for Jane for a fuller calendar
    { id: 'ATT011', studentId: 'S005', date: '2024-08-05', status: AttendanceStatus.PRESENT, classId: '10B' },
    { id: 'ATT012', studentId: 'S005', date: '2024-08-06', status: AttendanceStatus.LATE, classId: '10B', remarks: 'Traffic' },
    { id: 'ATT013', studentId: 'S005', date: '2024-08-07', status: AttendanceStatus.PRESENT, classId: '10B' },
    { id: 'ATT014', studentId: 'S005', date: '2024-08-08', status: AttendanceStatus.PRESENT, classId: '10B' },
    { id: 'ATT015', studentId: 'S005', date: '2024-08-09', status: AttendanceStatus.ABSENT, classId: '10B', remarks: 'Doctor appointment' },

];

export const mockParentLinks: ParentLink[] = [
    { parentId: 'P001', studentIds: ['S001', 'S005'] }, // Parent Doe is linked to Alice and Jane
    { parentId: 'P002', studentIds: ['S002'] },
    { parentId: 'P003', studentIds: ['S003'] },
    { parentId: 'P004', studentIds: ['S004'] },
];

export const mockParentProfiles: ParentUserProfile[] = [
    { id: 'P001', name: 'Parent Doe', email: 'parent.doe@example.com', phone: '555-0301', linkedStudentIds: ['S001', 'S005'] },
    { id: 'P002', name: 'Parent Builder', email: 'parent.builder@example.com', phone: '555-0302', linkedStudentIds: ['S002'] },
];

// Data for AI Summaries
export const mockSubjects: Subject[] = [
    { id: 'SUBJ001', name: 'Mathematics', iconName: 'Grades' },
    { id: 'SUBJ002', name: 'Science', iconName: 'Lightbulb' },
    { id: 'SUBJ003', name: 'History', iconName: 'Classes' },
    { id: 'SUBJ004', name: 'English', iconName: 'Assignments' },
    { id: 'SUBJ005', name: 'Physics', iconName: 'Lightbulb'},
    { id: 'SUBJ006', name: 'Chemistry', iconName: 'Lightbulb'},
    { id: 'SUBJ007', name: 'Biology', iconName: 'Lightbulb'},
    { id: 'SUBJ008', name: 'Computer Science', iconName: 'Settings'},
];

export const mockSubjectTopics: SubjectTopic[] = [
    { id: 'TOP001', subjectId: 'SUBJ001', name: 'Algebra Basics', description: 'Fundamental concepts of algebraic expressions and equations.' },
    { id: 'TOP002', subjectId: 'SUBJ001', name: 'Geometry: Shapes and Angles', description: 'Understanding geometric figures, properties, and angle relationships.' },
    { id: 'TOP003', subjectId: 'SUBJ001', name: 'Calculus: Differentiation', description: 'Introduction to derivatives and rates of change.' },
    { id: 'TOP004', subjectId: 'SUBJ002', name: 'Photosynthesis Process', description: 'How plants convert light energy into chemical energy.' },
    { id: 'TOP005', subjectId: 'SUBJ002', name: 'The Human Cell', description: 'Structure and function of animal and plant cells.' },
    { id: 'TOP006', subjectId: 'SUBJ002', name: 'Newton\'s Laws of Motion', description: 'Principles governing the motion of objects.' },
    { id: 'TOP007', subjectId: 'SUBJ003', name: 'Ancient Civilizations', description: 'Overview of major ancient empires and their contributions.' },
    { id: 'TOP008', subjectId: 'SUBJ003', name: 'World War I: Causes and Effects', description: 'A study of the Great War and its global impact.' },
    { id: 'TOP009', subjectId: 'SUBJ004', name: 'Shakespearean Sonnets', description: 'Analysis of Shakespeare\'s sonnet structure and themes.' },
    { id: 'TOP010', subjectId: 'SUBJ004', name: 'Grammar: Parts of Speech', description: 'Understanding nouns, verbs, adjectives, and other grammatical components.' },
    { id: 'TOP011', subjectId: 'SUBJ005', name: 'Optics and Light', description: 'The behavior and properties of light.' },
    { id: 'TOP012', subjectId: 'SUBJ006', name: 'The Periodic Table', description: 'Organization and properties of chemical elements.' },
    { id: 'TOP013', subjectId: 'SUBJ007', name: 'Genetics and DNA', description: 'Principles of heredity and the role of DNA.' },
    { id: 'TOP014', subjectId: 'SUBJ008', name: 'Introduction to Algorithms', description: 'Basic concepts of algorithmic thinking and design.' },
];

export const mockStudentEnrollments: StudentEnrollment[] = [
    { studentId: 'S001', subjectIds: ['SUBJ001', 'SUBJ002', 'SUBJ004'] }, // Alice: Math, Science, English
    { studentId: 'S002', subjectIds: ['SUBJ001', 'SUBJ003', 'SUBJ004'] }, // Bob: Math, History, English
    { studentId: 'S003', subjectIds: ['SUBJ001', 'SUBJ002', 'SUBJ003'] }, // Charlie: Math, Science, History
    { studentId: 'S004', subjectIds: ['SUBJ005', 'SUBJ006', 'SUBJ004'] }, // Diana: Physics, Chemistry, English
    { studentId: 'S005', subjectIds: ['SUBJ001', 'SUBJ005', 'SUBJ006', 'SUBJ004', 'SUBJ008'] }, // Jane: Math, Physics, Chemistry, English, CompSci
];


// Helper functions
export const getAssignmentsForStudent = (studentClassId: string, studentId?: string): Assignment[] => {
  const classAssignments = mockAssignments.filter(assignment => assignment.classIds.includes(studentClassId));
  if (studentId) { // For "pending" assignments, we need to check if this student has submitted.
    return classAssignments.map(assignment => {
        const submission = assignment.submissions?.find(sub => sub.studentId === studentId);
        return { ...assignment, isSubmitted: !!submission };
    });
  }
  return classAssignments;
};

export const getStudentTimetable = (studentClassId: string): TimetableEntry[] => {
  const timetable = mockStudentTimetables.find(tt => tt.classId === studentClassId);
  return timetable ? timetable.schedule : [];
};

export const getTeacherTimetable = (teacherId: string): TimetableEntry[] => {
  const timetable = mockTeacherTimetables.find(tt => tt.teacherId === teacherId);
  return timetable ? timetable.schedule : [];
};

export const getAssignmentsByTeacher = (teacherId: string): Assignment[] => {
  return mockAssignments.filter(assignment => assignment.teacherId === teacherId);
};

export const getReportCardsForStudent = (studentId: string): ReportCard[] => {
  return mockReportCards.filter(rc => rc.studentId === studentId).sort((a,b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()); // Sort by most recent
};

export const getStudentsByClass = (classId: string): Student[] => {
  return mockStudents.filter(student => student.classId === classId);
};

export const getStudentAttendanceDetails = (studentId: string): DailyAttendance[] => {
    return mockDailyAttendance.filter(att => att.studentId === studentId)
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getChildrenOfParent = (parentId: string): Student[] => {
    const link = mockParentLinks.find(pl => pl.parentId === parentId);
    if (!link) return [];
    return mockStudents.filter(student => link.studentIds.includes(student.id));
};

export const getFeesForStudent = (studentId: string): Fee[] => {
    return mockFees.filter(fee => fee.studentId === studentId)
        .sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
};

export const getTeacherById = (teacherId: string): Teacher | undefined => {
    return mockTeachers.find(t => t.id === teacherId);
}

export const getClassDetailsById = (classId: string): ClassDetails | undefined => {
    const classDetail = mockClasses.find(c => c.id === classId);
    if(classDetail){
        const teacher = getTeacherById(classDetail.teacherId || '');
        // Make sure student count is dynamic if students array is present
        const dynamicStudentCount = classDetail.students ? classDetail.students.length : (mockStudents.filter(s => s.classId === classId).length || classDetail.studentCount);
        return {...classDetail, teacherName: teacher?.name, studentCount: dynamicStudentCount};
    }
    return undefined;
}

// Helpers for AI Summaries
export const getEnrolledSubjectsForStudent = (studentId: string): Subject[] => {
    const enrollment = mockStudentEnrollments.find(e => e.studentId === studentId);
    if (!enrollment) return [];
    return mockSubjects.filter(subject => enrollment.subjectIds.includes(subject.id));
};

export const getTopicsForSubject = (subjectId: string): SubjectTopic[] => {
    return mockSubjectTopics.filter(topic => topic.subjectId === subjectId);
};

// Helper for Growth Advisor: Get all assignments submitted by a student
export const getSubmittedAssignmentsForStudent = (studentId: string): Array<Assignment & { submissionDetails?: AssignmentSubmission }> => {
  const studentAssignments: Array<Assignment & { submissionDetails?: AssignmentSubmission }> = [];
  mockAssignments.forEach(assignment => {
    const studentClass = mockStudents.find(s => s.id === studentId)?.classId;
    if (studentClass && assignment.classIds.includes(studentClass)) { // Is the assignment for the student's class?
        const submission = assignment.submissions?.find(sub => sub.studentId === studentId);
        if (submission) {
            studentAssignments.push({ ...assignment, submissionDetails: submission });
        } else {
             // For pending assignments relevant to student's class
             if (new Date(assignment.dueDate) >= new Date()) { // Check if it's not past due for "pending"
                studentAssignments.push({ ...assignment });
             }
        }
    }
  });
  return studentAssignments.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
};