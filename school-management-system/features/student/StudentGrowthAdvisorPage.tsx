
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import Checkbox from '../../components/ui/Checkbox';
import DropdownMenu, { DropdownMenuItem } from '../../components/ui/DropdownMenu';
import { Icons } from '../../constants';
import { Student, ReportCard, AssignmentSubmission, GrowthAdvisorData, ActionableStep, SubjectInsight, DailyAttendance, Assignment as AssignmentType, WidgetConfig } from '../../types';
import { mockStudents, getReportCardsForStudent, getStudentAttendanceDetails, getSubmittedAssignmentsForStudent, getAssignmentsForStudent } from '../../services/mockData';
import { NotificationContext } from '../../contexts/NotificationContext';

// Import Modals
import SubjectDetailModal from './SubjectDetailModal';
import StudentAttendanceCalendarModal from './StudentAttendanceCalendarModal';
import AssignmentPerformanceModal from './AssignmentPerformanceModal';
import AskAIModal from './AskAIModal';
import { OptionalFeature } from './settingsTypes'; 

interface StudentGrowthAdvisorPageProps {
  studentId: string;
}

export type AdvisorWidgetId = 'growthSnapshot' | 'attendanceSummary' | 'assignmentSummary' | 'strengthsFocus' | 'subjectInsights' | 'actionPlan' | 'studyPlan' | 'electiveSuggestions' | 'performanceOutlook' | 'subjectCorrelations' | 'careerPathways' | 'motivationalGoal' | 'gamifiedScoreboard';

const getDefaultWidgetsConfig = (): Record<AdvisorWidgetId, WidgetConfig> => ({
  growthSnapshot: { id: 'growthSnapshot', name: 'Growth Snapshot', isVisible: true, order: 1, icon: 'TrendingUp' },
  attendanceSummary: { id: 'attendanceSummary', name: 'Attendance Overview', isVisible: true, order: 2, icon: 'CalendarDays' },
  assignmentSummary: { id: 'assignmentSummary', name: 'Assignment Summary', isVisible: true, order: 3, icon: 'Assignments' },
  strengthsFocus: { id: 'strengthsFocus', name: 'Strengths & Focus Areas', isVisible: true, order: 4, icon: 'Target' },
  subjectInsights: { id: 'subjectInsights', name: 'Subject Insights', isVisible: true, order: 5, icon: 'BrainCircuit' },
  actionPlan: { id: 'actionPlan', name: 'Action Plan', isVisible: true, order: 6, icon: 'CheckCircle' },
  studyPlan: { id: 'studyPlan', name: 'Weekly Study Plan', isVisible: true, order: 7, icon: 'Timetable' },
  electiveSuggestions: { id: 'electiveSuggestions', name: 'Elective Suggestions', isVisible: true, order: 8, icon: 'Lightbulb' },
  performanceOutlook: { id: 'performanceOutlook', name: 'Performance Outlook', isVisible: true, order: 9, icon: 'TrendingUp' },
  subjectCorrelations: { id: 'subjectCorrelations', name: 'Subject Synergies', isVisible: true, order: 10, icon: 'BrainCircuit' },
  careerPathways: { id: 'careerPathways', name: 'Career Pathways', isVisible: true, order: 11, icon: 'Reports' }, 
  motivationalGoal: { id: 'motivationalGoal', name: 'Motivation & Goals', isVisible: true, order: 12, icon: 'Speech' },
  gamifiedScoreboard: { id: 'gamifiedScoreboard', name: 'Gamified Scoreboard', isVisible: false, order: 13, icon: 'Grades' } 
});


