// A template is made afresh on every navigation, so each page fades in the same way
// (.page-in in globals.css), whether or not it has any motion of its own.
export default function Template({ children }) {
  return <div className="page-in">{children}</div>;
}
