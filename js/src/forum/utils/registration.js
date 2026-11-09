export function redirectToStart() {
  window.location.href = `${app.forum.attribute('baseUrl')}/start`;
}

export function submitRegistrationModal(modal, event) {
  event.preventDefault();
  modal.loading = true;

  return app
    .request({
      url: `${app.forum.attribute('baseUrl')}/register`,
      method: 'POST',
      body: modal.submitData(),
      errorHandler: modal.onerror.bind(modal),
    })
    .then(redirectToStart, modal.loaded.bind(modal));
}