const StudentGrowthAdvisorPage: React.FC<StudentGrowthAdvisorPageProps> = ({ studentId }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [advisorReport, setAdvisorReport] = useState<GrowthAdvisorData | null>(null);
  const [actionPlan, setActionPlan] = useState<Array<ActionableStep & { completed: boolean }>>([]);
  const [currentGoal, setCurrentGoal] = useState<string>(localStorage.getItem(`studentGoal_${studentId}`) || '');
  const [goalInput, setGoalInput] = useState<string>(currentGoal);
  
  const { addNotification } = useContext(NotificationContext);
  
  const [widgetsConfig, setWidgetsConfig] = useState<Record<AdvisorWidgetId, WidgetConfig>>(() => {
    const savedConfigStr = localStorage.getItem(`studentGrowthAdvisorWidgets_${studentId}`);
    if (savedConfigStr) {
      try {
        const parsed = JSON.parse(savedConfigStr);
        const defaultConfig = getDefaultWidgetsConfig();
        const mergedConfig = {...defaultConfig}; 
        for (const key in parsed) {
          if (Object.prototype.hasOwnProperty.call(defaultConfig, key) && parsed[key] !== undefined) {
             mergedConfig[key as AdvisorWidgetId] = { ...defaultConfig[key as AdvisorWidgetId], ...parsed[key]};
          }
        }
        return mergedConfig;
      } catch (e) {
        console.error("Failed to parse saved widgets config:", e);
      }
    }
    return getDefaultWidgetsConfig();
  });

  const [isManageWidgetsModalOpen, setIsManageWidgetsModalOpen] = useState(false);
  
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [selectedSubjectInsight, setSelectedSubjectInsight] = useState<SubjectInsight | null>(null);
  const [studentReportCards, setStudentReportCards] = useState<ReportCard[]>([]);
  
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [studentAttendanceRecords, setStudentAttendanceRecords] = useState<DailyAttendance[]>([]);
  
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [studentAssignments, setStudentAssignments] = useState<Array<AssignmentType & { submissionDetails?: AssignmentSubmission, isSubmitted?: boolean }>>([]);
  
  const [isAskAIModalOpen, setIsAskAIModalOpen] = useState(false);

  const [gamificationEnabled, setGamificationEnabled] = useState<boolean>(() => {
      const toggles = localStorage.getItem('studentFeatureToggles');
      if (toggles) {
        try {
            const parsedToggles = JSON.parse(toggles);
            return parsedToggles.gamification !== undefined ? parsedToggles.gamification : false;
        } catch (e) {
            return false;
        }
      }
      return false;
  });

  const [isEditingGrowthSummary, setIsEditingGrowthSummary] = useState(false);
  const [editedGrowthSummary, setEditedGrowthSummary] = useState<string | null>(null);
  const [tempGrowthSummary, setTempGrowthSummary] = useState<string>('');

  const [isEditingStrengthsFocus, setIsEditingStrengthsFocus] = useState(false);
  const [editedStrengths, setEditedStrengths] = useState<string[] | null>(null);
  const [editedFocusAreas, setEditedFocusAreas] = useState<string[] | null>(null);
  const [tempStrengths, setTempStrengths] = useState<string>('');
  const [tempFocusAreas, setTempFocusAreas] = useState<string>('');

  const formElementStyle = "w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-academic-blue focus:border-academic-blue " +
                           "bg-white text-gray-900 placeholder-gray-500 border-gray-300 " +
                           "dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 " +
                           "hc-bg-secondary hc-text-primary hc-border-primary hc-placeholder-text";


  useEffect(() => {
    const handleToggleChange = (event: Event) => {
        const detail = (event as CustomEvent).detail as Record<OptionalFeature, boolean>;
        if (detail.gamification !== undefined) {
            setGamificationEnabled(detail.gamification);
        }
    };
    window.addEventListener('studentFeatureToggleChange', handleToggleChange);
    return () => window.removeEventListener('studentFeatureToggleChange', handleToggleChange);
  }, []);

  useEffect(() => {
    localStorage.setItem(`studentGrowthAdvisorWidgets_${studentId}`, JSON.stringify(widgetsConfig));
  }, [widgetsConfig, studentId]);

  useEffect(() => {
    const storedEditedSummary = localStorage.getItem(`editedGrowthSummary_${studentId}`);
    if (storedEditedSummary) setEditedGrowthSummary(storedEditedSummary);

    const storedEditedStrengths = localStorage.getItem(`editedStrengths_${studentId}`);
    if (storedEditedStrengths) setEditedStrengths(JSON.parse(storedEditedStrengths));
    
    const storedEditedFocusAreas = localStorage.getItem(`editedFocusAreas_${studentId}`);
    if (storedEditedFocusAreas) setEditedFocusAreas(JSON.parse(storedEditedFocusAreas));

  }, [studentId]);


  const handleWidgetVisibilityChange = (widgetId: AdvisorWidgetId, isVisible: boolean) => {
    setWidgetsConfig(prev => ({
      ...prev,
      [widgetId]: { ...prev[widgetId], isVisible }
    }));
  };

  const handleWidgetOrderChange = (widgetId: AdvisorWidgetId, direction: 'up' | 'down') => {
    setWidgetsConfig(prev => {
      const currentWidgetsArray = Object.values(prev).sort((a, b) => a.order - b.order);
      const widgetIndex = currentWidgetsArray.findIndex(w => w.id === widgetId);
      if (widgetIndex === -1) return prev;

      const newIndex = direction === 'up' ? widgetIndex - 1 : widgetIndex + 1;
      if (newIndex < 0 || newIndex >= currentWidgetsArray.length) return prev;
      
      const newWidgetsArray = [...currentWidgetsArray];
      const [movedWidget] = newWidgetsArray.splice(widgetIndex, 1);
      newWidgetsArray.splice(newIndex, 0, movedWidget);
      
      const newConfig = {} as Record<AdvisorWidgetId, WidgetConfig>;
      newWidgetsArray.forEach((w, index) => {
        newConfig[w.id as AdvisorWidgetId] = { ...w, order: index + 1 };
      });
      return newConfig;
    });
  };
  
  const restoreDefaultWidgets = () => {
    setWidgetsConfig(getDefaultWidgetsConfig());
    localStorage.removeItem(`studentGrowthAdvisorWidgets_${studentId}`);
    localStorage.removeItem(`editedGrowthSummary_${studentId}`);
    setEditedGrowthSummary(null);
    localStorage.removeItem(`editedStrengths_${studentId}`);
    setEditedStrengths(null);
    localStorage.removeItem(`editedFocusAreas_${studentId}`);
    setEditedFocusAreas(null);
    alert("Widgets and their content restored to default.");
  };


  const getAIClient = () => {
    if (!process.env.API_KEY) {
      console.error("API_KEY environment variable is not set.");
      setError("AI Advisor service is not configured. Please contact support.");
      return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  };

  const compileStudentDataForAI = useCallback(async () => {
    const studentProfile = mockStudents.find(s => s.id === studentId);
    if (!studentProfile) {
      setError("Student profile not found.");
      return null;
    }
    const profileWithGuaranteedInterests = {
        ...studentProfile,
        interests: studentProfile.interests || [], 
    };
    setStudent(profileWithGuaranteedInterests);
    const reportCards = getReportCardsForStudent(studentId);
    setStudentReportCards(reportCards);
    const attendanceRecords = getStudentAttendanceDetails(studentId);
    setStudentAttendanceRecords(attendanceRecords);
    const overallAttendance = studentProfile.attendance;
    const assignmentsWithSubmissions = getSubmittedAssignmentsForStudent(studentId);
    const allClassAssignments = getAssignmentsForStudent(studentProfile.classId, studentId);
    setStudentAssignments(allClassAssignments);

    let dataSummary = `Student Profile:
Name: ${studentProfile.name} (ID: ${studentProfile.id})
Class: ${studentProfile.class} ${studentProfile.section}
Interests: ${profileWithGuaranteedInterests.interests.join(', ') || 'Not specified'}
Overall Attendance: ${overallAttendance || 'N/A'}%

Report Cards (Recent First):
${reportCards.map(rc => 
`Term: ${rc.termName} (Issued: ${rc.issueDate})
Overall Grade: ${rc.overallGrade || 'N/A'}, Percentage: ${rc.overallPercentage?.toFixed(1) || 'N/A'}%
Subjects:
${rc.subjects.map(s => `- ${s.subjectName}: Marks ${s.marksObtained}/${s.maxMarks}, Grade: ${s.grade}`).join('\n')}
Teacher Comments: ${rc.teacherComments || 'None'}
---`).join('\n\n')}

Assignment Submissions Summary (Recent First):
${assignmentsWithSubmissions.slice(0, 5).map(asgn => 
`- Assignment "${asgn.title}" (Subject: ${asgn.subject}): Due ${asgn.dueDate}. 
  ${asgn.submissionDetails ? `Submitted ${asgn.submissionDetails.submissionDate}, Grade: ${asgn.submissionDetails.grade || 'N/G'}, Marks: ${asgn.submissionDetails.marksObtained || '-'}/${asgn.submissionDetails.maxMarks || asgn.maxMarks || '-'}` : 'Status: Pending/Not Submitted'}`
).join('\n') || 'No assignment submissions found.'}

Recent Attendance Snippet (last 5 days if available):
${attendanceRecords.slice(0,5).map(ar => `- ${ar.date}: ${ar.status}`).join('\n') || 'No daily attendance records.'}
`;
    return dataSummary;
  }, [studentId]);

  const fetchAdvisorReport = useCallback(async (studentDataSummary: string) => {
    setIsLoading(true);
    setError(null);
    setAdvisorReport(null);
    const ai = getAIClient();
    if (!ai) {
      setIsLoading(false);
      return;
    }

    const prompt = `
      You are a supportive and insightful Student Growth Advisor.
      Based on the following student data:
      ${studentDataSummary}

      Please provide a comprehensive analysis and personalized recommendations in the following JSON format.
      Ensure all text is student-friendly and encouraging. Focus on actionable advice.
      Every array of objects must have objects separated by commas. Example: [ { "key": "value1" }, { "key": "value2" } ]

      {
        "growthSummary": "A concise (2-3 sentences) summary of the student's overall growth trajectory and key positive attributes.",
        "subjectInsights": [
          {
            "subjectName": "Math",
            "currentPerformance": "Good",
            "trend": "Improving Steadily",
            "aiSuggestions": [ { "text": "Practice daily.", "detailedExplanation": "Regular practice helps solidify concepts." } ],
            "suggestedResources": [ { "name": "Khan Academy - Algebra", "type": "course", "url": "https://www.khanacademy.org/math/algebra" } ]
          },
          {
            "subjectName": "Science",
            "currentPerformance": "Needs Focus",
            "trend": "Stable",
            "aiSuggestions": [ { "text": "Review notes after each class.", "detailedExplanation": "Immediate review enhances retention." }, { "text": "Try practical experiments if possible.", "detailedExplanation": "Practical work makes concepts tangible."}],
            "suggestedResources": [ { "name": "CrashCourse Physics", "type": "video", "url": "https://www.youtube.com/playlist?list=PL8dPuuaLjXtN0ge7yDk_UA0ldZJdhwkoV" } ]
          }
        ],
        "identifiedStrengths": ["Problem Solving in Math", "Creative Writing in English"],
        "areasForFocus": ["Conceptual understanding in Science", "Vocabulary building for English"],
        "actionableSteps": [
          { "id": "step1", "task": "Dedicate 30 minutes daily to review Algebra concepts", "category": "Revision", "detailedExplanation": "Consistent short revision sessions are more effective than long, infrequent ones." },
          { "id": "step2", "task": "Learn 5 new vocabulary words each day and use them in sentences", "category": "Skill Development", "detailedExplanation": "Active usage of new words improves retention and fluency." }
        ],
        "careerPathways": [ { "name": "Software Engineer", "relevance": "Strong problem-solving skills and potential interest in coding." }, { "name": "Technical Writer", "relevance": "Good creative writing abilities can be applied to technical documentation."} ],
        "electiveSuggestions": [ { "name": "Introduction to Programming", "reason": "Aligns with problem-solving strengths and potential career pathways." }, { "name": "Debate Club", "reason": "Can enhance vocabulary and structured argumentation." } ],
        "revisionScheduleOutline": { "focusArea": "Science Conceptual Understanding", "schedule": [ 
            { "day": "Monday", "activity": "Review Chapter 1 notes and key terms." }, 
            { "day": "Wednesday", "activity": "Watch a video explaining a difficult concept from Chapter 1." },
            { "day": "Friday", "activity": "Attempt practice questions for Chapter 1." } 
          ] 
        },
        "subjectCorrelations": [ 
            { "subjectA": "Math", "subjectB": "Physics", "correlationType": "positive", "description": "Strong logical skills in Math can significantly help in understanding complex Physics concepts.", "suggestion": "Try to apply mathematical problem-solving approaches to Physics questions."},
            { "subjectA": "English", "subjectB": "History", "correlationType": "positive", "description": "Good reading comprehension and writing skills from English improve performance in History.", "suggestion": "Focus on critical analysis of historical texts."}
        ],
        "weeklyStudyPlan": [
            { "day": "Monday", "focus": "Mathematics", "tasks": [ {"time": "5-6 PM", "activity": "Algebra Practice - Chapter 3 exercises", "subject": "Math", "resources": [{"name": "Textbook Ch.3"}] } ] },
            { "day": "Tuesday", "focus": "English", "tasks": [ {"time": "4-5 PM", "activity": "Read one news article and summarize", "subject": "English"}, {"time": "5-5:30 PM", "activity": "Vocabulary building - 5 new words", "subject": "English"} ] },
            { "day": "Wednesday", "focus": "Science", "tasks": [ {"time": "6-7 PM", "activity": "Biology Revision - Cell Structure (Watch video, make notes)", "subject": "Biology", "resources": [{"name": "Relevant YouTube video", "url":"https://youtube.com"}] } ] }
        ],
        "performanceOutlook": {
            "outlookStatement": "With consistent effort in focus areas like Science concepts and vocabulary, there's a strong potential for overall grade improvement next term. Strengths in Math and Writing are excellent assets.",
            "keySupportingActions": ["Follow the actionable steps diligently, especially for Science and English.", "Seek help from teachers for challenging topics in Science.", "Continue leveraging Math problem-solving skills."]
        },
        "motivationalQuote": { "quote": "The journey of a thousand miles begins with a single step.", "author": "Lao Tzu" }
      }

      Provide detailed insights for subjectCorrelations, weeklyStudyPlan, and performanceOutlook.
      The weeklyStudyPlan should cover 3-5 days. Resources array should contain objects with name and optional url.
      Ensure all generated JSON is valid.
    `;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) jsonStr = match[2].trim();
      const parsedData: GrowthAdvisorData = JSON.parse(jsonStr);
      setAdvisorReport(parsedData);
      setActionPlan(parsedData.actionableSteps.map(step => ({ ...step, completed: false })));
      
      if (!localStorage.getItem(`editedGrowthSummary_${studentId}`)) {
        setEditedGrowthSummary(parsedData.growthSummary); 
      }
      if (!localStorage.getItem(`editedStrengths_${studentId}`)) {
        setEditedStrengths(parsedData.identifiedStrengths);
      }
      if (!localStorage.getItem(`editedFocusAreas_${studentId}`)) {
        setEditedFocusAreas(parsedData.areasForFocus);
      }
      
      addNotification({ title: "Growth Plan Ready!", message: "Your personalized growth advice is here.", type: 'success', category: 'AITips', linkTo: '/student/growth-advisor' });
      if (parsedData.areasForFocus.length > 0) {
        addNotification({ title: "Focus Area Tip", message: `AI suggests focusing on ${parsedData.areasForFocus[0]}. Check your plan!`, type: 'ai', category: 'AITips', linkTo: '/student/growth-advisor' });
      }
    } catch (apiError: any) {
      console.error("Error generating AI Advisor Report:", apiError);
      let errorMessage = "An error occurred while generating your growth advice. Please try again later.";
      if (apiError instanceof Error && apiError.message.toLowerCase().includes('json')) {
        errorMessage = "Received an invalid format from the AI Advisor. Please try refreshing. If the issue persists, contact support.";
      } else if (apiError.message) {
        errorMessage = `Error from AI Advisor: ${apiError.message}`;
      }
      setError(errorMessage);
      setAdvisorReport(null);
    }
    setIsLoading(false);
  }, [addNotification, studentId]); 

  useEffect(() => {
    compileStudentDataForAI().then(dataSummary => {
      if (dataSummary) fetchAdvisorReport(dataSummary);
      else setIsLoading(false); 
    });
  }, [compileStudentDataForAI, fetchAdvisorReport]);


  const toggleActionStep = (id: string) => {
    setActionPlan(prevPlan => prevPlan.map(step => step.id === id ? { ...step, completed: !step.completed } : step));
  };

  const handleSetGoal = () => {
    if (!goalInput.trim()) {
        alert("Please enter a goal.");
        return;
    }
    setCurrentGoal(goalInput);
    localStorage.setItem(`studentGoal_${studentId}`, goalInput);
    alert("Goal set: " + goalInput);
  };
  
  const getPerformanceColor = (performance?: string) => {
    if (!performance) return 'text-gray-700 dark:text-gray-300 hc-text-secondary';
    const p = performance.toLowerCase();
    if (p.includes('excellent') || p.includes('strong') || p.includes('improving')) return 'text-accent-green dark:text-green-400 hc-accent-secondary-text';
    if (p.includes('good') || p.includes('consistent') || p.includes('stable')) return 'text-academic-blue dark:text-blue-400 hc-accent-secondary-text';
    if (p.includes('satisfactory') || p.includes('fluctuating')) return 'text-accent-yellow dark:text-yellow-400 hc-accent-primary-text';
    if (p.includes('development') || p.includes('focus') || p.includes('dip') || p.includes('declining')) return 'text-red-500 dark:text-red-400 hc-accent-primary-text';
    return 'text-gray-700 dark:text-gray-300 hc-text-secondary';
  };

  const openSubjectModal = (insight: SubjectInsight) => {
    setSelectedSubjectInsight(insight);
    setIsSubjectModalOpen(true);
  };

  const handleAttendanceCardClick = () => setIsAttendanceModalOpen(true);
  const handleAssignmentCardClick = () => setIsAssignmentModalOpen(true);
  
  useEffect(() => { 
    const gamificationWidget = widgetsConfig.gamifiedScoreboard;
    if (gamificationWidget && gamificationWidget.isVisible !== gamificationEnabled) {
      handleWidgetVisibilityChange('gamifiedScoreboard', gamificationEnabled);
    }
  }, [gamificationEnabled, widgetsConfig, handleWidgetVisibilityChange]); // Added handleWidgetVisibilityChange to dependency array


  const handleEditGrowthSummary = () => {
    setTempGrowthSummary(editedGrowthSummary ?? advisorReport?.growthSummary ?? '');
    setIsEditingGrowthSummary(true);
  };

  const handleSaveGrowthSummary = () => {
    setEditedGrowthSummary(tempGrowthSummary);
    localStorage.setItem(`editedGrowthSummary_${studentId}`, tempGrowthSummary);
    setIsEditingGrowthSummary(false);
    alert("Growth summary updated!");
  };

  const handleEditStrengthsFocus = () => {
    setTempStrengths((editedStrengths ?? advisorReport?.identifiedStrengths ?? []).join(', '));
    setTempFocusAreas((editedFocusAreas ?? advisorReport?.areasForFocus ?? []).join(', '));
    setIsEditingStrengthsFocus(true);
  };

  const handleSaveStrengthsFocus = () => {
    const newStrengths = tempStrengths.split(',').map(s => s.trim()).filter(Boolean);
    const newFocusAreas = tempFocusAreas.split(',').map(s => s.trim()).filter(Boolean);
    setEditedStrengths(newStrengths);
    setEditedFocusAreas(newFocusAreas);
    localStorage.setItem(`editedStrengths_${studentId}`, JSON.stringify(newStrengths));
    localStorage.setItem(`editedFocusAreas_${studentId}`, JSON.stringify(newFocusAreas));
    setIsEditingStrengthsFocus(false);
    alert("Strengths and Focus Areas updated!");
  };

  const renderWidgetContent = (
      widgetId: AdvisorWidgetId, 
      content: React.ReactNode, 
      customTitle?: string | null, 
      cardClassName?: string
  ) => {
      const config = widgetsConfig[widgetId];
      if (!config || !config.isVisible) return null;

      const getWidgetCardActions = (currentWidgetId: AdvisorWidgetId): DropdownMenuItem[] => {
          const items: DropdownMenuItem[] = [];
          if (currentWidgetId === 'growthSnapshot') {
            items.push({ label: 'Edit Summary', onClick: handleEditGrowthSummary, icon: <Icons.Assignments className="w-4 h-4 mr-2" /> });
          } else if (currentWidgetId === 'strengthsFocus') {
            items.push({ label: 'Edit Strengths/Focus', onClick: handleEditStrengthsFocus, icon: <Icons.Assignments className="w-4 h-4 mr-2" /> });
          } else if (currentWidgetId === 'motivationalGoal') {
              items.push({ label: 'Edit Goal', onClick: () => { 
                  const goalWidget = document.getElementById('goal-input-field'); 
                  if (goalWidget) goalWidget.focus();
              }, icon: <Icons.Assignments className="w-4 h-4 mr-2" /> });
          } else {
              items.push({ label: 'Edit Content (Mock)', onClick: () => alert(`Edit action for ${config.name} (mocked)`), icon: <Icons.Assignments className="w-4 h-4 mr-2" />, disabled: true });
          }
          items.push({ label: 'Hide Widget', onClick: () => handleWidgetVisibilityChange(currentWidgetId, false), icon: <Icons.EyeSlash className="w-4 h-4 mr-2" /> });
          items.push({ label: 'Remove Widget (Hide)', onClick: () => handleWidgetVisibilityChange(currentWidgetId, false), icon: <Icons.Close className="w-4 h-4 mr-2" /> });
          return items;
        };
      
      return (
        <Card 
          title={customTitle === null ? undefined : (customTitle || config.name)} 
          className={cardClassName}
          actions={<DropdownMenu items={getWidgetCardActions(widgetId)} icon={<Icons.EllipsisVertical className="w-5 h-5 text-gray-400 dark:text-gray-500 hc-text-secondary"/>} />}
        >
          {content}
        </Card>
      );
  };


  if (isLoading && !advisorReport) return <div className="flex flex-col justify-center items-center h-64"><Spinner size="lg" /> <p className="ml-4 mt-4 text-xl text-gray-600 dark:text-gray-300 hc-text-secondary">Generating your personalized growth plan...</p></div>;
  if (error) return <Card className="hc-bg-secondary"><p className="text-center text-red-500 p-8">{error}</p></Card>;
  if (!advisorReport || !student) return <Card className="hc-bg-secondary"><p className="text-center text-gray-500 dark:text-gray-400 hc-text-secondary p-8">No growth advice available at the moment.</p></Card>;

  const sortedVisibleWidgets = Object.values(widgetsConfig)
    .filter(widget => widget.isVisible)
    .sort((a, b) => a.order - b.order);

  const displayGrowthSummary = editedGrowthSummary !== null ? editedGrowthSummary : advisorReport.growthSummary;
  const displayStrengths = editedStrengths !== null ? editedStrengths : advisorReport.identifiedStrengths;
  const displayFocusAreas = editedFocusAreas !== null ? editedFocusAreas : advisorReport.areasForFocus;

  return (
    <div className="space-y-6 sm:space-y-8 p-1">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">Hello {student.name}, Your Personal Growth Advisor!</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsManageWidgetsModalOpen(true)} leftIcon={<Icons.Settings className="w-5 h-5"/>}>Manage Widgets</Button>
          <Button variant="primary" onClick={() => setIsAskAIModalOpen(true)} leftIcon={<Icons.BrainCircuit className="w-5 h-5"/>}>Ask AI</Button>
        </div>
      </div>

      {sortedVisibleWidgets.map(widgetConf => {
        const widgetId = widgetConf.id as AdvisorWidgetId;
        switch(widgetId) {
          case 'growthSnapshot':
            return renderWidgetContent('growthSnapshot', 
              <div className="relative">
                {isEditingGrowthSummary ? (
                  <div className="space-y-2">
                    <textarea 
                      value={tempGrowthSummary}
                      onChange={(e) => setTempGrowthSummary(e.target.value)}
                      rows={4}
                      className={`${formElementStyle} bg-white/80 dark:bg-gray-700/80 text-current !mt-0`}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => setIsEditingGrowthSummary(false)} className="!text-current">Cancel</Button>
                      <Button size="sm" variant="primary" onClick={handleSaveGrowthSummary} className="!bg-white/30 hover:!bg-white/50 !text-current">Save</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-md sm:text-lg leading-relaxed">{displayGrowthSummary}</p>
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        className="!text-current !border-current hover:!bg-opacity-20 absolute top-1 right-10 hc-button-outline !p-1" 
                        onClick={handleEditGrowthSummary}
                        aria-label="Edit Growth Summary"
                    >
                        <Icons.Assignments className="w-4 h-4"/>
                    </Button>
                  </>
                )}
                <Button size="sm" variant="ghost" className="!text-current !border-current hover:!bg-opacity-20 absolute top-1 right-1 hc-button-outline !p-1" onClick={() => alert("Shared Growth Snapshot (mocked)")} aria-label="Share Growth Snapshot">
                    <Icons.Share className="w-4 h-4"/>
                </Button>
              </div>, 
              "📈 Growth Snapshot", 
              `bg-gradient-to-r from-academic-blue to-blue-500 text-white dark:from-blue-600 dark:to-blue-700 shadow-xl relative hc-bg-secondary hc-text-primary`
            );
          case 'attendanceSummary':
            return renderWidgetContent('attendanceSummary', 
              <div className="flex items-center justify-center p-2 cursor-pointer" onClick={handleAttendanceCardClick}>
                  <Icons.CalendarDays className={`w-10 h-10 mr-3 ${student.attendance && student.attendance >= 90 ? 'text-accent-green dark:text-green-400 hc-accent-secondary-text' : 'text-accent-yellow dark:text-yellow-400 hc-accent-primary-text'}`}/>
                  <div>
                    <p className={`text-2xl font-bold ${student.attendance && student.attendance >= 90 ? 'text-accent-green dark:text-green-400 hc-accent-secondary-text' : 'text-accent-yellow dark:text-yellow-400 hc-accent-primary-text'}`}>
                        {student.attendance || 'N/A'}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 hc-text-secondary">Overall This Term (Click to view)</p>
                  </div>
              </div>, undefined, "hover:shadow-lg transition-shadow hc-bg-secondary"
            );
          case 'assignmentSummary':
            return renderWidgetContent('assignmentSummary',
               <div className="flex items-center justify-center p-2 cursor-pointer" onClick={handleAssignmentCardClick}>
                  <Icons.Assignments className={`w-10 h-10 mr-3 text-academic-blue dark:text-blue-400 hc-accent-secondary-text`}/>
                  <div>
                    <p className={`text-xl font-bold text-academic-blue dark:text-blue-400 hc-accent-secondary-text`}>
                        {studentAssignments.filter(a => a.submissionDetails || a.isSubmitted).length} Sub. / {studentAssignments.filter(a => !(a.submissionDetails || a.isSubmitted) && new Date(a.dueDate) >= new Date()).length} Pend.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 hc-text-secondary">(Click to view details)</p>
                  </div>
              </div>, undefined, "hover:shadow-lg transition-shadow hc-bg-secondary"
            );
          case 'strengthsFocus':
            return renderWidgetContent('strengthsFocus',
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-md hc-bg-secondary">
                  <h4 className="font-semibold text-green-700 dark:text-green-300 hc-accent-secondary-text mb-1">💪 Your Strengths</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-700 dark:text-green-300 text-sm hc-text-secondary">
                    {displayStrengths.map((strength, i) => <li key={i}>{strength}</li>)}
                  </ul>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-md hc-bg-secondary">
                  <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 hc-accent-primary-text mb-1">🎯 Areas for Focus</h4>
                  <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300 text-sm hc-text-secondary">
                    {displayFocusAreas.map((area, i) => <li key={i}>{area}</li>)}
                  </ul>
                </div>
              </div>, undefined, "hc-bg-secondary"
            );
          case 'subjectInsights':
            return renderWidgetContent('subjectInsights', 
              <div className="space-y-3">
                {advisorReport.subjectInsights.map((insight, index) => (
                  <Card 
                      key={index} 
                      title={insight.subjectName} 
                      className="shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-700 hc-bg-secondary"
                      onClick={() => openSubjectModal(insight)}
                      actions={<Button size="sm" variant="ghost" className="!text-xs" onClick={(e) => { e.stopPropagation(); openSubjectModal(insight); }}>View Details</Button>}
                  >
                    <div className="mb-1.5 text-xs">
                      <p><strong>Performance:</strong> <span className={getPerformanceColor(insight.currentPerformance)}>{insight.currentPerformance || 'N/A'}</span></p>
                      <p><strong>Trend:</strong> <span className={getPerformanceColor(insight.trend)}>{insight.trend || 'N/A'}</span></p>
                    </div>
                    <div className="mb-1.5">
                      <h4 className="font-semibold text-gray-600 dark:text-gray-300 text-xs hc-text-secondary">Key Suggestions:</h4>
                      <ul className="list-disc list-inside text-[11px] text-gray-600 dark:text-gray-300 space-y-0.5 pl-3 hc-text-secondary">
                        {insight.aiSuggestions.slice(0,2).map((sug, i) => <li key={i}>{sug.text}</li>)}
                      </ul>
                    </div>
                  </Card>
                ))}
              </div>, undefined, "hc-bg-secondary"
            );
          case 'actionPlan':
            return renderWidgetContent('actionPlan',
              <ul className="space-y-2">
                  {actionPlan.map((step) => (
                      <li key={step.id} className="p-2.5 bg-white dark:bg-gray-700 rounded-md shadow-sm flex items-center justify-between hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors hc-bg-secondary">
                          <div className="flex items-center">
                              <Checkbox id={`action-${step.id}`} label="" checked={step.completed} onChange={() => toggleActionStep(step.id)} className="mr-2 sm:mr-3"/>
                              <label htmlFor={`action-${step.id}`} className={`flex-1 text-xs sm:text-sm ${step.completed ? 'line-through text-gray-500 dark:text-gray-400 hc-text-secondary' : 'text-gray-700 dark:text-gray-200 hc-text-primary'} cursor-pointer`}>
                                  {step.task} 
                                  <span className="ml-1.5 text-[10px] sm:text-xs bg-indigo-200 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-200 px-1 py-0.5 rounded-full hc-bg-secondary hc-text-accent-secondary-text">{step.category}</span>
                              </label>
                          </div>
                          {step.completed && <Icons.CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 dark:text-green-400 hc-text-accent-secondary-text"/>}
                      </li>
                  ))}
              </ul>, undefined, "bg-indigo-50 dark:bg-indigo-900/30 hc-bg-secondary"
            );
          case 'studyPlan':
            return advisorReport.weeklyStudyPlan && renderWidgetContent('studyPlan',
              <div className="space-y-3">
                {advisorReport.weeklyStudyPlan.map((dayPlan, idx) => (
                  <div key={idx} className="p-2.5 bg-white dark:bg-gray-700 rounded shadow-sm hc-bg-secondary">
                    <h5 className="font-semibold text-lime-700 dark:text-lime-300 hc-accent-secondary-text">{dayPlan.day} {dayPlan.focus && <span className="text-xs font-normal text-gray-500 dark:text-gray-400 hc-text-secondary"> - Focus: {dayPlan.focus}</span>}</h5>
                    <ul className="list-disc list-inside pl-3 text-xs text-gray-600 dark:text-gray-300 space-y-0.5 hc-text-secondary">
                      {dayPlan.tasks.map((task, tIdx) => (
                        <li key={tIdx}>
                          <strong>{task.time}:</strong> {task.activity} {task.subject && `(${task.subject})`}
                          {task.resources && task.resources.map((res, rIdx) => (
                             <a key={rIdx} href={res.url || '#'} target="_blank" rel="noopener noreferrer" className="ml-1 text-academic-blue dark:text-blue-400 text-[10px] hover:underline hc-accent-secondary-text">[{res.name}]</a>
                          ))}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>, undefined, "bg-lime-50 dark:bg-lime-900/30 hc-bg-secondary"
            );
          case 'electiveSuggestions':
             return advisorReport.electiveSuggestions && advisorReport.electiveSuggestions.length > 0 && renderWidgetContent('electiveSuggestions',
                <ul className="space-y-1.5 text-sm">
                    {advisorReport.electiveSuggestions.map((elective, idx) => (
                        <li key={idx} className="p-2 bg-white dark:bg-gray-700 rounded shadow-sm hc-bg-secondary">
                            <p className="font-semibold text-cyan-700 dark:text-cyan-300 hc-accent-secondary-text">{elective.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 hc-text-secondary">{elective.reason}</p>
                        </li>
                    ))}
                </ul>, undefined, "bg-cyan-50 dark:bg-cyan-900/30 hc-bg-secondary"
            );
            case 'performanceOutlook':
              return advisorReport.performanceOutlook && renderWidgetContent('performanceOutlook',
                <div>
                  <p className="italic text-gray-700 dark:text-gray-300 hc-text-secondary">"{advisorReport.performanceOutlook.outlookStatement}"</p>
                  <h5 className="font-semibold mt-2 text-sm text-gray-600 dark:text-gray-400 hc-text-secondary">Key actions to support this:</h5>
                  <ul className="list-disc list-inside text-xs text-gray-500 dark:text-gray-400 pl-4 space-y-0.5 hc-text-secondary">
                    {advisorReport.performanceOutlook.keySupportingActions.map((action, idx) => <li key={idx}>{action}</li>)}
                  </ul>
                </div>, undefined, "bg-purple-50 dark:bg-purple-900/30 hc-bg-secondary"
              );
            case 'subjectCorrelations': 
              return advisorReport.subjectCorrelations && advisorReport.subjectCorrelations.length > 0 && renderWidgetContent('subjectCorrelations',
                <div className="space-y-2">
                  {advisorReport.subjectCorrelations.map((corr, idx) => (
                    <div key={idx} className="p-2 bg-white dark:bg-gray-700 rounded shadow-sm hc-bg-secondary">
                      <p className="text-sm font-semibold">
                        <span className="text-blue-600 dark:text-blue-400 hc-accent-secondary-text">{corr.subjectA}</span> &harr; <span className="text-green-600 dark:text-green-400 hc-accent-secondary-text">{corr.subjectB}</span>
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${corr.correlationType === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 hc-bg-green-700 hc-text-green-100' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100 hc-bg-yellow-700 hc-text-yellow-100'}`}>
                          {corr.correlationType}
                        </span>
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 hc-text-secondary mt-0.5">{corr.description}</p>
                      {corr.suggestion && <p className="text-xs italic text-academic-blue dark:text-blue-400 hc-accent-secondary-text mt-0.5">Tip: {corr.suggestion}</p>}
                    </div>
                  ))}
                </div>, undefined, "bg-teal-50 dark:bg-teal-900/30 hc-bg-secondary"
              );
          case 'careerPathways':
             return advisorReport.careerPathways.length > 0 && renderWidgetContent('careerPathways',
                <>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 hc-text-secondary">Based on your current strengths and interests, here are some career paths you might find interesting to explore:</p>
                <div className="flex flex-wrap gap-2">
                    {advisorReport.careerPathways.map((path, i) => (
                    <div key={i} className="bg-white dark:bg-gray-700 p-2 rounded-md shadow border border-gray-200 dark:border-gray-600 text-xs sm:text-sm hc-bg-secondary hc-border-primary">
                        <p className="font-semibold text-academic-blue dark:text-blue-400 hc-accent-secondary-text">{path.name}</p>
                        {path.relevance && <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hc-text-secondary">{path.relevance}</p>}
                    </div>
                    ))}
                </div>
                </>, undefined, "bg-gray-50 dark:bg-gray-700/50 hc-bg-secondary"
            );
          case 'motivationalGoal':
            return renderWidgetContent('motivationalGoal',
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-md text-center hc-bg-secondary">
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300 hc-accent-secondary-text mb-1">🌟 Motivational Tip</h4>
                    <blockquote className="text-sm italic text-purple-700 dark:text-purple-300 hc-text-secondary">"{advisorReport.motivationalQuote.quote}"
                    {advisorReport.motivationalQuote.author && <footer className="mt-1 text-xs text-purple-500 dark:text-purple-400 hc-text-secondary">- {advisorReport.motivationalQuote.author}</footer>}
                    </blockquote>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/30 p-3 rounded-md hc-bg-secondary">
                    <h4 className="font-semibold text-teal-700 dark:text-teal-300 hc-accent-secondary-text mb-1">🎯 Your Weekly Goal</h4>
                    {currentGoal && <p className="text-xs text-teal-700 dark:text-teal-300 mb-1 p-1 bg-teal-100 dark:bg-teal-700/50 rounded hc-text-secondary">Current: <strong>{currentGoal}</strong></p>}
                    <div className="flex gap-1.5">
                        <input id="goal-input-field" type="text" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} placeholder="e.g., Complete Math Ch. 4" className={`${formElementStyle} flex-grow !mt-0 !py-1.5 !text-xs`} />
                        <Button variant="primary" onClick={handleSetGoal} className="bg-teal-500 hover:bg-teal-600 focus:ring-teal-500 !py-1 !px-2.5 !text-xs hc-button-primary">Set</Button>
                    </div>
                </div>
              </div>, undefined, "hc-bg-secondary"
            );
             case 'gamifiedScoreboard': 
              return gamificationEnabled && renderWidgetContent('gamifiedScoreboard',
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent-yellow dark:text-yellow-400 hc-accent-primary-text">🏆 1,250 Points</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 hc-text-secondary">Level: Explorer | Next Badge: Math Whiz</p>
                  <div className="mt-2 flex justify-center space-x-2">
                    <span className="bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs hc-bg-secondary hc-text-accent-secondary-text">Attendance Champ</span>
                    <span className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-200 px-2 py-0.5 rounded-full text-xs hc-bg-secondary hc-text-accent-secondary-text">Quick Learner</span>
                  </div>
                </div>, undefined, "bg-yellow-50 dark:bg-yellow-900/30 hc-bg-secondary"
            );
          default: return null;
        }
      })}
      
      <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6 hc-text-secondary">
        Disclaimer: This advice is AI-generated and intended for guidance purposes only. Always discuss your academic path with your teachers and parents.
      </div>

      <Modal isOpen={isManageWidgetsModalOpen} onClose={() => setIsManageWidgetsModalOpen(false)} title="Manage Advisor Widgets" size="lg">
        <div className="space-y-1 max-h-[60vh] overflow-y-auto p-1">
          {Object.values(widgetsConfig).sort((a,b) => a.order - b.order).map((widget, index, arr) => (
            <div key={widget.id} className="flex items-center justify-between p-2 border-b dark:border-gray-700 hc-border-primary last:border-b-0">
                <Checkbox
                  id={`widget-toggle-${widget.id}`}
                  label={widget.name}
                  checked={widget.isVisible}
                  onChange={(e) => handleWidgetVisibilityChange(widget.id as AdvisorWidgetId, e.target.checked)}
                  icon={widget.icon ? React.createElement(Icons[widget.icon as keyof typeof Icons], { className: "w-5 h-5 mr-2 text-gray-500 dark:text-gray-400 hc-text-secondary" }) : undefined}
                />
                <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleWidgetOrderChange(widget.id as AdvisorWidgetId, 'up')} disabled={index === 0} aria-label="Move up">↑</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleWidgetOrderChange(widget.id as AdvisorWidgetId, 'down')} disabled={index === arr.length - 1} aria-label="Move down">↓</Button>
                </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between items-center">
          <Button variant="outline" onClick={restoreDefaultWidgets}>Restore Defaults</Button>
          <Button variant="primary" onClick={() => setIsManageWidgetsModalOpen(false)}>Done</Button>
        </div>
      </Modal>

      <Modal isOpen={isEditingStrengthsFocus} onClose={() => setIsEditingStrengthsFocus(false)} title="Edit Strengths & Focus Areas" size="md">
        <div className="space-y-4">
            <div>
                <label htmlFor="editStrengths" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Your Strengths (comma-separated)</label>
                <textarea 
                    id="editStrengths"
                    value={tempStrengths}
                    onChange={(e) => setTempStrengths(e.target.value)}
                    rows={3}
                    className={`${formElementStyle} mt-1`}
                />
            </div>
            <div>
                <label htmlFor="editFocusAreas" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Areas for Focus (comma-separated)</label>
                <textarea 
                    id="editFocusAreas"
                    value={tempFocusAreas}
                    onChange={(e) => setTempFocusAreas(e.target.value)}
                    rows={3}
                    className={`${formElementStyle} mt-1`}
                />
            </div>
            <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setIsEditingStrengthsFocus(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSaveStrengthsFocus}>Save Changes</Button>
            </div>
        </div>
      </Modal>


      <SubjectDetailModal isOpen={isSubjectModalOpen} onClose={() => setIsSubjectModalOpen(false)} insight={selectedSubjectInsight} reportCards={studentReportCards}/>
      <StudentAttendanceCalendarModal isOpen={isAttendanceModalOpen} onClose={() => setIsAttendanceModalOpen(false)} student={student} attendanceRecords={studentAttendanceRecords}/>
      <AssignmentPerformanceModal isOpen={isAssignmentModalOpen} onClose={() => setIsAssignmentModalOpen(false)} student={student} assignments={studentAssignments}/>
      <AskAIModal isOpen={isAskAIModalOpen} onClose={() => setIsAskAIModalOpen(false)} studentName={student?.name}/>
    </div>
  );
};

export default StudentGrowthAdvisorPage;