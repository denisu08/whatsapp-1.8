declare module 'meteor/accounts-base' {
  module Accounts {
    function requestPhoneVerification(
      phoneNumber: string,
      callback?: Function,
    ): void;
    function verifyPhone(
      phoneNumber: string,
      code: string,
      callback?: Function,
    ): void;
    function createUserWithPhone(options: Object, callback?: Function): void;
  }
}
