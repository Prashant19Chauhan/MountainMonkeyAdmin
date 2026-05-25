import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { SEOFormData } from '../../types/type';

export const OpenGraphSection = ({ register }: { register: UseFormRegister<SEOFormData> }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Open Graph Configuration</h3>
        <p className="text-sm text-gray-500">Determine how this page appears when shared on Facebook, LinkedIn, etc.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
          <input {...register('ogTitle')} type="text" placeholder="Same as Meta Title if empty" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OG Type</label>
          <select {...register('ogType')} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none">
            <option value="website">website</option>
            <option value="article">article</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">OG Description</label>
          <textarea {...register('ogDescription')} rows={2} placeholder="Same as Meta Description if empty" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OG Site Name</label>
          <input {...register('ogSiteName')} type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OG Locale</label>
          <select {...register('ogLocale')} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none">
            <option value="en_US">en_US</option>
          </select>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-4">
        <h4 className="text-sm font-semibold text-gray-800">OG Image Details</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input {...register('ogImageUrl')} type="text" placeholder="https://.../image.jpg" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image Alt Text</label>
          <input {...register('ogImageAlt')} type="text" placeholder="Description of the image" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Width</label>
            <input {...register('ogImageWidth')} type="number" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Height</label>
            <input {...register('ogImageHeight')} type="number" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none" />
          </div>
        </div>
      </div>
    </div>
  );
};