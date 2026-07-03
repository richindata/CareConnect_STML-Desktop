// Simple placeholder screen for the sections beyond Home. The Home dashboard is
// the fully-built screen; these keep the navigation, routing and shortcuts
// working end to end.
export default function Placeholder({ icon, title, description }) {
  return (
    <div className="placeholder">
      <div className="placeholder__icon" aria-hidden="true">{icon}</div>
      <h1 className="placeholder__title">{title}</h1>
      <p className="placeholder__desc">{description}</p>
    </div>
  );
}
