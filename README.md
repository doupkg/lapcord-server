<div align='center'>
  <a href="https://plugins.lapce.dev/plugins/Hyduez/dou.lapcord">
    <img width="200" src="assets/logo.png">
  </a>
  <h1> lapcord-server </h1>
</div>

<div align='center'>

  <img alt="Discord" src="https://img.shields.io/discord/876339668956893216?label=Discord&logo=Discord">
  <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/doupkg/lapcord-server/github-packages.yml?label=Build&logo=GitHub%20Actions">
  <img alt="npm" src="https://img.shields.io/npm/v/lapcord?label=Lapcord&logo=npm">
  <img alt="GitHub contributors (via allcontributors.org)" src="https://img.shields.io/github/all-contributors/doupkg/lapcord-server?label=Contributors&logo=Handshake">
  <img alt="GitHub" src="https://img.shields.io/github/license/doupkg/lapcord-server?label=License&logo=GitHub">
  
</div>

## Table of Contents

- [Getting Started](#getting-started)
  - [Installing Lapcord](#installing-lapcord)
  - [Using Lapcord](#using-lapcord)
  - [Lapcord logs](#lapcord-logs)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [Credits](#credits)

## Getting Started

To begin using Lapcord you will have to install its extension in Lapce, which can be found at [plugins.lapce.dev](https://plugins.lapce.dev).

### Installing Lapcord

| Package Manager | Command |
| ----- | ------ |
| NPM | `$ npm install -g lapcord` |
| Yarn | `$ yarn global add lapcord` |
| PNPM | `$ pnpm add -g lapcord` |

###### Ensure that you have the package manager binaries installed in your path.

Now, Lapcord binaries should be installed globally.

To verify the installation, run `lapcord`. If the command is recognized, it means Lapcord is installed correctly; otherwise, it is not.

### Using Lapcord

Open Lapce in a folder. Your Discord profile should now display a presence like this:

<details>
  <summary>Preview</summary>
  <br />
  <img src='https://i.imgur.com/ttCbBkM.png' alt='discord-rpc' />
</details>

###### If you don't have Discord open on your computer, Lapcord will notify you that an error occurred

### Lapcord logs

Lapcord logs initialization events and errors in Lapce's logs. It stores its cache in the `.cache` directory within the module folder to avoid excessive requests to the npm API for registering the latest version and to prevent ratelimit.

## Configuration

Lapcord configuration is split into two sections: editing and idle configuration. Each section has templates with keywords for internal property usage.

#### Editing syntax

| Keyword | Description | Output |
| ------- | ----------- | ------ |
| {{file_name} | File name | index.ts |
| {{file_ext}} | File extension | .ts |
| {{language_asset}} | Language asset | typescript |
| {{language_capital}} | Language capital | TYPESCRIPT |  
| {{language_id}} | Language ID | TypeScript |
| {{workspace_name}} | Workspace name | project |
| {{workspace_path}} | Workspace path | /home/usr/project/ |

#### Idle syntax

| Keyword | Description | Output |
| ------- | ----------- | ------ |
| {{workspace_name}} | Workspace name | project |
| {{workspace_path}} | Workspace path | /home/usr/project/ |

## Contributing

See [CONTRIBUTING.md](https://github.com/doupkg/lapcord-server/blob/master/CONTRIBUTING.md).

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/DexSlender"><img src="https://avatars.githubusercontent.com/u/91853649?v=4?s=100" width="100px;" alt="DexSlender"/><br /><sub><b>DexSlender</b></sub></a><br /><a href="https://github.com/doupkg/lapcord-server/commits?author=DexSlender" title="Code">💻</a> <a href="#ideas-DexSlender" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/doupkg/lapcord-server/commits?author=DexSlender" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://matrix.to/#/@paulo:envs.net"><img src="https://avatars.githubusercontent.com/u/79933487?v=4?s=100" width="100px;" alt="Paulo"/><br /><sub><b>Paulo</b></sub></a><br /><a href="https://github.com/doupkg/lapcord-server/commits?author=hyduez" title="Code">💻</a> <a href="#maintenance-Hyduez" title="Maintenance">🚧</a> <a href="#ideas-Hyduez" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.jesusale.cf/"><img src="https://avatars.githubusercontent.com/u/54212600?v=4?s=100" width="100px;" alt="Jesus Alejandro"/><br /><sub><b>Jesus Alejandro</b></sub></a><br /><a href="https://github.com/doupkg/lapcord-server/commits?author=jesus-ale43" title="Code">💻</a> <a href="#design-jesus-ale43" title="Design">🎨</a> <a href="https://github.com/doupkg/lapcord-server/commits?author=jesus-ale43" title="Tests">⚠️</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Credits

- [smokes/vscode-discord-assets](https://github.com/smokes/vscode-discord-assets): for the icons.
- [xhayper/discord-rpc](https://github.com/xhayper/discord-rpc): for the RPC client.
