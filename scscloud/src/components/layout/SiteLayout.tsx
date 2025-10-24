import React from "react";
import Header from "../Header";
import Footer from "../Footer";

type Props = {
  children: React.ReactNode;
};

const SiteLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-slate-900 dark:bg-gradient-to-b dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 dark:text-slate-100">
      <Header />
      <main className="pt-[56px]">{/* account for fixed header */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default SiteLayout;
