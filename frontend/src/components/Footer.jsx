import React from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="z-50 bg-white/5 backdrop-blur-md shadow-md text-gray-300 py-4 mt-8 w-full absolute bottom-0">
      <div className="container mx-auto flex flex-col md:flex-row justify-center items-center px-6">
        <p className="text-sm">
          &copy; {currentYear} Arbaj Khan. All rights reserved.
        </p>
       
      </div>
    </footer>
  );
}
