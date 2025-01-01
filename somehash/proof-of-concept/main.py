import os
import cv2
import numpy as np
from sklearn.cluster import KMeans
from PIL import Image
import base64
import json
import pillow_avif # Actually used.
import matplotlib.pyplot as plt

def some_hash(image_path, num_colors=5):
    extension = image_path.split('.')[-1].lower()
    
    if extension == 'avif':
        image = Image.open(image_path)
        image = image.convert('RGB') 
        image = np.array(image)
        aspect_ratio = image.shape[1] / image.shape[0]
    else:
        image = cv2.imread(image_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) 
        aspect_ratio = image.shape[1] / image.shape[0]
    
    pixels = image.reshape(-1, 3)
    
    kmeans = KMeans(n_clusters=num_colors)
    kmeans.fit(pixels)
    colors = kmeans.cluster_centers_.astype(int)
    
    color_string = '_'.join([f'{r}-{g}-{b}' for r, g, b in colors])
    
    encoded_bytes = base64.b64encode(color_string.encode('utf-8'))
    encoded_string = encoded_bytes.decode('utf-8')
    
    return {'encoded_string': encoded_string, 'aspect_ratio': aspect_ratio}

def read_files(input_dir):
    SUPPORTED_EXTENSIONS = ['jpg', 'png', 'avif']

    files = []
    for filename in os.listdir(input_dir):
        if not os.path.isfile(os.path.join(input_dir, filename)):
            continue
        
        extension = filename.split('.')[-1]
        if not extension in SUPPORTED_EXTENSIONS:
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
    output = main(input_dir)
    with open("./react-app/src/output.json", "w") as f:
        json.dump(output, f)