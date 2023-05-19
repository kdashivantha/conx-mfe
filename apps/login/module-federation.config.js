module.exports = {
  name: 'login',
  exposes: {
    './Module': 'apps/login/src/app/remote-entry/entry.module.ts',
    './Login2': 'apps/login/src/app/login2/login2.component.ts',
  },
};
