import { constructScopes, getIsTabValue, mergeConfigs, generateConfigs } from '../helper';
import packageJson from '../../package.json';

describe('helper', () => {
  test('constuctScopes', () => {
    expect(constructScopes()).toBeUndefined();
    expect(constructScopes('guest_read')).toBe('guest_read');
    expect(constructScopes(['guest_read', 'points_read'])).toBe('guest_read points_read');
  });

  test('getIsTabValue', () => {
    expect(getIsTabValue()).toBe('_self');
    expect(getIsTabValue(false)).toBe('_self');
    expect(getIsTabValue(true)).toBe('');
  });

  describe('mergeConfigs', () => {
    test('use value from initValues by default', () => {
      expect(
        mergeConfigs(
          {
            email: 'email',
            backTo: 'backTo',
            authAction: 'signup',
            showAuthToggle: true,
            showRememberMe: true
          },
          {}
        )
      ).toMatchObject({
        email: 'email',
        backTo: 'backTo',
        authAction: 'signup',
        showAuthToggle: true,
        showRememberMe: true
      });
    });

    test('use new value over initValues', () => {
      expect(
        mergeConfigs(
          {
            email: 'email',
            backTo: 'backTo',
            authAction: 'signup',
            showAuthToggle: true,
            showRememberMe: true
          },
          {
            email: 'newEmail',
            backTo: 'newBackTo',
            authAction: 'login',
            showAuthToggle: false,
            showRememberMe: false
          }
        )
      ).toMatchObject({
        email: 'newEmail',
        backTo: 'newBackTo',
        authAction: 'login',
        showAuthToggle: false,
        showRememberMe: false
      });
    });

    test('invalid configs will not be included', () => {
      expect(
        mergeConfigs(
          {
            email: 'email',
            backTo: 'backTo',
            authAction: 'signup',
            showAuthToggle: true,
            showRememberMe: true,
            // @ts-ignore
            whatIsThis: false
          },
          {
            whatIsThis2: false
          }
        )
      ).toMatchObject({
        email: 'email',
        backTo: 'backTo',
        authAction: 'signup',
        showAuthToggle: true,
        showRememberMe: true
      });
    });

    test('can ignore key using third parameters', () => {
      expect(
        mergeConfigs(
          {
            email: 'email',
            backTo: 'backTo',
            authAction: 'signup',
            showAuthToggle: true,
            showRememberMe: true
          },
          {
            email: 'newEmail',
            backTo: 'newBackTo',
            authAction: 'login',
            showAuthToggle: false
          },
          ['email', 'backTo']
        )
      ).toMatchObject({
        authAction: 'login',
        showAuthToggle: false,
        showRememberMe: true
      });
    });
  });

  describe('generateConfigs', () => {
    test('with parameter', () => {
      // to test hasOwnProperty not including inherit property
      const obj = Object.create({ name: 'inherit' });

      expect(
        generateConfigs(
          Object.assign(obj, {
            email: 'email',
            backTo: 'backTo',
            authAction: 'signup',
            showAuthToggle: true,
            showRememberMe: true
          })
        )
      ).toBe(
        `email=email&back_to=backTo&auth_action=signup&show_auth_toggle=true` +
          `&show_remember_me=true&sdk_platform=js&sdk_version=${packageJson.version}`
      );
    });

    test('without parameter', () => {
      expect(generateConfigs()).toBe(`sdk_platform=js&sdk_version=${packageJson.version}`);
    });
  });
});
