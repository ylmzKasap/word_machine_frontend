export const PasswordField: React.FC<PasswordFieldTypes> = (
  {
    fieldId,
    className,
    description,
    value,
    handleChange,
    handleFocusOut,
    error,
    autoComplete,
    showPassword,
    required}
) => {

  return (
    <section className="form-section">
      <label className="form-label" htmlFor={fieldId}>
        {description}
      </label>
      <input
        id={fieldId}
        className={`${className}` + (error ? ' error' : '')}
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={handleChange}
        onBlur={handleFocusOut}
        autoComplete={autoComplete ? 'on' : 'new-password'}
        required={required === undefined ? true : required}
      />
      {error && 
      <section className="form-error">
        {error}
      </section>}
    </section>
  );
};

interface PasswordFieldTypes {
  fieldId: string;
  className?: string;
  description: string;
  value: string;
  handleChange: (event: React.ChangeEvent) => void;
  handleFocusOut?: (event: React.FocusEvent) => void;
  error?: string;
  autoComplete?: boolean;
  showPassword?: boolean;
  required?: boolean;
};
