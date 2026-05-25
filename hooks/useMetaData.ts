import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMetaData, createMetaData, updateMetaData } from "@/services/metadata.service";
import { SEOFormData } from "@/types/type";
import { toast } from "react-toastify";

// Helper function to map frontend form data to backend payload
const mapFrontendToBackend = (formData: SEOFormData, pageId: string) => {
  let structuredDataObj = null;
  if (formData.customStructuredData) {
    try {
      structuredDataObj = JSON.parse(formData.customStructuredData);
    } catch (e) {
      structuredDataObj = formData.customStructuredData;
    }
  }

  return {
    pageId,
    metaTitle: formData.metaTitle,
    metaDescription: formData.metaDescription,
    focusKeyword: formData.focusKeyword || undefined,
    keywords: formData.keywords || [],
    secondaryKeywords: formData.secondaryKeywords || [],
    canonicalUrl: formData.canonicalUrl || undefined,
    robots: {
      index: formData.index,
      follow: formData.follow,
      noarchive: formData.noArchive,
      nosnippet: formData.noSnippet,
      noimageindex: formData.noImageIndex,
    },
    openGraph: {
      title: formData.ogTitle || undefined,
      description: formData.ogDescription || undefined,
      image: formData.ogImageUrl || undefined,
      imageAlt: formData.ogImageAlt || undefined,
      type: formData.ogType || "website",
      url: formData.canonicalUrl || undefined,
      siteName: formData.ogSiteName || undefined,
      locale: formData.ogLocale || "en_US",
    },
    twitter: {
      card: formData.twitterCardType || "summary_large_image",
      title: formData.twitterTitle || undefined,
      description: formData.twitterDescription || undefined,
      image: formData.twitterImageUrl || undefined,
      creator: formData.twitterCreator || undefined,
    },
    schemaType: formData.schemaType || undefined,
    structuredData: structuredDataObj,
    faqSchema: formData.faqSchema || [],
    breadcrumbTitle: formData.breadcrumbTitle || undefined,
    alternateLanguages: formData.hreflang?.map(item => ({
      language: item.language,
      url: item.url
    })) || [],
    ogImageWidth: formData.ogImageWidth ? Number(formData.ogImageWidth) : undefined,
    ogImageHeight: formData.ogImageHeight ? Number(formData.ogImageHeight) : undefined,
    priority: formData.priority ? Number(formData.priority) : 0.8,
    changeFrequency: formData.changeFrequency || "weekly",
    lastModified: formData.lastModified ? new Date(formData.lastModified).toISOString() : undefined,
    sitemapInclude: formData.includeInSitemap,
  };
};

// Helper function to map backend data to frontend form structure
const mapBackendToFrontend = (backendData: any): SEOFormData => {
  let customStructuredDataStr = "";
  if (backendData.structuredData) {
    if (typeof backendData.structuredData === "string") {
      customStructuredDataStr = backendData.structuredData;
    } else {
      customStructuredDataStr = JSON.stringify(backendData.structuredData, null, 2);
    }
  }

  let formattedDate = "";
  if (backendData.lastModified) {
    try {
      formattedDate = new Date(backendData.lastModified).toISOString().split("T")[0];
    } catch (e) {
      formattedDate = "";
    }
  }

  return {
    metaTitle: backendData.metaTitle || "",
    metaDescription: backendData.metaDescription || "",
    focusKeyword: backendData.focusKeyword || "",
    canonicalUrl: backendData.canonicalUrl || "",
    keywords: backendData.keywords || [],
    secondaryKeywords: backendData.secondaryKeywords || [],

    index: backendData.robots?.index ?? true,
    follow: backendData.robots?.follow ?? true,
    noArchive: backendData.robots?.noarchive ?? false,
    noSnippet: backendData.robots?.nosnippet ?? false,
    noImageIndex: backendData.robots?.noimageindex ?? false,

    ogTitle: backendData.openGraph?.title || "",
    ogType: backendData.openGraph?.type || "website",
    ogDescription: backendData.openGraph?.description || "",
    ogSiteName: backendData.openGraph?.siteName || "",
    ogLocale: backendData.openGraph?.locale || "en_US",
    ogImageUrl: backendData.openGraph?.image || "",
    ogImageAlt: backendData.openGraph?.imageAlt || "",
    ogImageWidth: backendData.ogImageWidth || 1200,
    ogImageHeight: backendData.ogImageHeight || 630,
    ogUrl: backendData.openGraph?.url || "",

    twitterCardType: backendData.twitter?.card || "summary_large_image",
    twitterCreator: backendData.twitter?.creator || "",
    twitterTitle: backendData.twitter?.title || "",
    twitterDescription: backendData.twitter?.description || "",
    twitterImageUrl: backendData.twitter?.image || "",

    schemaType: backendData.schemaType || "Product",
    breadcrumbTitle: backendData.breadcrumbTitle || "",
    customStructuredData: customStructuredDataStr,
    faqSchema: backendData.faqSchema || [],
    hreflang: backendData.alternateLanguages?.map((item: any) => ({
      language: item.language,
      url: item.url
    })) || [],

    includeInSitemap: backendData.sitemapInclude ?? true,
    changeFrequency: backendData.changeFrequency || "weekly",
    priority: backendData.priority ?? 0.8,
    lastModified: formattedDate,
  };
};

export default function useMetaData() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  // Extract the page ID from any of the standard query parameter keys
  const pageList = ["route", "stay", "package", "local-info", "destination", "city", "activity"]

  let pageId: string | undefined;
  let typeOfPage: string | undefined;
  for (const page of pageList) {
    const value = searchParams.get(page);
    if (value) {
      typeOfPage = page;
      pageId = value;
      break;
    }
  }

  const { data: metaDataResult, isPending: isGetLoading, refetch } = useQuery({
    queryKey: ["metaData", pageId],
    queryFn: () => getMetaData(pageId as string),
    enabled: !!pageId,
    retry: false,
  });

  const { mutateAsync: saveMetaData, isPending: isSaveLoading } = useMutation({
    mutationFn: async (formData: SEOFormData) => {
      if (!pageId) {
        throw new Error("Page ID is missing");
      }
      const mappedData = mapFrontendToBackend(formData, pageId);
      if (metaDataResult?.success) {
        return updateMetaData(pageId, mappedData);
      } else {
        return createMetaData(pageId, typeOfPage || "", mappedData);
      }
    },
    onSuccess: (res) => {
      toast.success(res.message || "Meta data saved successfully");
      queryClient.invalidateQueries({ queryKey: ["metaData", pageId] });
    },
    onError: (err: any) => {
      toast.error(err || "Failed to save meta data");
    }
  });

  const mappedMetaData = metaDataResult?.data ? mapBackendToFrontend(metaDataResult.data) : null;

  return {
    pageId,
    metaData: mappedMetaData,
    isLoading: isGetLoading,
    isSaving: isSaveLoading,
    saveMetaData,
    refetch
  };
}
