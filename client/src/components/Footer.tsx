export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 mt-16">
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
           <div className="w-full">
             <div className="flex items-center space-x-4 mb-6">
               <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                 <img src="/favicon.ico" alt="TaskMate Logo" className="w-10 h-10" />
               </div>
               <div className="min-w-0">
                 <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                   TaskMate
                 </h3>
                 <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Productivity Simplified</p>
               </div>
             </div>
             <p className="text-slate-700 dark:text-slate-400 text-base leading-relaxed max-w-md">
               Organize and accomplish your goals with ease.
             </p>
           </div>

           <div className="w-full flex flex-col justify-start">
             <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6 flex items-center">
               Features
             </h4>
             <div className="space-y-3 text-sm text-slate-700 dark:text-slate-400">
               <div className="flex items-center space-x-3 group">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                 <p className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200">Drag & Drop Interface</p>
               </div>
               <div className="flex items-center space-x-3 group">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                 <p className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200">Real-time Progress Tracking</p>
               </div>
               <div className="flex items-center space-x-3 group">
                 <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                 <p className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200">Priority Management</p>
               </div>
               <div className="flex items-center space-x-3 group">
                 <div className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                 <p className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200">Dark/Light Mode</p>
               </div>
             </div>
           </div>
         </div>

        <div className="border-t border-slate-200 dark:border-slate-700 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium">© {currentYear} TaskMate. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Developed by </span>
                <a
                  href="https://shahzadali.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 font-semibold hover:scale-105"
                >
                  Shahzad Ali
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
