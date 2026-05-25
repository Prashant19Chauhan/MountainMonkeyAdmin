'use client'

import PackageForm from "@/components/_package/PackageForm"
import usePackage from "@/hooks/usePackage";
import { useSearchParams } from "next/navigation"
import { useEffect } from "react";

export default function UpdatePackagePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const packageHook = usePackage();
  const { setPackageId } = packageHook;
  
  useEffect(() => {
    if (id) {
      setPackageId(id);
    }
  }, [id, setPackageId]);

  return (
    <PackageForm isUpdate={true} packageHook={packageHook} />
  )
}
