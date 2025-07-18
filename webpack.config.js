{
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
    'postcss-loader' // ✅ This runs Tailwind
  ],
}
