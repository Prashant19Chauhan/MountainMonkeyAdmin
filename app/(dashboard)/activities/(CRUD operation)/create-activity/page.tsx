"use client";
import AddActivityDrawer from "@/components/_activity/AddActivityDrawer";
import useActivity from "@/hooks/useActivity";

function CreateActivity() {
    const activityHook = useActivity();
    return (
        <div>
            <AddActivityDrawer activityHook={activityHook} />
        </div>
    )
}

export default CreateActivity