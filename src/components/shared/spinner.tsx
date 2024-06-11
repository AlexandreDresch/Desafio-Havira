export default function Spinner({ text, className }: SpinnerProps) {
  return (
    <div
      className={`text-surface inline-block size-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white ${className}`}
      role="status"
    >
      {text && (
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          {text}
        </span>
      )}
    </div>
  );
}
