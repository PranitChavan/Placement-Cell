import './Button.css';

function Button({ children, onClick, className, disabled }) {
  return (
    <button role="button" onClick={onClick} className={className ? className : 'button-3'} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
