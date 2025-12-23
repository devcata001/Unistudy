module.exports = function (options, webpack) {
    return {
        ...options,
        externals: [
            ...(options.externals || []),
            {
                'bcrypt': 'commonjs2 bcrypt',
                'mock-aws-s3': 'commonjs2 mock-aws-s3',
                'aws-sdk': 'commonjs2 aws-sdk',
                'nock': 'commonjs2 nock',
            }
        ],
        plugins: [
            ...options.plugins,
            new webpack.IgnorePlugin({
                resourceRegExp: /^(mock-aws-s3|aws-sdk|nock)$/,
            }),
        ],
        module: {
            rules: [
                ...options.module.rules,
                {
                    test: /\.html$/,
                    loader: 'ignore-loader'
                }
            ]
        }
    };
};
