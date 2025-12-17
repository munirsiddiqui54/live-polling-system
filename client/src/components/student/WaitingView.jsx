function WaitingView() {
  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-2xl mx-auto text-center pt-40">
        <div
          className="inline-flex items-center gap-2
          bg-gradient-to-r from-primary-light via-primary to-primary-dark
          px-4 py-2 rounded-full mb-8
          shadow-md"
        >
          <img
            src="../assets/intervue_star_icon.png"
            alt="Poll"
            className="w-3 h-3"
          />
          <span className="text-white font-semibold text-xs">
            Intervue Poll
          </span>
        </div>
        
        <div className="mt-4 flex justify-center">
          <div className="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
        </div>

        <h2 className="text-2xl font-bold text-neutral-dark my-4">
          Waiting for the teacher to ask questions...
        </h2>
      </div>
    </div>
  );
}

export default WaitingView;
