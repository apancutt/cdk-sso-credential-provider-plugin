# cdk-sso-credential-provider-plugin

Obtain credentials for each AWS account targeted by your stacks using named SSO profiles.

Supports both CDK v1 and v2.

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
        "accountId": "123",
        "profileName": "my-custom-profile-name"
      },
      "prod": {
        "accountId": "456",
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

2. Run your `cdk` commands as normal.

### Share Configuration With Stacks (Optional)

To keep things [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), you may want to re-use
the configuration used by this plugin in your stack definitions, e.g.

```typescript
// Uncomment one of the lines below according to the CDK version you use
//import * as cdk from '@aws-cdk/core'; // CDK v1
//import * as cdk from 'aws-cdk-lib'; // CDK v2
import pkg from '../package.json';

const app = new cdk.App();

// Create a stack in the acme dev account
const stack = new cdk.Stack(app, 'AcmeDevStack', {
  env: {
    account: pkg.ssoCredentialProvider.acme.dev,
  },
});

// Add resources to your stack
```

## How it Works

When the CDK needs credentials for an account ID it will ask the plugin to provide them.

The plugin uses [`@aws-sdk/credential-provider-sso`](https://www.npmjs.com/package/@aws-sdk/credential-provider-sso) to yeild credentials from your locally-configured SSO accounts using the [profile name](#profile-name-inference)
derived from the configuration provided in your `package.json`.

## Rationale

Neither CDK v1 nor v2 support SSO credentials. While there are several workarounds, this plugin aims
to provide the simplest solution. Hopefully, this will be temporary until the CDK support SSO
credentials natively.

A similar package named [`cdk-multi-profile-plugin`](https://www.npmjs.com/package/cdk-multi-profile-plugin)
also exists which attempts to address this issue but it does not work with CDK v2.
