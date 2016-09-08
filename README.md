# melon-split-pane

[![Build Status](https://travis-ci.org/react-melon/melon-split-pane.svg?branch=master)](https://travis-ci.org/react-melon/melon-split-pane)
[![Coverage Status](https://coveralls.io/repos/github/react-melon/melon-split-pane/badge.svg?branch=master)](https://coveralls.io/github/react-melon/melon-split-pane?branch=master)

## Usage

```js
import React from 'react';
import SplitPane, {Pane} from 'melon-split-pane';
import ReactDOM from 'react-dom';

import './index.styl';

ReactDOM.render(
    <SplitPane direction="horizontal">
        <Pane basis={100} grow={1} shrink={0} min={200} max={500}>a</Pane>
        <Pane>b</Pane>
        <Pane>c</Pane>
    </SplitPane>,
    document.getElementById('app')
);
```

## Setup

### webpack

1. please check out [this](https://github.com/react-melon/melon#如何在-webpack-中使用-melon) first.

2. `npm install -S melon-split-pane`

### bower

1. `bower install -S melon-split-pane`
2. config your `requirejs` / `esl`

    ```js
    require.config({
        paths: {
            'melon-split-pane': 'bower_components/melon-split-pane/lib/SplitPane'
        }
    });
    ```

## API Document

check [this](https://doc.esdoc.org/github.com/react-melon/melon-split-pane/) out

## Run the example

```sh
git clone git@github.com:react-melon/melon-split-pane.git
cd melon-split-pane
npm install
npm start
open http://localhost:8080/example
```

## Thanks

Big thanks to [BrowserStack](https://www.browserstack.com) for automatic multiple browsers test support!

<a href="https://www.browserstack.com" target="_blank">
    <img src="https://d2ogrdw2mh0rsl.cloudfront.net/production/images/static/header/header-logo.svg?1473272095" style="height: 43px;" alt="BrowserStack"/>
</a>
