import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { SEOFormData } from '../../types/type';

export const BasicSEOSection = ({ register }: { register: UseFormRegister<SEOFormData> }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Basic SEO Settings</h3>
        <p className="text-sm text-gray-500">Primary search engine tags that appear in search results.</p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <label className="block font-medium text-gray-700">Meta Title <span className="text-amber-500">*</span></label>
            <span className="text-gray-400">50-60 chars</span>
          </div>
          <input
            {...register('metaTitle')}
            type="text"
            placeholder="e.g. Best Travel Packages to Bali | Ghumakkad Go"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <label className="block font-medium text-gray-700">Meta Description <span className="text-amber-500">*</span></label>
            <span className="text-gray-400">150-160 chars</span>
          </div>
          <textarea
            {...register('metaDescription')}
            rows={3}
            placeholder="A compelling description of the page content..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Focus Keyword</label>
            <input
              {...register('focusKeyword')}
              type="text"
              placeholder="e.g. bali travel package"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
            <input
              {...register('canonicalUrl')}
              type="url"
              placeholder="https://ghumakkadgo.com/packages/bali"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};