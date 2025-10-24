import React from "react";
import Header from "../Header";
import Footer from "../Footer";

type Props = {
  children: React.ReactNode;
};

const SiteLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <Header />
      <main className="pt-[56px]">{/* account for fixed header */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default SiteLayout;
