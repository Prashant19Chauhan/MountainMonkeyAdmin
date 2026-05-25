'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SEOFormData } from '../../../types/type';
import { BasicSEOSection } from '../../../components/_metaData/BasicSEOSection';
import { RobotsSection } from '@/components/_metaData/RobotsSection';
import { OpenGraphSection } from '@/components/_metaData/OpenGraphSection';
import { TwitterCardsSection } from '@/components/_metaData/TwitterCardsSection';
import { SchemaSection } from '@/components/_metaData/SchemaSection';
import { SitemapSection } from '@/components/_metaData/SitemapSection';
import useMetaData from '@/hooks/useMetaData';

export default function SEOMetaConfiguration() {
  const [activeTab, setActiveTab] = useState('Basic SEO');

  const { pageId, metaData, isLoading, isSaving, saveMetaData } = useMetaData();

  const { register, handleSubmit, watch, setValue, control, reset } = useForm<SEOFormData>({
    defaultValues: {
      metaTitle: '',
      metaDescription: '',
      focusKeyword: '',
      canonicalUrl: '',
      keywords: [],
      secondaryKeywords: [],
      index: true,
      follow: true,
      noArchive: false,
      noSnippet: false,
      noImageIndex: false,
      ogType: 'website',
      ogSiteName: 'Ghumakkad Go',
      ogLocale: 'en_US',
      ogImageWidth: 1200,
      ogImageHeight: 630,
      twitterCardType: 'summary_large_image',
      twitterCreator: '@ghumakkadgo',
      schemaType: 'Product',
      breadcrumbTitle: '',
      customStructuredData: `{ "@context": "https://schema.org", "@type": "Product" }`,
      faqSchema: [],
      hreflang: [],
      includeInSitemap: true,
      changeFrequency: 'weekly',
      priority: 0.8,
      lastModified: '',
    },
  });

  // Sync form values once backend metadata is fetched successfully
  useEffect(() => {
    if (metaData) {
      reset({
        ...metaData
      });
    }
  }, [metaData?.metaTitle]);

  const onSubmit = async (data: SEOFormData) => {
    try {
      await saveMetaData(data);
    } catch (e) {
      // Mutation handles Toast notifications
    }
  };

  const tabs = [
    'Basic SEO',
    'Robots Directives',
    'Open Graph (Social)',
    'Twitter Cards',
    'Schema & Advanced',
    'Sitemap Configuration',
  ];

  // Render a user-friendly loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray-500">Loading meta data settings...</p>
        </div>
      </div>
    );
  }

  // Render a friendly error page when accessed without a valid content page ID
  if (!pageId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white border border-red-100 shadow-lg rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            ⚠
          </div>
          <h2 className="text-xl font-bold text-gray-900">Missing Page ID</h2>
          <p className="text-sm text-gray-500">
            This SEO settings configuration page must be accessed via a specific content type (e.g. from Package, Stay, Activity, City, or Destination management).
          </p>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition shadow-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans text-slate-900">
      {/* Upper Navigation Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200 gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => window.history.back()} className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500">
            ←
          </button>
          <div>
            <span className="text-xs text-gray-400 font-medium">System / SEO</span>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">SEO & Meta Data Configuration</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="bg-emerald-50 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-100">
            ✓ SEO Score: {metaData?.metaTitle && metaData?.metaDescription ? '85/100' : '0/100'}
          </div>
          <button
            type="button"
            onClick={() => reset(metaData || {})}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition"
          >
            Discard Changes
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed rounded-xl shadow-sm transition flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : "Save Meta Data"}
          </button>
        </div>
      </div>

      {/* Main Container Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 items-start">
        {/* Navigation Sidebar panel */}
        <div className="flex flex-col space-y-1 lg:col-span-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">Sections</span>
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === tab
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Action Panel dynamic views switcher */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
          {activeTab === 'Basic SEO' && <BasicSEOSection register={register} />}
          {activeTab === 'Robots Directives' && <RobotsSection register={register} watch={watch} setValue={setValue} />}
          {activeTab === 'Open Graph (Social)' && <OpenGraphSection register={register} />}
          {activeTab === 'Twitter Cards' && <TwitterCardsSection register={register} />}
          {activeTab === 'Schema & Advanced' && <SchemaSection register={register} control={control} />}
          {activeTab === 'Sitemap Configuration' && <SitemapSection register={register} watch={watch} setValue={setValue} />}
        </div>
      </div>
    </form>
  );
}