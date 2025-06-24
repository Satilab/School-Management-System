import React, { useState, useEffect, useContext } from 'react'; 
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Icons } from '../../constants';
import Checkbox from '../../components/ui/Checkbox'; 
import { ThemeContext } from '../../contexts/ThemeContext'; 
import { AdvisorGoal, OptionalFeature } from './settingsTypes'; 
import { LanguageOption, FontSizeOption, ThemeOption } from '../../types';


interface StudentSettingsPageProps {}


const StudentSettingsPage: React.FC<StudentSettingsPageProps> = () => {
  const { 
    selectedTheme, setThemeOption, 
    fontSize, setFontSizeOption, 
    language, setLanguageOption 
  } = useContext(ThemeContext);

  const [selectedAdvisorGoal, setSelectedAdvisorGoal] = useState<AdvisorGoal | ''>(() => {
    return (localStorage.getItem('studentAIAdvisorGoal') as AdvisorGoal | '') || '';
  });
  const [featureToggles, setFeatureToggles] = useState<Record<OptionalFeature, boolean>>(() => {
    const defaults: Record<OptionalFeature, boolean> = {
      gamification: false,
      collaboration_tools: true,
      subject_deep_dive_prompts: true,
    };
    try {
      const storedToggles = localStorage.getItem('studentFeatureToggles');
      return storedToggles ? JSON.parse(storedToggles) : defaults;
    } catch (e) {
      return defaults;
    }
  });

  useEffect(() => {
    localStorage.setItem('studentAIAdvisorGoal', selectedAdvisorGoal);
  }, [selectedAdvisorGoal]);

  useEffect(() => {
    localStorage.setItem('studentFeatureToggles', JSON.stringify(featureToggles));
    window.dispatchEvent(new CustomEvent('studentFeatureToggleChange', { detail: featureToggles }));
  }, [featureToggles]);


  const handleAdvisorGoalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAdvisorGoal(event.target.value as AdvisorGoal | '');
  };

  const handleFeatureToggle = (feature: OptionalFeature) => {
    setFeatureToggles(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value as LanguageOption;
    setLanguageOption(newLang); 
    alert(`Language selected: ${event.target.options[event.target.selectedIndex].text}. (Full i18n not implemented)`);
  };

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFontSizeOption(event.target.value as FontSizeOption);
  };
  
  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setThemeOption(event.target.value as ThemeOption);
  };
  
  const advisorGoalsOptions: {value: AdvisorGoal; label: string}[] = [
    {value: 'improve_math', label: 'Improve Math Scores'},
    {value: 'boost_attendance', label: 'Boost My Attendance'},
    {value: 'better_science_grades', label: 'Get Better Science Grades'},
    {value: 'explore_coding', label: 'Explore Coding & Tech'},
  ];

  const optionalFeaturesList: {id: OptionalFeature; label: string; description: string}[] = [
    {id: 'gamification', label: 'Enable Gamification', description: 'Earn points and badges for learning activities.'},
    {id: 'collaboration_tools', label: 'Enable Collaboration Tools', description: 'Share insights with parents/teachers (mock).'},
    {id: 'subject_deep_dive_prompts', label: 'Enable Subject Deep Dive AI Prompts', description: 'Get more specific AI prompts within subject views.'},
  ];

  const languageOptions: {value: LanguageOption; label: string}[] = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी (Hindi) - Mock' },
    { value: 'te', label: 'తెలుగు (Telugu) - Mock' },
    { value: 'es', label: 'Español (Spanish) - Mock' },
  ];
  
  const fontSizeOptionsList: {value: FontSizeOption; label: string}[] = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium (Default)' },
    { value: 'lg', label: 'Large' },
  ];

  const themeOptionsList: {value: ThemeOption; label: string}[] = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme' },
    { value: 'high-contrast', label: 'High Contrast' },
  ];

  const formSelectStyle = "mt-1 block w-full sm:w-2/3 md:w-1/2 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-academic-blue focus:border-academic-blue " +
                          "bg-white text-gray-900 border-gray-300 " + // Explicit light mode
                          "dark:bg-gray-700 dark:text-white dark:border-gray-600 " +
                          "hc-bg-secondary hc-text-primary hc-border-primary";


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">Settings</h1>

      <Card title="Display & Accessibility" className="hc-bg-secondary">
        <div className="space-y-4">
          <div>
            <label htmlFor="themeSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">
              Color Theme:
            </label>
            <select id="themeSelect" value={selectedTheme} onChange={handleThemeChange} className={formSelectStyle}>
              {themeOptionsList.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="fontSizeSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">
              Font Size:
            </label>
            <select id="fontSizeSelect" value={fontSize} onChange={handleFontSizeChange} className={formSelectStyle}>
              {fontSizeOptionsList.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="languageSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">
              Display Language:
            </label>
            <select id="languageSelect" value={language} onChange={handleLanguageChange} className={formSelectStyle}>
              {languageOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 hc-text-secondary mt-1">Full language support is illustrative.</p>
          </div>
        </div>
      </Card>

      <Card title="AI Growth Advisor Preferences" className="hc-bg-secondary">
        <div className="space-y-4">
          <div>
            <label htmlFor="advisorGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">
              My Primary Academic Goal:
            </label>
            <select id="advisorGoal" value={selectedAdvisorGoal} onChange={handleAdvisorGoalChange} className={formSelectStyle}>
              <option value="">-- No Specific Goal --</option>
              {advisorGoalsOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 hc-text-secondary mt-1">This helps the AI tailor suggestions for you.</p>
          </div>
        </div>
      </Card>

      <Card title="Optional Features" className="hc-bg-secondary">
        <div className="space-y-4">
          {optionalFeaturesList.map(feature => (
            <Checkbox
                key={feature.id}
                id={feature.id}
                label={feature.label}
                description={feature.description}
                checked={featureToggles[feature.id]}
                onChange={() => handleFeatureToggle(feature.id)}
            />
          ))}
        </div>
      </Card>
      
      <div className="mt-8 text-center">
        <Button variant="primary" onClick={() => alert('Settings saved (mocked)!')}>
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default StudentSettingsPage;