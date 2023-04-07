<div align='center'>
  <a href="https://plugins.lapce.dev/plugins/Hyduez/dou.lapcord">
    <img width="200" src="assets/logo.png">
  </a>
  <h1> Lapcord-server </h1>
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
- [Contributing](#contributing)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Support](#support)
- [Contributors](#contributors)
- [Credits](#credits)

## Getting Started
First of all to start using Lapcord you will have to install its extension in Lapce, which is available at [plugins.lapce.dev](https://plugins.lapce.dev).

### Installing Lapcord
| ✨ | Type | Command |
|----|-------|-------|
| ✅ | NPM | `$ npm install -g lapcord` |
| ✅ | Yarn | `$ yarn global add lapcord` |

###### Make sure you have your package manager binaries installed in your system path.

Now you should have the Lapcord binaries installed globally.

To check it run `lapcord`. If it finds the command is because it is installed correctly, otherwise it is not.

### Using Lapcord

By logic you've to open Lapce and have a Discord session open on your desktop for the server to start and connect to Discord through a presence.

Now your Discord profile should display a presence like this:

<div>
  <img src='https://envs.sh/hKh.png' alt='discord-rpc' width='290'>
</div>

###### If you do not have a Discord session on your desktop, Lapcord will show a notification in Lapce indicating that an error has occurred.

## Contributing

See [CONTRIBUTING.md](https://github.com/doupkg/lapcord-server/blob/master/CONTRIBUTING.md).

## Frequently Asked Questions

> “Why must it be a server?” 

Because Lapce plugins are compiled in WASI, which disables several features such as the OS library. This, added to many other things, makes it impossible to realize an IPC system. So we use a server that is installed separately to connect to Lapce and to be able to interleave an IPC system correctly.

> “I've read the code, it looks like you are using wrong events.”

Yeah, maybe. We have tested with all the events that `vscode-languageserver` offers us, like the `Connection` and `TextDocuments` class, some of these events we decreed that they were not emitted, for some reason that we don't know. Or some simply did not work the way we expected. For example, the `onDidOpen()` event was only emitted once, so it didn't work for us. The `onDidClose()` event is not even emitted.

## Support
We are more active on Discord. [Click here](https://discord.gg/uujENVrXUC).

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/DexSlender"><img src="https://avatars.githubusercontent.com/u/91853649?v=4?s=100" width="100px;" alt="DexSlender"/><br /><sub><b>DexSlender</b></sub></a><br /><a href="https://github.com/doupkg/lapcord-server/commits?author=DexSlender" title="Code">💻</a> <a href="#ideas-DexSlender" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/doupkg/lapcord-server/commits?author=DexSlender" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://matrix.to/#/@paulo:envs.net"><img src="https://avatars.githubusercontent.com/u/79933487?v=4?s=100" width="100px;" alt="Paulo"/><br /><sub><b>Paulo</b></sub></a><br /><a href="https://github.com/doupkg/lapcord-server/commits?author=hyduez" title="Code">💻</a> <a href="#maintenance-Hyduez" title="Maintenance">🚧</a> <a href="#ideas-Hyduez" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/doupkg/lapcord-server/commits?author=DexSlender" title="Tests">⚠️</a></td>
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
