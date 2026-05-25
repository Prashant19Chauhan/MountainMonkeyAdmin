import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { SEOFormData } from '../../types/type';

export const TwitterCardsSection = ({ register }: { register: UseFormRegister<SEOFormData> }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Twitter Cards</h3>
        <p className="text-sm text-gray-500">Specific markup for rendering summary cards on Twitter/X.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
          <select {...register('twitterCardType')} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none">
            <option value="summary_large_image">summary_large_image</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Creator (Twitter Handle)</label>
          <input {...register('twitterCreator')} type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Title</label>
          <input {...register('twitterTitle')} type="text" placeholder="Leave blank to inherit OG Title" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Description</label>
          <textarea {...register('twitterDescription')} rows={2} placeholder="Leave blank to inherit OG Description" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Image URL</label>
          <input {...register('twitterImageUrl')} type="text" placeholder="Leave blank to inherit OG Image" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none" />
        </div>
      </div>
    </div>
  );
};
