/**
 * Alert — inline status message (success or error).
 */
export default function Alert({ message, type = "success" }) {
  if (!message) return null;
  return (
    <div className={type === "success" ? "alert-success" : "alert-error"}>
      {message}
    </div>
  );
}
