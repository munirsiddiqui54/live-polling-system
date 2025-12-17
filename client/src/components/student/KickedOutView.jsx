function KickedOutView() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="max-w-md w-full text-center">
        {/* Logo Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-light via-primary to-primary-dark px-4 py-2 rounded-full mb-12 shadow-md">
          <img
            src="../assets/intervue_star_icon.png"
            alt="Poll"
            className="w-3 h-3"
          />
          <span className="text-white font-semibold text-xs">
            Intervue Poll
          </span>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          You've been Kicked out !
        </h1>
        <p className="text-gray-600 text-base leading-relaxed">
          Looks like the teacher had removed you from the poll system .Please
          <br />
          Try again sometime.
        </p>
      </div>
    </div>
  );
}

export default KickedOutView;
