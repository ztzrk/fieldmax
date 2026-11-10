import time
from selenium import webdriver
from selenium.webdriver.edge.options import Options

options = Options()
options.add_argument('--headless=new')
options.add_argument('--disable-gpu')
options.binary_location = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

driver = webdriver.Edge(options=options)
url = 'https://docs.google.com/spreadsheets/d/1liZeObykbRgybki1GT51oTqS-VvVRWGw7Ha4VdOxgjg/edit?usp=sharing'
driver.get(url)
time.sleep(4)

# Execute async fetch inside the browser session
csv_data = driver.execute_async_script("""
    const done = arguments[arguments.length - 1];
    fetch('/spreadsheets/d/1liZeObykbRgybki1GT51oTqS-VvVRWGw7Ha4VdOxgjg/export?format=csv&gid=1320459213')
        .then(res => res.text())
        .then(text => done(text))
        .catch(err => done("ERROR: " + err));
""")

with open('google_sheets_data.csv', 'w', encoding='utf-8') as f:
    f.write(csv_data)

print("Saved google_sheets_data.csv! Length:", len(csv_data))
print("First 300 chars:")
print(csv_data[:300])

driver.quit()
