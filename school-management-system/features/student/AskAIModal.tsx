import React, { useState } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { Icons } from '../../constants';

interface AskAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
}

const AskAIModal: React.FC<AskAIModalProps> = ({ isOpen, onClose, studentName }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formElementStyle = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-academic-blue focus:border-academic-blue sm:text-sm " + 
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

  const handleSubmitQuestion = async () => {
    if (!question.trim()) {
      setError("Please type your question.");
      return;
    }
    setIsLoading(true);
    setAnswer('');
    setError(null);

    const ai = getAIClient();
    if (!ai) {
      setIsLoading(false);
      return;
    }

    const prompt = `You are a friendly and helpful academic assistant for a student named ${studentName || 'there'}.
The student has the following question: "${question}"
Please provide a clear, concise, and easy-to-understand answer. 
If the question is outside academic topics or inappropriate, politely decline to answer.
Keep the answer under 150 words.`;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
      });
      setAnswer(response.text);
    } catch (apiError: any) {
      console.error("Error asking AI:", apiError);
      if (apiError.message && apiError.message.includes('API key not valid')) {
        setError("The AI service API key is invalid. Please contact support.");
      } else {
        setError("Sorry, an error occurred while getting an answer. Please try again.");
      }
    }
    setIsLoading(false);
  };

  const handleCloseModal = () => {
    setQuestion('');
    setAnswer('');
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} title="Ask Your Academic Assistant" size="lg">
      <div className="space-y-4">
        <div>
          <label htmlFor="studentQuestion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">
            What would you like to ask about your studies or school topics?
          </label>
          <textarea
            id="studentQuestion"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className={formElementStyle}
            placeholder="e.g., Can you explain Newton's first law in simple terms?"
            disabled={isLoading}
          />
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <Spinner />
            <p className="text-sm text-gray-500 dark:text-gray-400 hc-text-secondary mt-2">Thinking...</p>
          </div>
        )}

        {error && <p className="text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300 p-3 rounded-md hc-bg-secondary hc-text-accent-primary-text">{error}</p>}

        {answer && !isLoading && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md hc-bg-secondary hc-border-accent-secondary-text">
            <h4 className="font-semibold text-academic-blue dark:text-blue-300 hc-text-accent-secondary-text mb-1 flex items-center">
              <Icons.Lightbulb className="w-5 h-5 mr-2" /> Here's what I found:
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-200 hc-text-secondary whitespace-pre-wrap">{answer}</p>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-2">
          <Button variant="ghost" onClick={handleCloseModal} disabled={isLoading}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitQuestion} isLoading={isLoading} disabled={!question.trim()}>
            Ask AI
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AskAIModal;