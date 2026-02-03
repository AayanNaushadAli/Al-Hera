import { redirect } from "next/navigation";

export default function ChildrenIndexPage() {
    // If someone lands here by mistake, send them back to the dashboard
    redirect("/parent");
}