import requests
import json


API_KEY = 'AIzaSyBSOiZeTa0NY6dsSUfFeQR6jzZTOJxFuRw'
CX = 'f11664eb2b1c149e0'


params = {
    'key': API_KEY,
    'cx': CX,
    'searchType': 'image',
    'gl': 'de',  # Germany
    'hl': 'de',  # German language
}

def get_image_link(query):
    params['q'] = query
    response = response = requests.get('https://www.googleapis.com/customsearch/v1', params=params).json()
    
    print(response)
    if 'items' in response:
        print(response['items'])
        return response['items'][0]['link']
    return None

with open('src/assets/reality_stars.json', 'r', encoding='utf-8') as file:
    data = json.load(file)  # Reads the file and converts it to a Python dictionary

for star in data:
    image_url = get_image_link(star['name'])
    star['image_url'] = image_url

with open('src/assets/reality_stars.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=2)