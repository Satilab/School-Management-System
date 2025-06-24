import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { Icons } from '../../constants';
import { SchoolEvent, UserRole } from '../../types';
import { mockEvents as initialMockEvents } from '../../services/mockData';

const AdminEventsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<SchoolEvent[]>(initialMockEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<SchoolEvent>>({
    title: '',
    date: new Date().toISOString().split('T')[0], // Default to today
    type: 'Activity',
    description: '',
    audience: [UserRole.STUDENT, UserRole.PARENT, UserRole.TEACHER, UserRole.ADMIN], // Default to all
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const formElementStyle = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-academic-blue focus:border-academic-blue sm:text-sm " + 
                           "bg-white text-gray-900 placeholder-gray-500 border-gray-300 " + 
                           "dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 " +
                           "hc-bg-secondary hc-text-primary hc-border-primary hc-placeholder-text";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentEvent(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAudienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value as UserRole);
    setCurrentEvent(prev => ({...prev, audience: selectedOptions }));
  }

  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent.title || !currentEvent.date || !currentEvent.type) {
      alert("Title, Date, and Type are required.");
      return;
    }

    if (isEditing && currentEvent.id) {
      const updatedEvents = events.map(event => event.id === currentEvent.id ? { ...event, ...currentEvent } as SchoolEvent : event);
      setEvents(updatedEvents);
      const globalIndex = initialMockEvents.findIndex(ev => ev.id === currentEvent.id);
      if(globalIndex !== -1) initialMockEvents[globalIndex] = { ...initialMockEvents[globalIndex], ...currentEvent } as SchoolEvent;

    } else {
      const newEventWithId: SchoolEvent = {
        id: `E${Date.now().toString().slice(-4)}`,
        ...currentEvent,
        title: currentEvent.title!,
        date: currentEvent.date!,
        type: currentEvent.type!,
      };
      setEvents(prev => [newEventWithId, ...prev].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      initialMockEvents.push(newEventWithId);
      initialMockEvents.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    
    setIsModalOpen(false);
    setCurrentEvent({ title: '', date: new Date().toISOString().split('T')[0], type: 'Activity', description: '', audience: [UserRole.STUDENT, UserRole.PARENT, UserRole.TEACHER, UserRole.ADMIN]});
    setIsEditing(false);
  };
  
  const openAddModal = () => {
    setIsEditing(false);
    setCurrentEvent({ title: '', date: new Date().toISOString().split('T')[0], type: 'Activity', description: '', audience: [UserRole.STUDENT, UserRole.PARENT, UserRole.TEACHER, UserRole.ADMIN]});
    setIsModalOpen(true);
  }
  
  const openEditModal = (event: SchoolEvent) => {
    setIsEditing(true);
    setCurrentEvent(event);
    setIsModalOpen(true);
  }
  
  const handleDeleteEvent = (eventId: string) => {
    if(window.confirm("Are you sure you want to delete this event?")) {
        setEvents(prev => prev.filter(event => event.id !== eventId));
        const globalIndex = initialMockEvents.findIndex(ev => ev.id === eventId);
        if(globalIndex !== -1) initialMockEvents.splice(globalIndex, 1);
    }
  }


  if (loading) return <Spinner />;

  // Group events by month for a very basic calendar-like display
  const eventsByMonth: { [month: string]: SchoolEvent[] } = events.reduce((acc, event) => {
    const monthYear = new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(event);
    return acc;
  }, {} as { [month: string]: SchoolEvent[] });
  
  const sortedMonthKeys = Object.keys(eventsByMonth).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">School Events Calendar</h1>
        <Button onClick={openAddModal} leftIcon={<Icons.Events className="w-5 h-5"/>}>
          Add New Event
        </Button>
      </div>

      {sortedMonthKeys.length > 0 ? sortedMonthKeys.map(month => (
        <Card key={month} title={month} className="shadow-lg">
          <ul className="space-y-3">
            {eventsByMonth[month].sort((a,b) => new Date(a.date).getDate() - new Date(b.date).getDate()).map(event => (
              <li key={event.id} className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-md border border-gray-200 dark:border-gray-700 hc-bg-secondary hc-border-primary">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                  <div>
                    <span className="text-xs text-academic-blue dark:text-blue-400 font-semibold hc-text-accent-secondary-text">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</span>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 hc-text-primary">{event.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 hc-text-secondary">Type: {event.type}</p>
                    {event.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 hc-text-secondary">{event.description}</p>}
                    {event.audience && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 hc-text-secondary">For: {event.audience.join(', ')}</p>}
                  </div>
                  <div className="flex space-x-2 mt-2 sm:mt-0 flex-shrink-0">
                     <Button size="sm" variant="outline" onClick={() => openEditModal(event)}>Edit</Button>
                     <Button size="sm" variant="danger" onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )) : (
        <Card><p className="text-center text-gray-500 py-8 dark:text-gray-400 hc-text-secondary">No events scheduled.</p></Card>
      )}

      {/* Add/Edit Event Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Event" : "Add New Event"} size="lg">
        <form onSubmit={handleSubmitEvent} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Event Title*</label>
            <input type="text" name="title" id="title" value={currentEvent.title} onChange={handleInputChange} required className={formElementStyle} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Date*</label>
                <input type="date" name="date" id="date" value={currentEvent.date} onChange={handleInputChange} required className={formElementStyle} />
            </div>
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Type*</label>
                <select name="type" id="type" value={currentEvent.type} onChange={handleInputChange} required className={formElementStyle}>
                    <option value="Activity">Activity</option>
                    <option value="Exam">Exam</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Seminar">Seminar</option>
                </select>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Description</label>
            <textarea name="description" id="description" value={currentEvent.description} onChange={handleInputChange} rows={3} className={formElementStyle} />
          </div>
          <div>
            <label htmlFor="audience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Audience (Ctrl/Cmd + Click for multiple)</label>
            <select 
                multiple 
                name="audience" 
                id="audience" 
                value={currentEvent.audience || []} 
                onChange={handleAudienceChange} 
                className={`${formElementStyle} h-32`}
            >
                {Object.values(UserRole).map(role => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">{isEditing ? "Save Changes" : "Add Event"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminEventsPage;