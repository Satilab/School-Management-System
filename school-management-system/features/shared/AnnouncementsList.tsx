
import React from 'react';
import Card from '../../components/ui/Card';
import { Announcement } from '../../types';
import { Icons } from '../../constants';

interface AnnouncementsListProps {
  announcements: Announcement[];
  title?: string;
}

const AnnouncementsList: React.FC<AnnouncementsListProps> = ({ announcements, title = "Announcements" }) => {
  return (
    <Card title={title}>
      {announcements.length > 0 ? (
        <ul className="space-y-4">
          {announcements.map((announcement) => (
            <li key={announcement.id} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 pt-1">
                  <Icons.Communication className="h-5 w-5 text-academic-blue" />
                </div>
                <div>
                  <h4 className="text-md font-semibold text-academic-blue-dark">{announcement.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(announcement.date).toLocaleDateString()} - By {announcement.author}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No announcements at this time.</p>
      )}
    </Card>
  );
};

export default AnnouncementsList;
    