import React from 'react';
import { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { SEOFormData } from '../../types/type';

export const SitemapSection = ({ register, watch, setValue }: { register: UseFormRegister<SEOFormData>; watch: UseFormWatch<SEOFormData>; setValue: UseFormSetValue<SEOFormData> }) => {
  const isIncluded = watch('includeInSitemap');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Sitemap Configuration</h3>
        <p className="text-sm text-gray-500">Settings for XML sitemap generation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/30">
          <div>
            <label className="block text-sm font-semibold text-gray-800">Include in Sitemap</label>
            <span className="text-xs text-gray-400">Add this page to sitemap.xml</span>
          </div>
          <button
            type="button"
            onClick={() => setValue('includeInSitemap', !isIncluded)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isIncluded ? 'bg-slate-900' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isIncluded ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Change Frequency</label>
          <select {...register('changeFrequency')} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none">
            <option value="weekly">weekly</option>
            <option value="daily">daily</option>
            <option value="monthly">monthly</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <label className="font-medium text-gray-700">Priority</label>
            <span className="text-gray-400">0.0 to 1.0</span>
          </div>
          <input {...register('priority')} type="number" step="0.1" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Modified</label>
          <input {...register('lastModified')} type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none" />
        </div>
      </div>
    </div>
  );
};
