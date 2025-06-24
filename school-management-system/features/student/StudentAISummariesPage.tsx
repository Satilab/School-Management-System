import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai"; // Correct imports
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { Icons } from '../../constants';
import { Subject, SubjectTopic } from '../../types'; // Removed StudentEnrollment as it's not directly used here
import { getEnrolledSubjectsForStudent, getTopicsForSubject } from '../../services/mockData';

interface StudentAISummariesPageProps {
  studentId: string;
}

const StudentAISummariesPage: React.FC<StudentAISummariesPageProps> = ({ studentId }) => {
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  
  const [enrolledSubjects, setEnrolledSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [topicsForSelectedSubject, setTopicsForSelectedSubject] = useState<SubjectTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<SubjectTopic | null>(null);
  
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const formElementStyle = "w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-academic-blue focus:border-academic-blue " +
                           "bg-white text-gray-900 placeholder-gray-500 border-gray-300 " +
                           "dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 " +
                           "hc-bg-secondary hc-text-primary hc-border-primary hc-placeholder-text";

  const getAIClient = () => {
    if (!process.env.API_KEY) {
      console.error("API_KEY environment variable is not set.");
      setError("AI service is not configured. Please contact support.");
      return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  };

  useEffect(() => {
    setIsLoadingSubjects(true);
    setTimeout(() => {
      const subjects = getEnrolledSubjectsForStudent(studentId);
      setEnrolledSubjects(subjects);
      if (subjects.length > 0) {
        setSelectedSubject(subjects[0]);
      }
      setIsLoadingSubjects(false);
    }, 300);
  }, [studentId]);

  useEffect(() => {
    if (selectedSubject) {
      setIsLoadingTopics(true);
      setTopicsForSelectedSubject([]);
      setSelectedTopic(null);
      setSummaryText(null);
      setError(null);
      setTimeout(() => {
        const topics = getTopicsForSubject(selectedSubject.id);
        setTopicsForSelectedSubject(topics);
        setIsLoadingTopics(false);
      }, 300);
    }
  }, [selectedSubject]);

  const handleGenerateSummary = useCallback(async () => {
    if (!selectedSubject || !selectedTopic) {
      setError("Please select a subject and a topic.");
      return;
    }
    setIsLoadingSummary(true);
    setSummaryText(null);
    setError(null);

    const ai = getAIClient();
    if (!ai) {
        setIsLoadingSummary(false);
        return;
    }

    try {
      const prompt = `Generate a concise, easy-to-understand summary for a high school student about the topic "${selectedTopic.name}" within the subject "${selectedSubject.name}". 
      Focus on the key concepts, definitions, and important examples or facts. 
      The summary should be informative, accurate, and written in simple language. Aim for a length of about 150-200 words.`;
      
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17', 
        contents: prompt,
      });
      
      setSummaryText(response.text);

    } catch (apiError: any) {
      console.error("Error generating AI summary:", apiError);
      if (apiError.message && apiError.message.includes('API key not valid')) {
         setError("The AI service API key is invalid. Please contact support.");
      } else if (apiError.message && apiError.message.toLowerCase().includes('quota')) {
         setError("The AI service is currently unavailable due to quota limits. Please try again later.");
      }
      else {
        setError("Sorry, an error occurred while generating the summary. Please try again later.");
      }
      setSummaryText(null);
    }
    setIsLoadingSummary(false);
  }, [selectedSubject, selectedTopic]);

  useEffect(() => {
    if (selectedTopic && selectedSubject) {
      handleGenerateSummary();
    }
  }, [selectedTopic, selectedSubject, handleGenerateSummary]);


  const handleCopyToClipboard = () => {
    if (summaryText) {
      navigator.clipboard.writeText(summaryText)
        .then(() => alert("Summary copied to clipboard!"))
        .catch(err => console.error("Failed to copy text: ", err));
    }
  };

  const handleDownloadSummary = () => {
    if (summaryText && selectedTopic && selectedSubject) {
      const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${selectedSubject.name.replace(/\s+/g, '_')}-${selectedTopic.name.replace(/\s+/g, '_')}_Summary.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
  };
  
  const handleTogglePlayAudio = () => {
    if (!summaryText) return;
    const synth = window.speechSynthesis;
    if (!synth) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (isSpeaking) {
      synth.pause();
      setIsSpeaking(false);
    } else {
      if (synth.paused && utteranceRef.current) {
        synth.resume();
        setIsSpeaking(true);
      } else {
        if (synth.speaking) {
            synth.cancel();
        }
        const utterance = new SpeechSynthesisUtterance(summaryText);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (event) => {
            console.error('SpeechSynthesisUtterance.onerror', event);
            setIsSpeaking(false);
            alert("Error playing audio.");
        };
        utteranceRef.current = utterance;
        synth.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const handleStopAudio = () => {
    const synth = window.speechSynthesis;
    if (synth && (synth.speaking || synth.paused)) {
      synth.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    }
  };
  
  useEffect(() => {
    return () => {
      const synth = window.speechSynthesis;
      if (synth && (synth.speaking || synth.paused)) {
        synth.cancel();
      }
    };
  }, []);


  if (isLoadingSubjects) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">Subject-wise AI Summaries</h1>

      {enrolledSubjects.length === 0 && (
        <Card className="hc-bg-secondary"><p className="text-center text-gray-500 dark:text-gray-400 hc-text-secondary py-8">You are not enrolled in any subjects eligible for AI summaries.</p></Card>
      )}

      {enrolledSubjects.length > 0 && (
        <Card className="hc-bg-secondary">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 hc-text-primary mb-2">Select Subject:</h2>
            <div className="flex flex-wrap gap-2 border-b pb-3 mb-3 dark:border-gray-700 hc-border-primary">
              {enrolledSubjects.map(subject => (
                <Button
                  key={subject.id}
                  variant={selectedSubject?.id === subject.id ? 'primary' : 'outline'}
                  onClick={() => setSelectedSubject(subject)}
                  size="sm"
                  leftIcon={subject.iconName && Icons[subject.iconName as keyof typeof Icons] ? React.createElement(Icons[subject.iconName as keyof typeof Icons]!, {className: 'w-4 h-4'}) : undefined}
                >
                  {subject.name}
                </Button>
              ))}
            </div>
          </div>

          {selectedSubject && (
            <div className="mb-4">
              <label htmlFor="topicSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary mb-1">
                Select Topic for {selectedSubject.name}:
              </label>
              {isLoadingTopics ? <Spinner size="sm" /> : (
                <select
                  id="topicSelect"
                  value={selectedTopic?.id || ''}
                  onChange={(e) => {
                    const topicId = e.target.value;
                    setSelectedTopic(topicsForSelectedSubject.find(t => t.id === topicId) || null);
                  }}
                  className={formElementStyle}
                  disabled={topicsForSelectedSubject.length === 0}
                >
                  <option value="">-- Select a Topic --</option>
                  {topicsForSelectedSubject.map(topic => (
                    <option key={topic.id} value={topic.id}>{topic.name}</option>
                  ))}
                </select>
              )}
              {topicsForSelectedSubject.length === 0 && !isLoadingTopics && <p className="text-sm text-gray-500 dark:text-gray-400 hc-text-secondary mt-1">No topics available for this subject yet.</p>}
            </div>
          )}

          {isLoadingSummary && <Spinner />}
          
          {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-300 p-3 rounded-md my-4 hc-bg-secondary hc-text-accent-primary-text">{error}</p>}

          {summaryText && !isLoadingSummary && (
            <Card title={`AI Summary for: ${selectedTopic?.name}`} className="bg-academic-blue bg-opacity-5 dark:bg-blue-900/20 hc-bg-secondary">
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 hc-text-secondary whitespace-pre-wrap p-4 rounded-md bg-white dark:bg-gray-700 shadow hc-bg-primary">
                {summaryText}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-end">
                <Button onClick={handleCopyToClipboard} size="sm" variant="ghost" leftIcon={<Icons.Copy className="w-4 h-4" />}>Copy</Button>
                <Button onClick={handleDownloadSummary} size="sm" variant="ghost" leftIcon={<Icons.Download className="w-4 h-4" />}>Download</Button>
                <Button onClick={handleTogglePlayAudio} size="sm" variant="ghost" leftIcon={isSpeaking ? <Icons.Pause className="w-4 h-4" /> : <Icons.Play className="w-4 h-4" />}>
                  {isSpeaking ? 'Pause' : (window.speechSynthesis?.paused ? 'Resume' : 'Listen')}
                </Button>
                {isSpeaking && <Button onClick={handleStopAudio} size="sm" variant="danger" leftIcon={<Icons.Stop className="w-4 h-4" />}>Stop</Button>}
              </div>
            </Card>
          )}
          {!summaryText && !isLoadingSummary && selectedTopic && !error && (
            <p className="text-gray-500 dark:text-gray-400 hc-text-secondary mt-4">Summary will appear here once generated.</p>
          )}
        </Card>
      )}
    </div>
  );
};

export default StudentAISummariesPage;