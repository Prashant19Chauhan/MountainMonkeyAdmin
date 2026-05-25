import React from 'react';
import { UseFormRegister, useFieldArray, Control } from 'react-hook-form';
import { SEOFormData } from '../../types/type';

export const SchemaSection = ({ register, control }: { register: UseFormRegister<SEOFormData>; control: Control<SEOFormData> }) => {
  const { fields: faqFields, append: appendFaq } = useFieldArray({ control, name: 'faqSchema' });
  const { fields: langFields, append: appendLang } = useFieldArray({ control, name: 'hreflang' });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-blue-600">Schema & Advanced</h3>
        <p className="text-sm text-gray-500">Structured data and localization settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Schema Type</label>
          <select {...register('schemaType')} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none">
            <option value="Product">Product, Article, WebPage...</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Breadcrumb Title</label>
          <input {...register('breadcrumbTitle')} type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Custom Structured Data (JSON-LD)</label>
        <textarea
          {...register('customStructuredData')}
          rows={3}
          className="w-full p-4 font-mono text-xs bg-zinc-900 text-green-400 rounded-xl focus:outline-none"
        />
      </div>

      {/* FAQ Schema Dynamic Fields */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-800">FAQ Schema</span>
          <button type="button" onClick={() => appendFaq({ question: '', answer: '' })} className="text-xs text-blue-600 font-medium">+ Add FAQ</button>
        </div>
        {faqFields.map((field, index) => (
          <div key={field.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Question</label>
              <input {...register(`faqSchema.${index}.question`)} type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Answer</label>
              <input {...register(`faqSchema.${index}.answer`)} type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Alternate Languages */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-800">Alternate Languages</span>
          <button type="button" onClick={() => appendLang({ language: 'es-ES', url: '' })} className="text-xs text-blue-600 font-medium">+ Add Hreflang</button>
        </div>
        {langFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select {...register(`hreflang.${index}.language`)} className="px-3 py-2 border border-gray-200 rounded-lg bg-white">
              <option value="es-ES">es-ES</option>
            </select>
            <input {...register(`hreflang.${index}.url`)} type="url" placeholder="https://..." className="px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
};
