export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
}

export type ThemeOption = 'light' | 'dark' | 'high-contrast';
export type FontSizeOption = 'sm' | 'md' | 'lg';
export type LanguageOption = 'en' | 'hi' | 'te' | 'es'; // Example languages

export interface ThemeState {
  selectedTheme: ThemeOption;
  fontSize: FontSizeOption;
  language: LanguageOption;
}


export interface WidgetConfig {
  id: string;
  name: string;
  isVisible: boolean;
  order: number; 
  component?: React.FC<any>; // Optional for now, might be more specific
  icon?: keyof typeof import('./constants').Icons; 
}


export interface NavItem {
  name: string;
  path: string;
  icon: React.ReactElement; 
  children?: NavItem[];
}

export interface Student {
  id: string;
  name: string;
  class: string; 
  section: string; 
  classId: string; 
  rollNumber: string;
  attendance?: number; 
  grades?: { [subject: string]: string }; 
  photoUrl?: string;
  email?: string;
  phone?: string;
  address?: string;
  parentId?: string; 
  dateOfBirth?: string;
  interests: string[]; 
}

export interface Teacher {
  id:string;
  name: string;
  subject: string; 
  assignedClasses: string[]; 
  photoUrl?: string;
  email?: string;
  phone?: string;
  dateOfJoining?: string;
  qualification?: string;
}

export interface ClassDetails {
  id: string; 
  name: string; 
  section: string; 
  teacherId?: string; 
  teacherName?: string; 
  studentCount: number;
  timetableId?: string; 
  students?: string[]; 
}

export interface Fee {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Due' | 'Overdue';
  paymentDate?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  roleAudience: UserRole[]; 
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subject: string;
  teacherId: string; 
  teacherName: string;
  classIds: string[]; 
  fileUrl?: string; 
  submissions?: AssignmentSubmission[];
  maxMarks?: number; 
}

export interface AssignmentSubmission {
  studentId: string;
  studentName: string;
  submissionDate: string;
  fileUrl?: string;
  comments?: string;
  grade?: string; 
  marksObtained?: number; 
  maxMarks?: number; 
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string; 
  type: 'Exam' | 'Holiday' | 'Seminar' | 'Meeting' | 'Activity';
  description?: string;
  rsvp?: boolean;
  audience?: UserRole[];
}

export interface ChartDataPoint {
  name: string; 
  value: number; 
  value2?: number; 
  fill?: string;
}

export interface TimetableEntry {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string; 
  subject: string;
  teacherName?: string; 
  className?: string; 
  room?: string;
}

export interface TeacherTimetable {
  teacherId: string;
  schedule: TimetableEntry[];
}

export interface StudentTimetable {
  classId: string; 
  schedule: TimetableEntry[];
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  monthlyPrice?: number; 
}

export interface SubjectGrade {
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  grade: string; 
  remarks?: string;
}

export interface ReportCard {
  id: string;
  studentId: string;
  termName: string; 
  issueDate: string;
  overallPercentage?: number;
  overallGrade?: string;
  subjects: SubjectGrade[];
  teacherComments?: string; 
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
  HOLIDAY = 'Holiday',
  NOT_MARKED = 'Not Marked'
}

export interface DailyAttendance {
  id: string;
  studentId: string;
  date: string; 
  status: AttendanceStatus;
  classId: string;
  remarks?: string;
}

export interface ParentLink {
  parentId: string;
  studentIds: string[];
}

export interface ParentUserProfile {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    linkedStudentIds: string[];
}

export interface Subject {
  id: string;
  name: string;
  iconName?: string; 
}

export interface SubjectTopic {
  id: string;
  subjectId: string;
  name: string;
  description?: string; 
}

export interface StudentEnrollment {
  studentId: string;
  subjectIds: string[];
}

export interface AISummaryRequest {
  subjectName: string;
  topicName: string;
}

export interface AISummaryResponse {
  summaryText: string;
  audioUrl?: string; 
}

export interface StudentInterest {
  id: string;
  name: string;
  category?: string; 
}

export interface SubjectInsight {
  subjectName: string;
  currentPerformance?: string; 
  trend?: string; 
  aiSuggestions: Array<{ text: string, detailedExplanation?: string }>; 
  suggestedResources: Array<{ name: string; type: 'video' | 'article' | 'book' | 'interactive' | 'course' | 'practice'; url?: string }>;
}

export interface ActionableStep {
  id: string;
  task: string;
  category: 'Revision' | 'Practice' | 'Exploration' | 'Skill Development';
  detailedExplanation?: string;
}

export interface SubjectCorrelation {
  subjectA: string;
  subjectB: string;
  correlationType: 'positive' | 'negative' | 'neutral'; // Example types
  description: string; // e.g., "Strong math skills often help in Physics."
  suggestion?: string; // e.g., "Leverage your Math strength to understand Physics concepts better."
}

export interface WeeklyStudyTask {
  time: string; // e.g., "9 AM - 10 AM", "Afternoon"
  activity: string;
  subject?: string;
  resources?: Array<{ name: string; url?: string }>;
}

export interface WeeklyStudyDay {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  tasks: WeeklyStudyTask[];
  focus?: string; // Optional overall focus for the day
}


export interface GrowthAdvisorData {
  growthSummary: string;
  subjectInsights: SubjectInsight[];
  identifiedStrengths: string[]; 
  areasForFocus: string[]; 
  actionableSteps: ActionableStep[];
  careerPathways: Array<{ name: string; relevance?: string }>;
  motivationalQuote: { quote: string; author?: string };
  electiveSuggestions?: Array<{ name: string; reason: string }>;
  revisionScheduleOutline?: { focusArea: string; schedule: Array<{ day: string; activity: string}> };
  // New Advanced AI Insights
  subjectCorrelations?: SubjectCorrelation[];
  weeklyStudyPlan?: WeeklyStudyDay[];
  performanceOutlook?: {
    outlookStatement: string; // e.g., "Positive outlook for improving overall grade if focus areas are addressed."
    keySupportingActions: string[]; // e.g., ["Consistent revision of Science", "Increased practice for Math"]
  };
}

export interface NotificationMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'ai';
  category?: 'Assignments' | 'Exams' | 'AITips' | 'Announcements' | 'General';
  timestamp: Date;
  read: boolean;
  dismissed?: boolean; 
  linkTo?: string; 
  icon?: React.ReactElement;
}