import { Outlet, useLocation } from "react-router-dom";
import { Navigation } from "../../components/Navigation/Navigation";
import { PageTransition } from "../../components/PageTransition/PageTransition";
import { AnimatePresence } from "motion/react";

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-sans overflow-hidden">
      <Navigation />
      
      <main className="flex-grow relative z-10" style={{ perspective: "1200px" }}>
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
    </div>
  );
}
