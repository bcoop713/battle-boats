import React from 'react';
import { map } from 'ramda';

function ErrorModal({ errors, close }) {
  console.log(errors);
  return errors.matchWith({
    Success: () => '',
    Failure: ({ value }) => renderModal(value, close)
  });
}

function renderModal(errors, close) {
  const errorElems = map(error => <p>{error}</p>, errors);
  return (
    <div className="modal is-active">
      <div className="modal-background" />
      <div className="modal-content">
        <div className="notification is-danger">
          <h3 className="title">You did something wrong. Stop it</h3>
          {errorElems}
        </div>
      </div>
      <button
        className="modal-close is-large"
        onClick={close}
        aria-label="close"
      />
    </div>
  );
}

export default ErrorModal;
