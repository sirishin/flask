# from flask import Flask, render_template

# app = Flask(__name__)

# @app.route("/")
# def index():
#     return render_template('./index.html')
from flask import Flask, render_template, request
from gtts import gTTS
import pygame
import io
import time

app = Flask(__name__)

def number_to_korean(num):
    units = ['', '십', '백', '천']
    nums = '일이삼사오육칠팔구'
    result = ''
    num_str = str(num)
    length = len(num_str)

    for i, digit in enumerate(num_str):
        n = int(digit)
        if n != 0:
            result += nums[n - 1] + units[length - i - 1]
    return result

def call_customer(num):
    korean_number = number_to_korean(num)
    text = f"{korean_number}번 고객님, 음료 나왔습니다."

    tts = gTTS(text=text, lang='ko')
    fp = io.BytesIO()
    tts.write_to_fp(fp)
    fp.seek(0)

    pygame.mixer.init()
    pygame.mixer.music.load(fp)
    pygame.mixer.music.play()

    while pygame.mixer.music.get_busy():
        time.sleep(0.1)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        number = request.form.get('number')
        try:
            number = int(float(number))  # '23.0'도 '23'으로 처리
            call_customer(number)
        except:
            pass
    return render_template('calculator.html')

if __name__ == '__main__':
    app.run(debug=True)
