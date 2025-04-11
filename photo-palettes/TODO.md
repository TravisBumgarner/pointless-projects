Explore least related colors algorithms. From chatgpt

1. K-Means with Distance from Centroids
Cluster colors (e.g., in Lab or RGB) using k-means.

For each pixel, calculate its distance from its assigned cluster centroid.

Sort pixels by farthest distance from centroid — those farthest are the least typical (outliers).

2. Mahalanobis Distance
Treat each pixel as a point in a color space (Lab preferred for perceptual uniformity).

Compute the Mahalanobis distance from the mean color, accounting for variance.

Colors with high Mahalanobis distance are statistically unusual = least related.

3. Isolation Forest (Outlier Detection)
Use an isolation forest (or one-class SVM) to detect anomalies in the color distribution.

It will return colors that are sparse and not part of dominant patterns.

4. Local Outlier Factor (LOF)
Measures local deviation of a data point with respect to its neighbors.

Colors with high LOF scores are outliers compared to their neighborhood.

5. Histogram Rarity Score
Build a histogram of all pixel colors (possibly quantized).

Score each color by 1 / frequency — rarer colors are more uniqu