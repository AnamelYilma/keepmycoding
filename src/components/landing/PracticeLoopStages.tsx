import { LANDING_STAGES, LandingStageId } from './landing-stages';

interface PracticeLoopStagesProps {
  activeStage: LandingStageId;
  prefersReducedMotion: boolean;
}

export function PracticeLoopStages({
  activeStage,
  prefersReducedMotion,
}: PracticeLoopStagesProps) {
  return (
    <div className="practice-stages" aria-label="The KeepCoding practice loop">
      {LANDING_STAGES.map((stage) => {
        const isActive = stage.id === activeStage;

        return (
          <div
            key={stage.id}
            className={`practice-stage ${isActive ? 'practice-stage--active' : ''}`}
            aria-current={isActive ? 'step' : undefined}
          >
            <div className="practice-stage__index">
              <span>{stage.label}</span>
              <span className="practice-stage__dot" aria-hidden="true" />
            </div>
            <div>
              <h2>{stage.title}</h2>
              <p>{stage.description}</p>
            </div>
          </div>
        );
      })}
      <p className="sr-only">
        {prefersReducedMotion
          ? 'Motion is reduced. All practice stages are available in sequence.'
          : `Current stage: ${activeStage}. Scroll to move through the practice loop.`}
      </p>
    </div>
  );
}
