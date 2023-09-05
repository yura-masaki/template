const webpack = require('webpack');
const path = require('path');
const globule = require('globule');
const ENV = 'production';

const dir = {
    src: path.join(__dirname, 'src'),
    public: path.join(__dirname, 'public')
};
const convertExtensions = {
    js: 'js'
};
const mode = ENV; //development:開発, production:本番
const entry = {
    js: {}
};

Object.keys(convertExtensions).forEach(from => {
    const to = convertExtensions[from];
    globule.find([`**/*.${from}`, `!**/_*.${from}`], {
        cwd: dir['src']
    }).forEach(filename => {
        let _output = filename.replace(new RegExp(`.${from}$`, 'i'), `.${to}`);
        let _source = path.join(dir['src'], filename);
        if (_output.indexOf('js/') !== -1) {
            _output = _output.replace('js/', 'js/');
            entry['js'][_output] = _source;
        }
    });
});

const config = {
    mode: mode,
    entry: entry['js'],
    output: {
        filename: '[name]',
        publicPath: '/',
        path: dir['public']
    },
    module: {
        rules: [{
            test: /\.css/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        url: false
                    }
                }
            ],
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    resolve: {
        extensions: ['.js', '.js']
    },
};

module.exports = [config];