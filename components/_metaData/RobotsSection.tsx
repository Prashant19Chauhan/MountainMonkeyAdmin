import React from 'react';
import { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { SEOFormData } from '../../types/type';

export const RobotsSection = ({ register, watch, setValue }: { register: UseFormRegister<SEOFormData>; watch: UseFormWatch<SEOFormData>; setValue: UseFormSetValue<SEOFormData> }) => {
  const toggleSwitch = (field: keyof SEOFormData) => {
    setValue(field, !watch(field));
  };

  const switches: { id: keyof SEOFormData; label: string; sub: string }[] = [
    { id: 'index', label: 'Index', sub: 'Allow search engines to index this page' },
    { id: 'follow', label: 'Follow', sub: 'Allow search engines to follow links on this page' },
    { id: 'noArchive', label: 'No Archive', sub: 'Prevent search engines from caching this page' },
    { id: 'noSnippet', label: 'No Snippet', sub: 'Prevent search engines from showing snippets' },
    { id: 'noImageIndex', label: 'No Image Index', sub: 'Prevent indexing of images on this page' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Robots Directives</h3>
        <p className="text-sm text-gray-500">Control how search engine crawlers interact with this page.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {switches.map((item) => {
          const isActive = watch(item.id);
          return (
            <div key={String(item.id)} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/30">
              <div>
                <label className="block text-sm font-semibold text-gray-800">{item.label}</label>
                <span className="text-xs text-gray-400">{item.sub}</span>
              </div>
              <button
                type="button"
                onClick={() => toggleSwitch(item.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${isActive ? 'bg-slate-900' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
