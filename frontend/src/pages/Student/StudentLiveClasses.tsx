import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Video, Calendar, Clock, User, ExternalLink } from 'lucide-react';

export const StudentLiveClasses: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.get('/student/live-classes')
      .then((res) => setClasses(res.data))
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Live Masterclasses & Q&A Schedule</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Synchronous interactive sessions hosted by your course instructors and mentors.
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-white dark:bg-zinc-950 p-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center space-y-2">
          <Video className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">No Live Classes Currently Scheduled</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Your mentors will post scheduled class announcements here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 uppercase bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-300 dark:border-zinc-700">
                  {cls.course?.title}
                </span>
                <h3 className="font-bold text-base text-zinc-900 dark:text-white mt-1">{cls.title}</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">{cls.description}</p>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center space-x-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span>{new Date(cls.scheduledAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Duration: {cls.durationMinutes} Minutes</span>
                  </div>
                </div>

                <a
                  href={cls.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Classroom</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
