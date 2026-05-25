'use client'

import PackageForm from "@/components/_package/PackageForm"
import usePackage from "@/hooks/usePackage";

export default function CreatePackagePage() {
  const packageHook = usePackage();
  return (
    <PackageForm isUpdate={false} packageHook={packageHook} />
  )
}
