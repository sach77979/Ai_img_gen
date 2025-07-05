import { BarChart3 } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Data Canvas</h1>
        </div>
      </div>
    </header>
  );
}
