import LoadingIcon from '../../../assets/animations/loading_icon';

const SubmitForm: React.FC<SubmitButtonTypes> = (props) => {
  const { description, formError, errorRef, canSubmit, submitting, formClass, buttonClass } = props;

  let submitValid = canSubmit;
  if (typeof canSubmit === 'undefined') {
    submitValid = true;
  }

  return (
    <div className={`submit-form${formClass ? ` ${formClass}` : ''}`}>
      <button
        className={'submit-form-button'
          + (submitting ? ' submitting' : '')
          + (submitValid ? '' : ' no-submit')
          + (buttonClass ? ` ${buttonClass}` : '')}
        type="submit"
      >
        {!submitting && <div className="submit-description">
          {buttonClass === 'request-sent' ? <i className="fa-solid fa-check" /> : ''} {description}
        </div>}
        {submitting && <LoadingIcon elementClass="submitting" />}
      </button>
      {formError &&
        <label className={'error-field invalid-form'}>
          <span className="error-description" ref={errorRef}>{formError}</span>
        </label>
      }
    </div>
  );
};

export interface SubmitButtonTypes {
  description: string;
  formError: string;
  submitting?: boolean;
  canSubmit?: boolean;
  errorRef?: React.MutableRefObject<HTMLDivElement | null>;
  buttonClass?: string;
  formClass?: string;
}

export default SubmitForm;
