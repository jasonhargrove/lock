import Immutable, { Map } from 'immutable';
import { isSmallScreen } from '../utils/media_utils';

export function setup(attrs) {
  const { clientID, domain, id } = attrs;

  return Immutable.fromJS({
    clientID: clientID,
    domain: domain,
    id: id,
    // mode: undefined,
    // show: false,
    // submitting: false,
    // render: false,

    // TODO: figure out how to handle credentials, they are specific to each mode
    credentials: {
      phoneNumber: {countryCode: "+1", number: "", valid: false, showInvalid: false},
      email: {email: "", valid: false, showInvalid: false}
    }
  });
}

export function id(m) {
  return m.get("id");
}

export function clientID(m) {
  return m.get("clientID");
}

export function domain(m) {
  return m.get("domain");
}

export function mode(m) {
  return m.get("mode");
}

export function show(m) {
  return m.get("show", false);
}

export function setSubmitting(m, value) {
  m = m.set("submitting", value);
  if (value) {
    m = clearGlobalError(m);
  }
  return m;
}

export function submitting(m) {
  return m.get("submitting", false);
}

export function render(m) {
  return m.get("render", false);
}

function extractUIOptions(id, options) {
  return new Map({
    containerID: options.container || `auth0-lock-container-${id}`,
    appendContainer: !options.container,
    icon: options.icon || false,
    closable: undefined === options.closable ? !options.container : !!options.closable,
    focusInput: undefined === options.focusInput ? !(options.container || isSmallScreen()) : !!options.focusInput,
    gravatar: undefined === options.gravatar ? true : !!options.gravatar,
    signInCallback: options.signInCallback // TODO: this doesn't belong here
  });
}

function unchangeableUIOptions(m) {
  if (ui.containerID(m)) {
    return new Map({
      containerID: ui.containerID(m),
      appendContainer: ui.appendContainer(m)
    });
  } else {
    return new Map();
  }
}

function setUIOptions(m, options) {
  const uiOptions = extractUIOptions(id(m), options);
  return m.set("ui", uiOptions.merge(unchangeableUIOptions(m)));
}

function getUIAttribute(m, attribute) {
  return m.getIn(["ui", attribute]);
}

export const ui = {
  containerID: lock => getUIAttribute(lock, "containerID"),
  appendContainer: lock => getUIAttribute(lock, "appendContainer"),
  icon: lock => getUIAttribute(lock, "icon"),
  closable: lock => getUIAttribute(lock, "closable"),
  focusInput: lock => getUIAttribute(lock, "focusInput"),
  gravatar: lock => getUIAttribute(lock, "gravatar"),
  signInCallback: lock => getUIAttribute(lock, "signInCallback")
};

export function open(m, mode, options) {
  // TODO: figure out how to make each mode handle its options, maybe even
  //       provide a hook to do more things.
  // TODO: control how modes are changed.
  const { modeOptions } = options;
  m = m.merge(Immutable.fromJS({
    show: true,
    mode: mode,
    render: true,
    modeOptions: modeOptions
  }));
  m = setUIOptions(m, options);
  return m;
}

export function modeOptions(m) {
  return m.get("modeOptions", false);
}

export function close(m) {
  return m.set("show", false);
}

export function setGlobalError(m, str) {
  return m.set("globalError", str);
}

export function globalError(m) {
  return m.get("globalError", "");
}

function clearGlobalError(m) {
  return m.remove("globalError");
}