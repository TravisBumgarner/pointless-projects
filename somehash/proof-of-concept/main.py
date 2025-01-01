# Steps
# Import photo
# Extract 3 interesting colors
# Create output string
# Create web app and React component that can read in. 
import os
import cv2
import pillow_avif
import numpy as np
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from PIL import Image


def some_hash(image_path, num_colors=5):
    # Check the file extension
    extension = image_path.split('.')[-1].lower()
    
    if extension == 'avif':
        # Load the image using Pillow for AVIF format
        image = Image.open(image_path)
        image = image.convert('RGB')  # Convert to RGB
        image = np.array(image)  # Convert to a NumPy array
    else:
        # Load the image using OpenCV for other formats
        image = cv2.imread(image_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert to RGB
    
    # Reshape the image to a 2D array of pixels
    pixels = image.reshape(-1, 3)
    
    # Apply K-means clustering
    kmeans = KMeans(n_clusters=num_colors)
    kmeans.fit(pixels)
    
    # Get the colors
    colors = kmeans.cluster_centers_.astype(int)
    
    # Display the colors
    plt.figure(figsize=(8, 6))
    plt.imshow([colors])
    plt.axis('off')
    plt.show()


def read_files(input_dir):
    INCLUDED_FILES = ['jpg', 'png', 'avif']

    files = []
    for filename in os.listdir(input_dir):
        if not os.path.isfile(os.path.join(input_dir, filename)):
            continue
        
        extension = filename.split('.')[-1]
        if not extension in INCLUDED_FILES:
            continue

        files.append(filename)

    return files


def main(dir: str):
    files = read_files(dir)
    output = dict()
    for file in files:
        output[file] = some_hash(os.path.join(dir, file))
        print(output)
    return output


if __name__ == "__main__":
    input_dir = "./input"
    print(main(input_dir))
