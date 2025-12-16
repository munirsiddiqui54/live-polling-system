function KickedOut() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-light">
      <div className="max-w-md w-full text-center">
        {/* Logo Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-light via-primary to-primary-dark px-4 py-2 rounded-full mb-8 shadow-md">
          <img
            src="../assets/intervue_star_icon.png"
            alt="Poll"
            className="w-3 h-3"
          />
          <span className="text-white font-semibold text-xs">
            Intervue Poll
          </span>
        </div>

        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-neutral-dark mb-3">
          You've been Kicked out !
        </h1>
        <p className="text-neutral-gray text-lg mb-8">
          Looks like the teacher had removed you from the poll system. Please Try again sometime.
        </p>

        {/* Button */}
        <button
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default KickedOut;
