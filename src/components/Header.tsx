import { useAppContext } from '@/lib/context';

/*
 * Header component with multiple path options for the logo.
 * Uncomment different <img> elements to try different paths
 * until you find one that works with your project setup.
 */
export function Header() {
  const { step } = useAppContext();
  
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              {/* OPTION 1: Absolute path from domain root */}
              <img 
                src="logo.png" 
                alt="Connect" 
                style={{ height: '100px', width: 'auto' }}
                className="h-10 w-auto object-contain"
              />
              
                        </a>
          </div>
          
          <div className="flex items-center">
            <nav className="flex space-x-1">
              {[1, 2, 3].map((stepNumber) => (
                <div 
                  key={stepNumber}
                  className="flex items-center"
                >
                  <div 
                    className={`
                      rounded-full h-8 w-8 flex items-center justify-center
                      ${stepNumber === step 
                        ? 'bg-primary text-white' 
                        : stepNumber < step 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {stepNumber}
                  </div>
                  
                  {stepNumber < 3 && (
                    <div 
                      className={`
                        w-8 h-0.5 
                        ${stepNumber < step ? 'bg-primary' : 'bg-muted'}
                      `}
                    />
                  )}
                </div>
              ))}
            </nav>
            
            <div className="ml-4 hidden sm:block">
              <span className="text-sm font-medium">
                {step === 1 && 'Select Role'}
                {step === 2 && 'Select Needs'}
                {step === 3 && 'View Resources'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}