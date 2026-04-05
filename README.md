# FrontEnd ezaudita

## Requirements

- Node version 18.15.0 (we recommend use [nvm](https://github.com/nvm-sh/nvm) for this)
- [Yarn ](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)

## Installation

In order to run the local server, follow these steps:

1. Clone this repository `git clone git@github.com:solucioncp/ezaudita-frontend.git`
2. In root directory run the command `yarn` to install all dependencies
3. Create a `.env` file in root directory (you can view an example of what does env file needs in the `.env.example` file located in this repo)
4. In root directory run the command `yarn dev`

## Contributing

### Most important rules

- Only include one React component per file
- Always use JSX syntax
- Use PascalCase for filenames. E.g., `ReservationCard.jsx`
- Use PascalCase for React components and camelCase for their instances

### **Absolute Imports**

Absolute imports it's a way to import our files in our code in a more accessible, more readable form, while regularly if you're deep into the file tree, you'll need to go top as many times as necessary to access a file, now you can access the folders directly on your "src" folder directly.

**Example Before absolute imports:**

```JS
import SATManualSyncModal from '../../../components/SATSyncSATManualSync'

```

**Example After absolute imports:**

```JS
import SATManualSyncModal from '@components/SATSync/SATManualSync'

```

### **Proper way to register a new folder**

First go to your `craco.config.js` file, then on the webpack section add your folder like this:

```JS
{
    webpack: {
        alias: {
            '@folder': path.resolve(__dirname, 'src/folder'),
        },
    }
}
```

Once your Craco is configured go to your `.eslint.json` file add your new folder like this:

```JS
{
    "import/resolver": {
    "alias": {
        "map": [
          ["@folder", "./src/folder"],
        ],
      },
    }
}
```

Finally for Typescript auto completion go to the file `tsconfig.paths.json` and add inside the paths object your folder:

```JS
{
    "paths": {
      "@folder/*": ["src/folder/*"],
    }
}
```

And that's it! now your folder will be access by both the `craco` process and Visual Studio Code to auto import the files.

### Small Note

We don't recommend changing the configuration of the `baseUrls` or anything related to the source, since it will crash every import, before thinking about it first contact somebody in the team and make a strong case why you need to change it.

## Tech used

- [Vite](https://vitejs.dev/)
- [React](https://es.react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Redux Saga](https://redux-saga.js.org/)
- [Axios](https://axios-http.com/es/docs/api_intro)
- [React Router](https://reactrouter.com/en/main)
- [Ant-design](https://ant.design/)
- [Sass](https://sass-lang.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Lodash](https://lodash.com/)

> Of course you can view the full list in the `package.json` file.
