import DashboardPage from "@/components/dashboard/dashboard-page";
import Header from "@/components/layout/header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        <DashboardPage />
      </main>
    </div>
  );
}
