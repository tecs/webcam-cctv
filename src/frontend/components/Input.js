import React from 'react';

/**
 * Detects when submitting an input field by pressing the 'Enter' key
 * and passes the input's value to the supplied handler
 *
 * @param {Object} event KeyboardEvent object
 * @param {String} event.key The keyboard key that has been pressed
 * @param {Object} event.target EventTarget object
 * @param {String} event.target.value The submitted value
 * @param {Function} handler
 */
const submit = ({ key, target: { value }}, handler) => {
  if (key === 'Enter' && value) {
    handler(value);
  }
};

/**
 * @param {Object} params
 * @param {String} params.placeholder The placeholder value of the input
 * @param {Function} params.handler Callback to receive the submitted input value
 * @param {String} [params.type='input'] The type of the input. Should be a valid `HTMLInputElement#type` value
 * @returns {React.Component}
 */
const Input = ({ placeholder, handler, type = 'input' }) => (
  <div className="row mt-5">
    <div className="col-2 col-sm-3 col-md-4 col-xl-5"></div>
    <div className="col-8 col-sm-6 col-md-4 col-xl-2">
      <input placeholder={placeholder} onKeyPress={e => submit(e, handler)} type={type} className="form-control form-control-lg text-center" />
    </div>
    <div className="col-2 col-sm-3 col-md-4 col-xl-5"></div>
  </div>
);

export default Input;
