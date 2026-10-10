/* NEXYRA Consulting website: public runtime configuration.
   Values here reach the browser. Never put server secrets in this file.
   See CONFIGURATION_CHECKLIST.md. */
window.NEXYRA_SITE_CONFIG = {
  // REQUIRED. Web3Forms access key for the Contact form (web3forms.com > Dashboard).
  // Web3Forms keys are public by design; restrict the key to your domain in the Web3Forms dashboard.
  web3formsAccessKey: "REPLACE_WITH_WEB3FORMS_ACCESS_KEY",
  // Address shown when the form is not configured or fails.
  contactEmail: "hello@nexyraconsulting.co.uk"
};
