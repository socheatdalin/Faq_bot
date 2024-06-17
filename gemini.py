import pathlib
import textwrap
import os
import google.generativeai as genai
from dotenv import load_dotenv
import requests

from IPython.display import display
from IPython.display import Markdown
import PIL.Image

load_dotenv()

def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

GOOGLE_API_KEY=os.getenv('GOOGLE_API_KEY')

genai.configure(api_key=GOOGLE_API_KEY)

def vision(prompt, img_url):

    model = genai.GenerativeModel("gemini-pro-vision")
    img = PIL.Image.open(requests.get(img_url, stream=True).raw)
    response = model.generate_content(prompt, img)
    to_markdown(response.text)

    return response.text

def chat(prompt):
    model = genai.GenerativeModel('gemini-1.5-flash')
    chat = model.start_chat(history=[])
    response = chat.send_message(prompt)
    to_markdown(response.text)
    return response.text
  
# async def fetch_weather(api_key, city):
#     url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}'
#     async with aiohttp.ClientSession() as session:
#         async with session.get(url) as response:
#             weather_data = await response.json()
#     return weather_data

# # Function to send data to Gemini AI
# async def send_to_gemini(weather_data, gemini_api_url, gemini_api_key):
#     headers = {
#         'Authorization': f'Bearer {gemini_api_key}',
#         'Content-Type': 'application/json'
#     }
#     async with aiohttp.ClientSession() as session:
#         async with session.post(gemini_api_url, headers=headers, json=weather_data) as response:
#             response_data = await response.json()
#     return response.status, response_data
