export default function LoadingJobDetails() {
  return (
    <div className="loadingPage">
      <div className="loadingContainer">
        <div className="loadingPill">
          <span className="loadingPillDot" />
          Loading job…
        </div>

        <div className="loadingCard">
          <div className="loadingGlowTop" />
          <div className="loadingGlowBottom" />

          <div className="loadingHeader">
            <div className="loadingMain">
              <div className="loadingTag" />
              <div className="loadingTitle" />
              <div className="loadingSubtitle" />
            </div>
            <div className="loadingLogo" />
          </div>

          <div className="loadingBody">
            <div className="loadingLine" />
            <div className="loadingLine" />
            <div className="loadingLine" />
            <div className="loadingLine" />
          </div>

          <div className="loadingActions">
            <div className="loadingAction" />
            <div className="loadingAction loadingActionAlt" />
          </div>
        </div>
      </div>
    </div>
  );
}
