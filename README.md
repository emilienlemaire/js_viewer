# js_viewer

## Initialization

```bash
yarn install
```

## Main dependencies

* React: React is used to manipulate the DOM and manage local state:
    * We use PReact at runtime, to lower the final bundle size.
* PIXIjs: PIXI is used to display the graph using WebGL.
* Redux: Redux is used for the global state.

## Development

To start the development server:

```bash
yarn start
```

## Build

To build the project

```bash
yarn build
```

## Project Tree

* **Root folder**: The files on the root folder are mainly configuration files.
* **build**: The final built javascript bundle goes there.
* **src**: All the source files of the project are here: check the [README](src/README.MD) file there for more informations.
