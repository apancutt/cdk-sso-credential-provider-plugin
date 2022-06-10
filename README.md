# cdk-sso-credential-provider-plugin

Obtain credentials for each AWS account targeted by your stacks using named SSO profiles.

Allows your CDK app to deploy stacks to any account/region with a named SSO profile.

## Installation

```bash
yarn add cdk-sso-credential-provider-plugin
```

Add the plugin to your `cdk.json` file:

```json
{
  "plugin": [
    "cdk-sso-credential-provider-plugin"
  ]
}
```

Configure the apps and accounts used in your CDK project in your `package.json` file:

```json
{
  "ssoCredentialProvider": {
    "acme": {
      "dev": "123",
      "prod": "456"
    }
  }
}
```

Replace `acme` with your application name (usually the same name as the `.ts` file in the `./bin`
folder), and update the account names and IDs with those of your own.

### Profile Name Inference

The profile name is derived by the application name and account name provided in the configuration.

In the example shown above, the CDK will authenticate using the SSO profile name `acme-dev` for
account **123** and `acme-prod` for account **456**.

If you prefer to explicitly provide a profile name then use the following structure instead:

```json
{
  "ssoCredentialProvider": {
    "acme": {
      "dev": {
        "accountId": "11111111",
        "profileName": "my-custom-profile-name"
      },
      "prod": {
        "accountId": "22222222",
        "profileName": "my-other-custom-profile-name"
      }
    }
  }
}
```

## Usage

1. Ensure that you are logged in to each of the SSO organizations targeted by your CDK project:

    ```bash
    aws sso login --profile YOUR_PROFILE_NAME
    ```

2. Run your `cdk` commands as normal. You do not need to use the `--profile` option since the plugin
   will retrieve credentials when required using the [inferred profile names](#profile-name-inference).

### Share Configuration With Stacks (Optional)

To keep things [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), you may want to re-use
the configuration used by this plugin in your stack definitions, e.g.

```typescript
import { App, Stack } from 'aws-cdk-lib';
import pkg from '../package.json';

const app = new App();

// Create a stack in the acme dev account
const stack = new Stack(app, 'AcmeDevStack', {
  env: {
    account: pkg.ssoCredentialProvider.acme.dev,
  },
});

// Add resources to your stack
```

## How it Works

When the CDK encounters an account ID that it does not have credentials for it will ask the plugin
to provide them.

Internally, this plugin uses [`@aws-sdk/credential-provider-sso`](https://www.npmjs.com/package/@aws-sdk/credential-provider-sso)
to obtain credentials from your locally-configured SSO accounts using the [profile name](#profile-name-inference)
derived from the configuration provided in your `package.json`.

## Rationale

While the CDK finally supports SSO credentials when using the `--profile` option, it does support
deploying stacks to multiple accounts using named profiles within a single app.

The [`cdk-multi-profile-plugin`](https://www.npmjs.com/package/cdk-multi-profile-plugin) now
supports CDK 2 so might be a better solution for you since it works with more than just SSO. A
*slight* benefit to this plugin, however, is how the configuration is structured since it allows you
to reference the account configuration by name rather than explicit account ID (e.g. you can do
`{ env: { account: pkg.ssoCredentialProvider.acme.dev } }` instead of `{ env: { account: '11111111' } }`.
